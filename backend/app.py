from flask import Flask, request, jsonify, session
from flask_cors import CORS
from text_analysis import analyze_text
from voice_analysis import transcribe_audio, analyze_audio
from image_analysis import analyze_image
from users import create_user, authenticate_user, get_user_by_username, get_user_by_id, serialize_user
import os
from datetime import timedelta, datetime, timezone
import jwt


app = Flask(__name__)
CORS(app, origins=["https://www.atlasprotection.live"], supports_credentials=True)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "fallback-dev-secret")
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

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
        return jsonify({'error': user['id']}), 401
    token = jwt.encode(
    {
        'user_id': user['id'],
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    },
    app.secret_key,
    algorithm="HS256"
    )
    return jsonify({'user': user, 'token': token})

@app.route('/api/me')
def me():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'user': None})

    token = auth_header.split(' ')[1]

    try:
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        user_id = data['user_id']
        user = get_user_by_id(user_id)
        return jsonify({'user': serialize_user(user)})

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

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
