# AuthnLens 🔍 | Multimodal AI-Generated Content Detection System

AuthnLens is a powerful multimodal AI content authentication system designed to detect AI-generated and tampered content across multiple media types — including images, videos, audio, and text.

💻 **Live Demo:** [https://authnlens.vercel.app/](https://authnlens.vercel.app/)

---

## 🧠 About the Project

AuthnLens is a unified AI-powered platform that brings together individually trained deep learning models into a single interface. It allows users to upload or input media content and choose appropriate AI detectors to verify authenticity.

### 🔍 Modalities & Features

- **🖼 Image Detection**
  - Uses custom **ELA + EfficientNetV2B0 CNN** architecture.
  - Trained on datasets like CASIA.
  - Achieves **94% accuracy** in detecting AI-generated or tampered images.

- **🔊 Audio Detection & Speaker Identification**
  - Built using **MFCC + Conv2D CNN** architecture.
  - Capable of identifying the speaker (celebrity voices) and detecting AI-generated voices.
  - Achieves **95% accuracy** in both speaker ID and fake audio detection.

- **🎥 Video Tampering Detection**
  - Utilizes a hybrid **MesoNet + TimeDistributed Xception + LSTM** architecture.
  - Analyzes temporal frame-level inconsistencies.
  - Achieves **85% detection accuracy**, with **40% reduced training time** due to optimized layer stack.

- **📝 Text Detection**
  - Leverages an external AI-text detection API to determine if input text is machine-generated.

---

## 🌐 Technologies Used

- **Deep Learning Frameworks:** TensorFlow, Keras
- **Feature Extraction:** MFCC for audio, ELA for image preprocessing
- **Model Architectures:** EfficientNetV2, ResNet, Conv2D, LSTM, Xception, MesoNet
- **Frontend:** React.js (deployed via Vercel)
- **Backend:** Flask APIs (not connected in UI demo)

---
