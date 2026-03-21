import tensorflow as tf
from tensorflow.keras.layers import Conv2D, Input
from tensorflow.keras.models import Model
from tensorflow.keras.applications import VGG16

def CSRNet(input_shape=(None, None, 3)):
    # Frontend: VGG16
    # We load VGG16 without top, and extract up to block4_pool
    # However, standard CSRNet usually uses first 10 layers (up to block3 something) or block4.
    # User request: "extract the first 13 layers (up to block4_pool)"
    # VGG16 layers:
    # block1_conv1, block1_conv2, block1_pool (3)
    # block2_conv1, block2_conv2, block2_pool (6)
    # block3_conv1, block3_conv2, block3_conv3, block3_pool (10)
    # block4_conv1, block4_conv2, block4_conv3, block4_pool (14)
    
    # If user wants "first 13 layers", that lands inside block4. 
    # But "up to block4_pool" implies including block4_pool, which is the 14th layer (index 13??).
    # Let's trust "up to block4_pool".
    
    input_tensor = Input(shape=input_shape)
    vgg = VGG16(weights=None, include_top=False, input_tensor=input_tensor)
    
    # The VGG16 application returns the output of the last layer (block5_pool) by default if include_top=False.
    # We need to slice it.
    # Let's get the layer output by name to be safe and match "block4_pool" (or similar).
    # Actually, standard behavior for "extraction" in Keras can be doing this:
    
    # Create a sub-model using VGG layers
    # slice_point: 'block4_pool'
    frontend_output = vgg.get_layer('block4_pool').output
    
    # Wait, if we use weights=None, we are just defining arch.
    # We append our backend to this output.
    
    x = frontend_output
    
    # Backend: Dilated Convolutions
    # Conv2D(512, 3, padding='same', dilation_rate=2, activation='relu') (Repeat x3)
    x = Conv2D(512, (3, 3), padding='same', dilation_rate=2, activation='relu', name='backend_dil_1')(x)
    x = Conv2D(512, (3, 3), padding='same', dilation_rate=2, activation='relu', name='backend_dil_2')(x)
    # x = Conv2D(512, (3, 3), padding='same', dilation_rate=2, activation='relu', name='backend_dil_3')(x) 
    # Wait, prompt says "(Repeat x3)". 
    x = Conv2D(512, (3, 3), padding='same', dilation_rate=2, activation='relu', name='backend_dil_3')(x)
    
    # Conv2D(256, 3, padding='same', dilation_rate=2, activation='relu')
    x = Conv2D(256, (3, 3), padding='same', dilation_rate=2, activation='relu', name='backend_dil_4')(x)
    
    # Conv2D(128, 3, padding='same', dilation_rate=2, activation='relu')
    x = Conv2D(128, (3, 3), padding='same', dilation_rate=2, activation='relu', name='backend_dil_5')(x)
    
    # Conv2D(64, 3, padding='same', dilation_rate=2, activation='relu')
    x = Conv2D(64, (3, 3), padding='same', dilation_rate=2, activation='relu', name='backend_dil_6')(x)
    
    # Final Layer: Conv2D(1, 1, padding='same', activation=None)
    x = Conv2D(1, (1, 1), padding='same', activation=None, name='output_density_map')(x)
    
    model = Model(inputs=input_tensor, outputs=x)
    return model
