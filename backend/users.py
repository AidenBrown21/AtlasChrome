from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from bson.objectid import ObjectId

users = db['user-data']

def serialize_user(user_data):
    if not user_data:
        return None
    if '_id' in user_data:
        user_data['id'] = str(user_data.pop('_id'))
    user_data.pop('password', None)
    return user_data

def create_user(first_name, last_name, username, password):
    if users.find_one({'username': username}):
        return False, 'Username already exists.'
    hashed = generate_password_hash(password, method='pbkdf2:sha256')
    user = {
        'first_name': first_name,
        'last_name': last_name,
        'username': username,
        'password': hashed
    }
    users.insert_one(user)
    return True, 'User created.'

def authenticate_user(username, password):
    user = users.find_one({'username': username})
    if not user:
        return False, 'User not found.'
    if not check_password_hash(user['password'], password):
        return False, 'Incorrect password.'
    return True, serialize_user(user)

def get_user_by_username(username):
    user = users.find_one({'username': username})
    if user:
        user.pop('password', None)
    return user 

def get_user_by_id(user_id):
    try:
        user = users.find_one({'_id': ObjectId(user_id)})
        return user
    except:
        return None