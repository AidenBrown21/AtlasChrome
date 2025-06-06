# 🛡️ ATLAS Scam Protection

This project, created for the AINS 3.0 Hackathon, aims to develop a smart agent capable of detecting, verifying, and explaining scams and fake news in various formats, including text, voice, and images.

## Project Goal

The primary goal is to create a reliable tool that can help users identify and protect themselves from malicious and misleading information.

## Features

- **User Account Management**: Allows for users to sign in and sign out of accounts on the website.
- **Text Analysis**: Detect scams and fake news in articles, emails, and messages.
- **Voice Analysis**: Analyze audio for signs of scams (e.g., voice phishing).
- **Image Analysis**: Detect manipulated images and visual misinformation.

## Sources
* [UC Irvine Machine Learning Repository](https://archive.ics.uci.edu/dataset/228/sms+spam+collection)

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js v24+
- MongoDB Database Access (described in `backend/config.py`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/inthezone006/antiscam-scanner
   cd anti-scam-agent
   ```

2. Feel free to create a virtual environment. Then, install the dependencies using the provided `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

3. Navigate to the `/frontend` folder and install the Node.js requirements:
   ```bash
   npm install
   ```

4. Create the `backend/config.py` file in the respective directory, and populate it with the following, adding the appropriate content where indicated:
   ```
   MONGO_URI="<insert MONGODB URL>"
   DATABASE_NAME="all-data"
   COLLECTION_NAME="text"
   ```

### Usage

1. Open two terminals.

2. In the first terminal, run the Flask back-end by navigating to the `/backend` folder, and running the `app.py` file:
   ```bash
   cd backend
   python app.py
   ```

3. In the second terminal, run the Node.js front-end by navigating to the `/frontend` folder running the Node.js framework:
   ```bash
   cd frontend
   npm start
   ```

4. If the service does not open automatically, connect to the link shown in the second terminal's Node.js 'Local' section (typically `localhost:3000`)

5. Enjoy :)