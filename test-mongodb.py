import config
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient(config.MONGO_URI)

# Connect to the correct database and collection
db = client[config.DATABASE_NAME]
collection = db[config.COLLECTION_NAME]

@app.route('/', methods=['GET'])
def get_spam_messages():
    spam_docs = collection.find({"label": "spam"})
    messages = [doc.get('text', '') for doc in spam_docs]
    return "\n".join(messages), 200, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    app.run(debug=True)
