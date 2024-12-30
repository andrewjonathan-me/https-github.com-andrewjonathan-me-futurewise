import streamlit as st
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler

# Memuat model yang sudah disimpan
mlp_model = joblib.load('mlp_model_advanced.pkl')

# Judul aplikasi
st.title("Prediksi Jurusan Berdasarkan Minat dan Nilai Akademik")

# Deskripsi singkat aplikasi
st.write("""
Aplikasi ini membantu Anda memprediksi jurusan yang sesuai berdasarkan nilai akademik dan preferensi Anda.
Silakan isi semua kolom di bawah ini, lalu tekan tombol **Predict**.
""")

# Fungsi untuk menerima input pengguna dan memprosesnya
def user_input_features():
    # Meminta input untuk setiap fitur
    st.subheader("Masukkan Nilai Akademik Anda")
    matematika = st.number_input('Nilai Matematika', min_value=0, max_value=100)
    fisika = st.number_input('Nilai Fisika', min_value=0, max_value=100)
    biologi = st.number_input('Nilai Biologi', min_value=0, max_value=100)
    ekonomi = st.number_input('Nilai Ekonomi', min_value=0, max_value=100)
    geografi = st.number_input('Nilai Geografi', min_value=0, max_value=100)
    bahasa_inggris = st.number_input('Nilai Bahasa Inggris', min_value=0, max_value=100)
    bahasa_indonesia = st.number_input('Nilai Bahasa Indonesia', min_value=0, max_value=100)
    ppkn = st.number_input('Nilai PPKN', min_value=0, max_value=100)
    keterampilan = st.number_input('Nilai Keterampilan', min_value=0, max_value=100)
    olahraga = st.number_input('Nilai Olahraga', min_value=0, max_value=100)
    sosiologi = st.number_input('Nilai Sosiologi', min_value=0, max_value=100)
    komputer = st.number_input('Nilai Komputer', min_value=0, max_value=100)
    iq = st.number_input('Nilai IQ', min_value=0, max_value=200)

    st.subheader("Jawab Pertanyaan Berikut")
    suka_sains = st.selectbox('Apakah Anda suka Sains?', ['Ya', 'Tidak'])
    suka_bisnis = st.selectbox('Apakah Anda suka Bisnis?', ['Ya', 'Tidak'])
    suka_kedokteran = st.selectbox('Apakah Anda suka Kedokteran?', ['Ya', 'Tidak'])
    suka_komputer = st.selectbox('Apakah Anda suka Komputer?', ['Ya', 'Tidak'])
    bermain_game = st.selectbox('Apakah Anda suka Bermain Game?', ['Ya', 'Tidak'])

    # Mengubah input yang berupa 'Ya' atau 'Tidak' menjadi 1 atau 0
    suka_sains = 1 if suka_sains == 'Ya' else 0
    suka_bisnis = 1 if suka_bisnis == 'Ya' else 0
    suka_kedokteran = 1 if suka_kedokteran == 'Ya' else 0
    suka_komputer = 1 if suka_komputer == 'Ya' else 0
    bermain_game = 1 if bermain_game == 'Ya' else 0

    # Menyusun semua input dalam bentuk dictionary (total 15 fitur)
    data = {
        'matematika': matematika,
        'fisika': fisika,
        'biologi': biologi,
        'ekonomi': ekonomi,
        'geografi': geografi,
        'bahasa_inggris': bahasa_inggris,
        'bahasa_indonesia': bahasa_indonesia,
        'ppkn': ppkn,
        'keterampilan': keterampilan,
        'olahraga': olahraga,
        'sosiologi': sosiologi,
        'komputer': komputer,
        'iq': iq,
        'suka_sains': suka_sains,
        'suka_bisnis': suka_bisnis
    }

    features = pd.DataFrame(data, index=[0])
    return features

# Meminta input pengguna
user_data = user_input_features()

# Tombol untuk memulai prediksi
if st.button("Predict"):
    # Melakukan standar skala pada input agar sesuai dengan data pelatihan
    scaler = StandardScaler()
    user_data_scaled = scaler.fit_transform(user_data)

    # Melakukan prediksi menggunakan model yang sudah dilatih
    predicted_label = mlp_model.predict(user_data_scaled)

    # Definisikan label jurusan
    jurusan_labels = ['ilmu_sosial', 'seni_dan_desain', 'STEM', 'Bahasa_dan_sastra', 'ekonomi_dan_bisnis']

    # Predicted label is a string, map it to the index in jurusan_labels
    predicted_jurusan = jurusan_labels.index(predicted_label[0])
    st.success(f'Jurusan yang sesuai dengan data yang Anda masukkan adalah: **{jurusan_labels[predicted_jurusan]}**')

# Link untuk tes IQ
st.write("""
### Tes IQ
Jika Anda belum mengetahui nilai IQ Anda, silakan kunjungi tautan berikut untuk melakukan tes IQ:  
[Klik di sini untuk Tes IQ](https://international-iq-test.com/id/)
""")
