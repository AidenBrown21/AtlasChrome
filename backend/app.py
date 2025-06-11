from flask import Flask, request, jsonify, session
from flask_cors import CORS
from text_analysis import analyze_text
from voice_analysis import transcribe_audio, analyze_audio
from image_analysis import analyze_image
from users import create_user, authenticate_user, get_user_by_username
import os
from datetime import timedelta


app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "fallback-dev-secret")
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)

@app.route('/')
def index():
    return "Backend server is running."

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    required = ['first_name', 'last_name', 'username', 'password']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing fields'}), 400
    ok, msg = create_user(data['first_name'], data['last_name'], data['username'], data['password'])
    if not ok:
        return jsonify({'error': msg}), 400
    session['username'] = data['username']
    session.permanent = True
    return jsonify({'message': msg})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400
    ok, user = authenticate_user(data['username'], data['password'])
    if not ok:
        return jsonify({'error': user}), 401
    session['username'] = user['username']
    session.permanent = True
    return jsonify({'message': 'Logged in', 'user': {
        'first_name': user['first_name'],
        'last_name': user['last_name'],
        'username': user['username']
    }})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out'})

@app.route('/api/me', methods=['GET'])
def me():
    username = session.get('username')
    if not username:
        return jsonify({'user': None})
    user = get_user_by_username(username)
    if not user:
        return jsonify({'user': None})
    return jsonify({'user': user})

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        result = analyze_text(data['text'])
        return jsonify(result)

    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({'error': 'Server error'}), 500

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        if not audio_file.filename:
            return jsonify({'error': 'No audio file selected'}), 400

        transcript = transcribe_audio(audio_file)
        return jsonify({'transcript': transcript})

    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-audio', methods=['POST'])
def analyze_audio_endpoint():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        if not audio_file.filename:
            return jsonify({'error': 'No audio file selected'}), 400

        result = analyze_audio(audio_file)
        return jsonify(result)

    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/image-analyze', methods=['POST'])
def image_analyze():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        image_file = request.files['image']
        if not image_file.filename:
            return jsonify({'error': 'No image file selected'}), 400
        text, analysis = analyze_image(image_file)
        return jsonify({'text': text, 'analysis': analysis})
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)), host="0.0.0.0")
