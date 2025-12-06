from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import requests

app = Flask(__name__)
CORS(app)

# --- KONFIGURASI ---
MODEL_PATH = "rice_disease_model.h5"
CLASS_NAMES_PATH = "class_names.txt"

# --- LOAD MODEL & KELAS ---
print("Memuat model...")

if not os.path.exists(MODEL_PATH):
    # Fallback jika nama file model berbeda
    if os.path.exists("efficientnetb0_model(2).h5"):
        MODEL_PATH = "efficientnetb0_model(2).h5"
    else:
        print(f"ERROR: Model '{MODEL_PATH}' tidak ditemukan!")
        exit()

if not os.path.exists(CLASS_NAMES_PATH):
    print(f"ERROR: '{CLASS_NAMES_PATH}' tidak ditemukan!")
    exit()

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = [line.strip() for line in f.readlines()]

print(f"Model siap. Kelas: {class_names}")

# --- DATA SOLUSI ---
SOLUTIONS = {
    "Bacterial Leaf Blight": "Penyakit Hawar Daun Bakteri. Gunakan bakterisida berbahan aktif tembaga, kurangi pupuk Nitrogen (Urea), dan atur pengairan agar tidak terlalu tergenang.",
    "Brown Spot": "Penyakit Bercak Coklat. Biasanya karena kekurangan unsur hara. Berikan pemupukan berimbang (terutama Kalium & Kalsium) dan jaga sanitasi lahan.",
    "Leaf Blast": "Penyakit Blast Daun. Semprotkan fungisida (seperti difenokonazol), hindari jarak tanam rapat, dan bakar sisa panen terinfeksi.",
    "Healthy Rice Leaf": "Tanaman Sehat. Pertahankan dengan pemupukan berimbang."
}

def prepare_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    if not data or 'image_url' not in data:
        return jsonify({"error": "URL gambar tidak ditemukan"}), 400
    
    image_url = data['image_url']
    print(f"Memproses URL: {image_url}")
    
    try:
        # 1. Download gambar
        response = requests.get(image_url, timeout=15)
        if response.status_code != 200:
            return jsonify({"error": "Gagal mengunduh gambar dari URL"}), 400
            
        image_bytes = response.content

        # 2. Preprocessing
        img_array = prepare_image(image_bytes)
        
        # 3. Prediksi
        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        
        idx = np.argmax(score)
        label = class_names[idx]
        
        # PERBAIKAN UTAMA DI SINI:
        # np.max(score) mengembalikan numpy.float32, kita harus cast ke float python biasa
        confidence = float(round(100 * np.max(score), 2))
        
        solution = SOLUTIONS.get(label, "Solusi belum tersedia.")
        
        return jsonify({
            "label": label,
            "confidence": confidence,
            "description": f"Terdeteksi sebagai {label} dengan tingkat keyakinan {confidence}%.",
            "solution": solution
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)