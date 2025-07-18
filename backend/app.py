from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
from text_analysis import analyze_text
from voice_analysis import transcribe_audio, analyze_audio
from image_analysis import analyze_image
from users import create_user, authenticate_user, get_user_by_id, serialize_user
import os
from datetime import timedelta, datetime, timezone
import jwt
from database import db
from functools import wraps
from bson.objectid import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == 'OPTIONS':
            return make_response("OK", 200)

        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Authentication Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            current_user = get_user_by_id(data['user_id'])
            if not current_user:
                 return jsonify({'error': 'User not found'}), 401
        except:
            return jsonify({'error': 'Token is invalid or expired!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated_admin(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Authentication Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            current_user = get_user_by_id(data['user_id'])
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
            
            if current_user.get('role') != 'admin':
                return jsonify({'error': 'Admin privileges required!'}), 403

        except:
            return jsonify({'error': 'Token is invalid or expired!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated_admin

def token_optional(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        current_user = None
        if 'Authorization' in request.headers and request.headers['Authorization'].startswith('Bearer '):
            token = request.headers['Authorization'].split(' ')[1]

        if token:
            try:
                data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
                current_user = get_user_by_id(data['user_id'])
            except:
                current_user = None

        return f(current_user, *args, **kwargs)
    return decorated

app = Flask(__name__)
CORS(app, origins=["https://www.atlasprotection.live"], supports_credentials=True)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "fallback-dev-secret")
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

@app.route('/')
def index():
    return "Backend server is running."

analysis_collection = db['analyses']

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
    username = data.get('username')
    password = data.get('password')
    authenticated, user_data = authenticate_user(username, password)
    if authenticated:
        token = jwt.encode(
            {
                'user_id': user_data['id'],
                'role': user_data.get('role', 'user'),
                'exp': datetime.now(timezone.utc) + app.config['PERMANENT_SESSION_LIFETIME']
            },
            app.secret_key,
            algorithm="HS256"
        )
        return jsonify({'user': user_data, 'token': token})
    else:
        return jsonify({'error': user_data}), 401

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
@token_optional
def analyze(current_user):
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        result = analyze_text(data['text'])

        if current_user:
            analysis_collection.insert_one({
                'user_id': current_user['_id'],
                'analysis_type': 'text',
                'result_score': result.get('score', 0),
                'is_scam': result.get('is_scam', False),
                'created_at': datetime.now(timezone.utc)
            })
        return jsonify(result)
    except Exception as e:
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
@token_optional
def analyze_audio_endpoint(current_user):
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        audio_file = request.files['audio']
        if not audio_file.filename: return jsonify({'error': 'No audio file selected'}), 400

        result = analyze_audio(audio_file)

        if current_user:
            analysis_collection.insert_one({
                'user_id': current_user['_id'],
                'analysis_type': 'voice',
                'result_score': result.get('score', 0),
                'is_scam': result.get('is_scam', False),
                'created_at': datetime.now(timezone.utc)
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/image-analyze', methods=['POST'])
@token_optional
def image_analyze(current_user):
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        image_file = request.files['image']
        if not image_file.filename: return jsonify({'error': 'No image file selected'}), 400

        text, analysis = analyze_image(image_file)

        if current_user:
            analysis_collection.insert_one({
                'user_id': current_user['_id'],
                'analysis_type': 'image',
                'result_score': analysis.get('score', 0),
                'is_scam': analysis.get('is_scam', False),
                'created_at': datetime.now(timezone.utc)
            })
        return jsonify({'text': text, 'analysis': analysis})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

pending_scams_collection = db['pending_scams']
approved_scams_collection = db['approved_scams'] 

@app.route('/api/admin/pending-submissions', methods=['GET'])
@admin_required
def get_pending_submissions(current_user):
    try:
        pending = list(pending_scams_collection.find({'status': 'pending'}))

        for submission in pending:
            submission['_id'] = str(submission['_id'])
            if 'submitted_by_id' in submission:
                submission['submitted_by_id'] = str(submission['submitted_by_id'])

        return jsonify(pending)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

text_training_collection = db['text'] 
blame_map_collection = db['blame_map']
@app.route('/api/admin/submission/<submission_id>/approve', methods=['POST'])
@admin_required
def approve_submission(current_user, submission_id):
    try:
        submission = pending_scams_collection.find_one({'_id': ObjectId(submission_id)})
        
        if not submission:
            return jsonify({'error': 'Submission not found'}), 404
        
        new_training_document = {
            'label': 'spam',
            'text': submission['text']
        }
        
        text_training_collection.insert_one(new_training_document)

        submitter_username = "Unknown"
        if submission.get('submitted_by_id'):
            submitter = get_user_by_id(submission['submitted_by_id'])
            if submitter:
                submitter_username = submitter.get('username')


        blame_map_entry = {
            'approved_user': current_user.get('username'),
            'submitted_user': submitter_username,
            'text': submission['text'],
            'approved_on': datetime.now(timezone.utc)
        }

        blame_map_collection.insert_one(blame_map_entry)

        pending_scams_collection.delete_one({'_id': ObjectId(submission_id)})
        
        return jsonify({'message': 'Submission approved successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/submission/<submission_id>/reject', methods=['POST'])
@admin_required
def reject_submission(current_user, submission_id):
    try:
        result = pending_scams_collection.delete_one({'_id': ObjectId(submission_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Submission not found'}), 404
            
        return jsonify({'message': 'Submission rejected successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit-scam', methods=['POST'])
@token_required
def submit_scam(current_user):
    data = request.get_json()
    scam_text = data.get('text')

    if not scam_text or len(scam_text) < 50:
        return jsonify({'error': 'Submission text is too short.'}), 400
    
    submission = {
        'text': scam_text,
        'submitted_by_id': current_user['_id'],
        'submitted_on': datetime.now(timezone.utc),
        'status': 'pending' 
    }
    pending_scams_collection.insert_one(submission)

    return jsonify({'message': 'Submission received. Thank you for your contribution!'}), 201


@app.route('/api/dashboard/log')
@token_required
def get_dashboard_log(current_user):
    try:
        username = current_user.get('username')
        user_role = current_user.get('role')

        query_filter = {}
        if user_role == 'admin':
            query_filter = {'approved_user': username}

        else:
            query_filter = {'submitted_user': username}

        log_entries = list(blame_map_collection.find(query_filter).sort('approved_on', -1).limit(5))

        result_list = []
        for entry in log_entries:
            entry['_id'] = str(entry['_id'])
            entry['approved_on'] = entry['approved_on'].isoformat()
            result_list.append(entry)

        return jsonify(result_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/me/stats')
@token_required
def get_user_stats(current_user):
    try:
        user_id = current_user.get('_id')
        username = current_user.get('username')

        total_analyses = analysis_collection.count_documents({'user_id': user_id})

        scams_detected = analysis_collection.count_documents({'user_id': user_id, 'is_scam': True})

        community_submissions = blame_map_collection.count_documents({'submitted_user': username})

        stats = {
            'total_analyses': total_analyses,
            'scams_detected': scams_detected,
            'community_submissions': community_submissions
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

changelog_collection = db['changelog']
@app.route('/api/admin/changelog', methods=['POST'])
@admin_required
def add_changelog_entry(current_user):
    try:
        data = request.get_json()
        version = data.get('version')
        entry_type = data.get('type') # e.g., 'new', 'improve', 'future'
        description = data.get('description')

        if not all([version, entry_type, description]):
            return jsonify({'error': 'Missing required fields'}), 400

        new_entry = {
            "version": version,
            "type": entry_type,
            "description": description,
            "date": datetime.now(timezone.utc)
        }
        changelog_collection.insert_one(new_entry)
        
        return jsonify({'message': 'Changelog entry added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/changelog', methods=['GET'])
def get_changelog():
    try:
        entries = list(changelog_collection.find().sort('date', -1))
        
        for entry in entries:
            entry['_id'] = str(entry['_id'])
            entry['date'] = entry['date'].isoformat()
            
        return jsonify(entries)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)), host="0.0.0.0")
