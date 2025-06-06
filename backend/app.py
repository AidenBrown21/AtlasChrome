# import sys
# import os
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# # The 'text_analysis.py' file is now in the same directory,
# # so we can do a direct import without path manipulation.
# from text_analysis import analyze_text

# app = Flask(__name__)
# CORS(app)  # This will allow the frontend to make requests to the backend

# @app.route('/')
# def index():
#     print("Health check endpoint was hit!")
#     return "Backend server is running and accessible."

# @app.route('/api/analyze', methods=['POST'])
# def analyze():
#     print("\n[LOG] '/api/analyze' endpoint was hit!")
#     try:
#         data = request.get_json()
#         if not data or 'text' not in data:
#             print("[ERROR] No 'text' field in the request.")
#             return jsonify({'error': 'No text provided'}), 400
        
#         text = data['text']
#         print(f"[LOG] Analyzing text: '{text[:70]}...'")
        
#         result = analyze_text(text)
        
#         print(f"[LOG] Analysis successful. Result: {result}")
#         return jsonify(result)

#     except Exception as e:
#         print(f"[ERROR] An exception occurred: {e}")
#         return jsonify({'error': 'An internal error occurred on the server.'}), 500

# if __name__ == '__main__':
#     print("--- Starting Anti-Scam Backend Server ---")
#     # Using host='0.0.0.0' makes the server accessible from your local network
#     app.run(host='0.0.0.0', port=5000, debug=True) 

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
    app.run(debug=True)
