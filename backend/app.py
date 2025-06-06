from flask import Flask, request, jsonify
from flask_cors import CORS
from text_analysis import analyze_text

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
