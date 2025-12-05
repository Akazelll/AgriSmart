import tensorflow as tf
from tensorflow.keras import layers, models
import os

# --- KONFIGURASI ---
IMG_HEIGHT = 224
IMG_WIDTH = 224
BATCH_SIZE = 32
DATA_DIR = "dataset" # Folder dataset Anda

# --- 1. MEMUAT DATASET ---
print("Memuat dataset...")
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
print(f"Kelas ditemukan: {class_names}")

# Optimasi performa
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# --- 2. MEMBUAT MODEL CNN ---
model = models.Sequential([
    # Rescaling (0-255 -> 0-1)
    layers.Rescaling(1./255, input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
    
    # Augmentasi Data (Opsional, agar lebih pintar)
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.2),
    
    # Layer Konvolusi
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Klasifikasi
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(len(class_names), activation='softmax')
])

# --- 3. KOMPILASI & TRAINING ---
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
              metrics=['accuracy'])

print("Mulai training model...")
EPOCHS = 20 # Jumlah putaran belajar
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# --- 4. SIMPAN HASIL ---
model.save("rice_disease_model.h5")
print("Model berhasil disimpan: rice_disease_model.h5")

# Simpan nama kelas untuk dipakai di API
with open("class_names.txt", "w") as f:
    for name in class_names:
        f.write(name + "\n")
print("Nama kelas disimpan: class_names.txt")