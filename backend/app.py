from flask import Flask, request, jsonify
from flask_cors import CORS
from text_analysis import analyze_text
from voice_analysis import transcribe_audio, analyze_audio
from image_analysis import analyze_image

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Backend server is running."

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
    app.run(debug=True, port=5000)
