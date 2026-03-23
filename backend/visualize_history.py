import matplotlib.pyplot as plt
import os
import numpy as np

def generate_sample_plots(output_path="data/training_performance.png"):
    # Simulated data for demonstration
    epochs = np.arange(1, 11)
    train_loss = [0.9, 0.7, 0.5, 0.4, 0.35, 0.32, 0.3, 0.28, 0.27, 0.26]
    val_loss = [0.92, 0.75, 0.55, 0.48, 0.45, 0.44, 0.43, 0.42, 0.42, 0.41]
    
    train_acc = [0.65, 0.75, 0.82, 0.85, 0.88, 0.90, 0.91, 0.92, 0.93, 0.94]
    val_acc = [0.62, 0.70, 0.78, 0.81, 0.83, 0.84, 0.85, 0.86, 0.86, 0.87]

    # Create figure
    plt.figure(figsize=(14, 6))

    # Plot Loss Curve
    plt.subplot(1, 2, 1)
    plt.plot(epochs, train_loss, 'b-o', label='Training Loss')
    plt.plot(epochs, val_loss, 'r-s', label='Validation Loss')
    plt.title('Loss Curve', fontsize=14)
    plt.xlabel('Epochs', fontsize=12)
    plt.ylabel('Loss Value', fontsize=12)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)

    # Plot Accuracy Curve
    plt.subplot(1, 2, 2)
    plt.plot(epochs, train_acc, 'g-o', label='Training Accuracy')
    plt.plot(epochs, val_acc, 'y-s', label='Validation Accuracy')
    plt.title('Accuracy vs Epoch', fontsize=14)
    plt.xlabel('Epochs', fontsize=12)
    plt.ylabel('Accuracy (%)', fontsize=12)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)

    # Ensure output directory exists
    if not os.path.exists("data"):
        os.makedirs("data")
        
    plt.tight_layout()
    plt.savefig(output_path)
    print(f"Sample plots successfully generated at: {output_path}")

if __name__ == "__main__":
    generate_sample_plots()
