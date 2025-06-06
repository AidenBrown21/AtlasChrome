from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Common spam patterns and examples
SPAM_PATTERNS = [
    "Congratulations! You've won a prize",
    "Your account has been suspended",
    "Urgent: Your payment is required",
    "You've inherited a large sum of money",
    "Your package delivery is pending",
    "Your account needs verification",
    "Limited time offer - act now",
    "You've been selected for a special offer",
    "Your subscription will be charged",
    "Your device has been infected",
    "Your bank account needs updating",
    "You've won a lottery",
    "Your payment has failed",
    "Your account will be closed",
    "You've been chosen for a survey",
    "Your refund is ready",
    "Your account has been compromised",
    "You've been selected for a reward",
    "Your payment is overdue",
    "Your account needs attention"
]

VECTOR = TfidfVectorizer()
SPAM_VECTORS = VECTOR.fit_transform(SPAM_PATTERNS)

def similarity_score(text):
    """Return a similarity score from 0 to 10 against known spam patterns."""
    user_vec = VECTOR.transform([text])
    similarities = cosine_similarity(user_vec, SPAM_VECTORS)[0]
    max_sim = similarities.max()
    return round(max_sim * 10, 2), SPAM_PATTERNS[similarities.argmax()]

SCAM_KEYWORD_WEIGHTS = {
    "nigerian prince": 10, "inheritance": 8, "lottery": 8, "sweepstakes": 8,
    "guaranteed winner": 10, "claim your prize": 8, "free money": 9,
    "social security number": 10, "ssn": 10, "login credentials": 9,
    "bank details": 8, "no purchase necessary": 5, "transfer fee": 7,
    "pre-approved loan": 6, "low interest": 4, "guaranteed approval": 7,
    "one-time fee": 6, "zero cost": 4, "processing fee": 6, "refund available": 5,

    "urgent": 5, "act now": 5, "limited time offer": 4, "expires soon": 4,
    "immediate action required": 6, "limited availability": 5,
    "only a few left": 4, "respond immediately": 6, "last chance": 5,
    "don't miss out": 4, "act immediately": 5, "exclusive offer": 4,

    "bitcoin": 9, "btc": 9, "crypto": 8, "gift card": 9, "wire transfer": 7,
    "bank transfer": 6, "untraceable": 7,

    "verify your account": 7, "update your information": 6,
    "confirm your password": 8, "password check": 7, "bank account": 6,
    "credit card": 7, "unauthorized login": 7, "your account has been suspended": 8,
    "identity verification required": 6, "suspicious activity": 7,
    "security alert": 7, "your device is infected": 8, "reset your password": 6,
    "account disabled": 7,

    "arrested": 6, "bail": 7, "in trouble": 5, "help me": 4, "send money": 8,
    "stranded": 6,

    "investment opportunity": 6, "double your money": 8, "risk-free": 5,
    "make money fast": 7, "work from home": 3,

    "congratulations": 3, "you have been selected": 6, "winner": 5,
    "dear friend": 4, "free iphone": 9, "win a car": 8, "gift awaiting you": 7,
    "mystery shopper": 6, "click to claim": 7, "claim now": 6,
    "redeem your reward": 6,

    "covid compensation": 7, "virus detected": 8, "medical alert": 5,
    "emergency update": 6, "cdc notice": 5,

    "foreign diplomat": 9, "ambassador": 6, "royal family": 8, "love you": 4,
    "online dating": 3, "military base": 6, "deployment": 5
}

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
    is_scam = is_scam_keywords or similarity >= 4.0

    explanation = ""
    if is_scam_keywords:
        explanation += f"High-risk keywords detected (score: {total_score}). "
    if similarity >= 4.0:
        explanation += f"Text is {similarity}/10 similar to known spam: '{matched_snippet}'"
    if not explanation:
        explanation = "No major risk indicators found."

    return {
        "is_scam": bool(is_scam),
        "score": float(similarity),
        "keyword_score": int(total_score),
        "matched_spam_snippet": str(matched_snippet),
        "found_keywords": [str(k) for k in found_keywords],
        "explanation": str(explanation)
    }