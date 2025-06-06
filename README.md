# 🛡️ Anti-Scam & Misinformation Detection Agent

This project, created through the AINS 3.0 Hackathon, aims to develop a smart agent capable of detecting, verifying, and explaining scams and fake news in various formats, including text, voice, and images.

## Project Goal

The primary goal is to create a reliable tool that can help users identify and protect themselves from malicious and misleading information.

## Features

- **User account management (To be added)**: Allows for users to create/edit accounts on the website.
- **Text Analysis**: Detect scams and fake news in articles, emails, and messages.
- **Voice Analysis (To be added)**: Analyze audio for signs of scams (e.g., voice phishing).
- **Image Analysis (To be added)**: Detect manipulated images and visual misinformation.

## Sources
* UC Irvine Machine Learning Repository (https://archive.ics.uci.edu/dataset/228/sms+spam+collection)

## Getting Started

This project is currently under development.

### Prerequisites

- Python 3.8+
- Node.js v24+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/inthezone006/antiscam-scanner
   cd anti-scam-agent
   ```

2. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Navigate to the `/frontend` folder and install the Node.js requirements:
   ```bash
   npm install
   ```

### Usage

1. Open two terminals.

2. In the first terminal, run the Flask backend by running the `app.py` file:
   ```bash
   python backend/app.py
   ```

3. In the second terminal, run the frontend by navigating to the `/frontend` folder running the Node.js framework:
   ```bash
   cd frontend
   npm start
   ```

4. If the service does not open automatically, connect to the link shown in the 'Local: ' section (typically `localhost:3000`)

5. Enjoy :)