from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import os

MONGO_URI = str(os.environ.get('MONGO_URI'))
DATABASE_NAME = str(os.environ.get('DATABASE_NAME'))

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
users = db['user-data']

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
    return True, user

def get_user_by_username(username):
    user = users.find_one({'username': username})
    if user:
        user.pop('password', None)
    return user 