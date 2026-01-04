# AuthenLens v2.0 (Beta) 🛡️

**Truth in the age of Synthetic Media.**

AuthenLens is an advanced deepfake detection platform designed to verify the authenticity of digital media. Powered by multi-modal deep learning models, it analyzes images and videos for generative artifacts, pixel-level inconsistencies, and compression anomalies invisible to the human eye.

🚀 **Live Access**: [https://authenlens.vercel.app/](https://authenlens.vercel.app/)

![Dashboard Preview](public/dashboard-preview.png)

## ✨ What's New in v2.0
*   **Focused Detection**: Streamlined engines dedicated to **Image** and **Video** forensics.
*   **Complete UI Overhaul**: A stunning, "Apple-inspired" minimalist interface featuring glassmorphism, mesh gradients, and smooth animations.
*   **Privacy First Architecture**: We do not store, collect, or train on your data. All uploads are processed in RAM and discarded immediately.
*   **Performance**: Faster inference times and improved error handling.

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
*   **Backend**: Python, Flask, TensorFlow/Keras, OpenCV.
*   **Models**: 
    *   *Images*: EfficientNetV2 / ResNet50 with ELA (Error Level Analysis).
    *   *Videos*: MesoNet / TimeDistributed CNNs.

## 🚀 Running Locally

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)

### 1. Frontend Setup
```bash
cd "AuthnLens UI"
npm install
npm run dev
```
The UI will run at `http://localhost:5173`.

### 2. Backend Setup
```bash
cd Backend
# Recommended: Create a virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt
python app.py
```
The Flask API will run at `http://localhost:5000`.

## 🔒 Privacy & Ethics
AuthenLens is an open research initiative by **BrewAI**. We are committed to ethical AI development. 
*   **No Data Retention**: Your uploads are strictly for one-time analysis.
*   **No Training without Consent**: We do not use user inputs to retrain our public models.

## 📄 License
This project is licensed under the MIT License.

---
*© 2026 AuthenLens Inc. Built by BrewAI.*
