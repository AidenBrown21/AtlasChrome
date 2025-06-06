from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Replace <your_password> with your actual MongoDB Atlas password
MONGO_URI = "mongodb+srv://inthezone006:fzNPDu2PlQP5Fg6N@cluster0.c5lfglx.mongodb.net/"
client = MongoClient(MONGO_URI)

# Connect to the correct database and collection
db = client['all-data']
collection = db['text']

@app.route('/', methods=['GET'])
def get_spam_messages():
    # Query for documents labeled as 'spam'
    spam_docs = collection.find({"label": "spam"})

    # Extract just the message text
    messages = [doc.get('text', '') for doc in spam_docs]

    # Return each message line-by-line in plain text
    return "\n".join(messages), 200, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    app.run(debug=True)
