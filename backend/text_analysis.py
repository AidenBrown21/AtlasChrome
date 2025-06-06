from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .. import config

client = MongoClient(config.MONGO_URI)
db = client[config.DATABASE_NAME]
collection = db[config.COLLECTION_NAME]

SPAM_TEXTS = [doc['text'] for doc in collection.find({"label": "spam"})]

VECTOR = TfidfVectorizer()
SPAM_VECTORS = VECTOR.fit_transform(SPAM_TEXTS)

def similarity_score(text):
    """Return a similarity score from 0 to 10 against known spam texts."""
    user_vec = VECTOR.transform([text])
    similarities = cosine_similarity(user_vec, SPAM_VECTORS)[0]
    max_sim = similarities.max()
    return round(max_sim * 10, 2), SPAM_TEXTS[similarities.argmax()][:100]

# A more sophisticated keyword analysis system with weighted scores.
# Higher weights indicate a stronger likelihood of a scam.
SCAM_KEYWORD_WEIGHTS = {
    # High-Risk Keywords (strong indicators)
    "nigerian prince": 10, "inheritance": 8, "lottery": 8, "sweepstakes": 8,
    "guaranteed winner": 10, "claim your prize": 8, "free money": 9,
    "social security number": 10, "ssn": 10, "login credentials": 9,

    # Urgency and Pressure Tactics
    "urgent": 5, "act now": 5, "limited time offer": 4, "expires soon": 4,
    "immediate action required": 6,

    # Unusual Payment Methods
    "bitcoin": 9, "btc": 9, "crypto": 8, "gift card": 9, "wire transfer": 7,
    "bank transfer": 6, "untraceable": 7,

    # Phishing and Information Requests
    "verify your account": 7, "update your information": 6,
    "confirm your password": 8, "password check": 7, "bank account": 6,
    "credit card": 7,

    # Common Scam Scenarios
    "arrested": 6, "bail": 7, "in trouble": 5, "help me": 4, "send money": 8,
    "stranded": 6,

    # Financial Schemes
    "investment opportunity": 6, "double your money": 8, "risk-free": 5,
    "make money fast": 7, "work from home": 3, # Can be legit, lower weight
    
    # Greetings and Lures
    "congratulations": 3, "you have been selected": 6, "winner": 5,
    "dear friend": 4
}

# The score threshold to classify a text as a potential scam.
# This value can be tuned for sensitivity.
SCAM_THRESHOLD = 10

def analyze_text(text):
    text_lower = text.lower()
    found_keywords = []
    total_score = 0
    
    for keyword, weight in SCAM_KEYWORD_WEIGHTS.items():
        if keyword in text_lower:
            found_keywords.append(keyword)
            total_score += weight

    is_scam_keywords = total_score >= SCAM_THRESHOLD

    # Get similarity score
    similarity, matched_snippet = similarity_score(text)

    # Combine results
    is_scam = is_scam_keywords or similarity >= 7.0  # you can adjust this threshold

    explanation = ""
    if is_scam_keywords:
        explanation += f"High-risk keywords detected (score: {total_score}). "
    if similarity >= 7.0:
        explanation += f"Text is {similarity}/10 similar to known spam: '{matched_snippet}'"
    if not explanation:
        explanation = "No major risk indicators found."

    return {
        "is_scam": is_scam,
        "score": similarity,
        "keyword_score": total_score,
        "matched_spam_snippet": matched_snippet,
        "found_keywords": sorted(found_keywords, key=lambda k: SCAM_KEYWORD_WEIGHTS[k], reverse=True),
        "explanation": explanation
    }