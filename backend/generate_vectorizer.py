import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME, COLLECTION_NAME

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# Pull spam-only texts from MongoDB
SPAM_PATTERNS = [doc['text'] for doc in collection.find({"label": "spam"})]

# Create and fit TF-IDF vectorizer
vectorizer = TfidfVectorizer()
spam_vectors = vectorizer.fit_transform(SPAM_PATTERNS)

# Save everything
with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("spam_vectors.pkl", "wb") as f:
    pickle.dump(spam_vectors, f)

with open("spam_patterns.pkl", "wb") as f:
    pickle.dump(SPAM_PATTERNS, f)

print("Saved vectorizer and patterns from MongoDB.")
