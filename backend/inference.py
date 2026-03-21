import tensorflow as tf
import cv2
import numpy as np
import base64
import logging
import os
from model import CSRNet

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CrowdCounter")

class CrowdCounter:
    def __init__(self):
        self.model = None
        self.simulation_mode = False
        self.load_model()
        
    def load_model(self):
        try:
            # Initialize model architecture
            self.model = CSRNet(input_shape=(None, None, 3))
            
            weights_path = "weights.h5"
            if os.path.exists(weights_path):
                self.model.load_weights(weights_path)
                logger.info(f"Successfully loaded {weights_path}")
            else:
                logger.warning(f"Weights file {weights_path} not found. Running in SIMULATION MODE.")
                self.simulation_mode = True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.simulation_mode = True

    def process_frame(self, frame, render_heatmap=True):
        """
        Input: Raw video frame (BGR numpy array)
        Output: (total_count, zone_counts_dict, processed_image_base64)
        """
        orig_h, orig_w = frame.shape[:2]
        
        # 1. Resize to fixed width 640px for inference speed
        target_w = 640
        scale = target_w / orig_w
        target_h = int(orig_h * scale)
        frame_resized = cv2.resize(frame, (target_w, target_h))
        
        density_map = None
        count = 0
        
        if self.simulation_mode:
            # Simulation Logic
            h, w = target_h // 8, target_w // 8
            density_map = np.zeros((h, w), dtype=np.float32)
            # Add random blobs
            for _ in range(5):
                cx, cy = np.random.randint(0, w), np.random.randint(0, h)
                sigma = 3
                y, x = np.ogrid[-cy:h-cy, -cx:w-cx]
                blob = np.exp(-(x*x + y*y) / (2*sigma*sigma))
                density_map += blob * np.random.uniform(5, 10)
            count = np.sum(density_map) 
        else:
            # 2. Preprocessing
            frame_norm = frame_resized.astype(np.float32)
            frame_norm[:, :, 0] -= 103.939 # B
            frame_norm[:, :, 1] -= 116.779 # G
            frame_norm[:, :, 2] -= 123.68  # R
            
            input_tensor = np.expand_dims(frame_norm, axis=0)
            
            # 3. Inference
            pred = self.model.predict(input_tensor)
            density_map = pred[0, :, :, 0]
            
            # Calibration: Scaler adjust for high counts
            calibration_factor = 0.35 
            density_map = density_map * calibration_factor
            
            # Safety: Remove potential negative values (noise)
            density_map = np.maximum(density_map, 0)
            
            count = np.sum(density_map)

        # 4. Zone Analysis
        dh, dw = density_map.shape
        cy, cx = dh // 2, dw // 2
        zones = {
            "Zone_TL": float(np.sum(density_map[0:cy, 0:cx])),
            "Zone_TR": float(np.sum(density_map[0:cy, cx:dw])),
            "Zone_BL": float(np.sum(density_map[cy:dh, 0:cx])),
            "Zone_BR": float(np.sum(density_map[cy:dh, cx:dw]))
        }

        # 5. Visualization
        overlay = frame.copy()
        
        if render_heatmap:
            dmap_upscaled = cv2.resize(density_map, (orig_w, orig_h))
            norm_dmap = cv2.normalize(dmap_upscaled, None, 0, 255, cv2.NORM_MINMAX)
            norm_dmap = norm_dmap.astype(np.uint8)
            heatmap = cv2.applyColorMap(norm_dmap, cv2.COLORMAP_JET)
            
            # Overlay on ORIGINAL frame
            overlay = cv2.addWeighted(frame, 0.6, heatmap, 0.4, 0)
            
            # Draw Zone Lines (Neon Yellow: B=0, G=255, R=255) ONLY if heatmap is enabled
            center_y = orig_h // 2
            center_x = orig_w // 2
            color = (0, 255, 255) # Neon Yellow
            
            # Horizontal line
            cv2.line(overlay, (0, center_y), (orig_w, center_y), color, 2)
            # Vertical line
            cv2.line(overlay, (center_x, 0), (center_x, orig_h), color, 2)
            
            # Add labels
            font_scale = 0.8
            thickness = 2
            cv2.putText(overlay, "Zone_TL", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)
            cv2.putText(overlay, "Zone_TR", (center_x + 20, 40), cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)
            cv2.putText(overlay, "Zone_BL", (20, center_y + 40), cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)
            cv2.putText(overlay, "Zone_BR", (center_x + 20, center_y + 40), cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)
        
        _, buffer = cv2.imencode('.jpg', overlay)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return float(count), zones, img_base64
