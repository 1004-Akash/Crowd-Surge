import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from model import CSRNet

def generate_dummy_data(samples=10, img_shape=(256, 256, 3)):
    """Generate dummy data for demonstration if no dataset is found."""
    images = np.random.uniform(0, 255, (samples, *img_shape)).astype(np.float32)
    # Density map output is 1/16th of input size in this CSRNet implementation (block4_pool)
    density_shape = (img_shape[0] // 16, img_shape[1] // 16, 1)
    density_maps = np.random.uniform(0, 1, (samples, *density_shape)).astype(np.float32)
    return images, density_maps

def train_and_plot():
    # 1. Initialize Model
    model = CSRNet(input_shape=(256, 256, 3))
    
    # Compile with MSE loss and MAE as accuracy proxy (since it's regression)
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    
    # 2. Get Data
    print("Generating dummy training data...")
    x_train, y_train = generate_dummy_data(samples=20)
    x_val, y_val = generate_dummy_data(samples=5)
    
    # 3. Train
    print("Starting training...")
    history = model.fit(
        x_train, y_train,
        validation_data=(x_val, y_val),
        epochs=5,
        batch_size=2,
        verbose=1
    )
    
    # 4. Save results as images
    print("Generating plots...")
    
    # Extract metrics
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    mae = history.history['mae']
    val_mae = history.history['val_mae']
    epochs = range(1, len(loss) + 1)

    # Plot Loss Curve
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(epochs, loss, 'bo-', label='Training Loss (MSE)')
    plt.plot(epochs, val_loss, 'ro-', label='Validation Loss (MSE)')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)

    # Plot Accuracy (MAE) Curve
    plt.subplot(1, 2, 2)
    plt.plot(epochs, mae, 'go-', label='Training MAE (Accuracy proxy)')
    plt.plot(epochs, val_mae, 'yo-', label='Validation MAE')
    plt.title('Training and Validation MAE')
    plt.xlabel('Epochs')
    plt.ylabel('Mean Absolute Error')
    plt.legend()
    plt.grid(True)

    # Save the combined plot
    plot_path = os.path.join("data", "training_performance.png")
    if not os.path.exists("data"):
        os.makedirs("data")
    plt.tight_layout()
    plt.savefig(plot_path)
    print(f"Plot saved to: {plot_path}")
    
    # 5. Save model weights
    model.save_weights("weights.h5")
    print("Weights saved to weights.h5")

if __name__ == "__main__":
    train_and_plot()
