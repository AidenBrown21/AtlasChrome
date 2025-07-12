from pymongo import MongoClient
import os

MONGO_URI = os.environ.get('MONGO_URI')
DATABASE_NAME = os.environ.get('DATABASE_NAME')

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]