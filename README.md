# 🛡️ ATLAS Scam Protection
This service, created as a project between two students, aims to develop a smart agent capable of detecting and verifying modern scams and fake news in various formats, including text, audio, and picture.

## 🎯 Project Goal

The primary goal is to create a reliable tool that can help users identify and protect themselves from malicious and misleading information.

## ✨ Features

- 🔐 **NEW: User Account Management**: Allows for users to create accounts and help fine-tune the model.
- 📝 **Text Analysis**: Detect scams and fake news in articles, emails, and messages.
- 🎙️ **Voice Analysis**: Analyze audio for signs of scams (e.g., voice phishing).
- 🖼️ **Image Analysis**: Detect manipulated images and visual misinformation.
- 👌 **NEW: Smart Training System**: Enables users to upload scams for admins to approve, allowing for a continously learning model.

## 📚 Sources
* [UC Irvine Machine Learning Repository](https://archive.ics.uci.edu/dataset/228/sms+spam+collection)

## 🚀 Getting Started

### 🌐 Live Demo

- 🔗 **Frontend:** [https://www.atlasprotection.live](https://www.atlasprotection.live)
- 🛠️ **Backend API:** [https://atlas-backend-fkgye9e7b6dkf4cj.westus-01.azurewebsites.net](https://atlas-backend-fkgye9e7b6dkf4cj.westus-01.azurewebsites.net)

### 🧰 Prerequisites

- 🐍 Python 3.8+
- 🧱 Node.js v24+
- 🍃 MongoDB Database Access (described in `backend/config.py`)
- 🖼️ tesseract
- 🎵 ffmpeg

### 🛠️ Installation

1. 📥 Clone the repository:
   ```bash
   git clone https://github.com/inthezone006/atlas
   cd atlas
   ```

2. 🧪 (Optional) Feel free to create a virtual environment. Then, install the dependencies using the provided `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

3. 📦 Navigate to the `/frontend` folder and install the Node.js requirements:
   ```bash
   npm install
   ```

4. 📝 Create the `backend/config.py` file in the respective directory, and populate it with the following, adding the appropriate content where indicated:
   ```
   MONGO_URI="<insert MONGODB URL>"
   DATABASE_NAME="all-data"
   COLLECTION_NAME="text"
   ```

### Usage

1. 🧵 Open two terminal windows for ease.

2. In the **first terminal**, run the Flask back-end by navigating to the `/backend` folder, and running the `app.py` file:
   ```bash
   cd backend
   python app.py
   ```

3. Simultaneously, in the **second terminal**, run the Node.js front-end by navigating to the `/frontend` folder running the Node.js framework:
   ```bash
   cd frontend
   npm start
   ```

4. 🌐 If the service does not open automatically, connect to the link shown in the second terminal's Node.js 'Local' section (typically `localhost:3000`)

5. ✅ Enjoy staying safe:)

### Notes

1. For back-end updates, remember to build/push Dockerfile per API change. For example:
   ```bash
   cd backend
   docker build -t inthezone006/atlas-backend:latest .
   docker push inthezone006/atlas-backend:latest  
   ```
   This also includes restarting the cluster on Azure and ensuring the GitHub Actions run.