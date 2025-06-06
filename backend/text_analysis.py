import re

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
    """
    Analyzes a given text for potential scams using a weighted keyword approach.

    Args:
        text (str): The text to analyze.

    Returns:
        dict: A dictionary containing the analysis results.
    """
    text_lower = text.lower()
    found_keywords = []
    total_score = 0
    
    for keyword, weight in SCAM_KEYWORD_WEIGHTS.items():
        # Use a simple 'in' check for broader matching. This is more effective
        # than strict word boundary matching for catching variations.
        if keyword in text_lower:
            found_keywords.append(keyword)
            total_score += weight
            
    is_scam = total_score >= SCAM_THRESHOLD
    
    explanation = "This text does not appear to contain common scam characteristics."
    if is_scam:
        explanation = f"Potential scam detected. The calculated risk score ({total_score}) exceeds the threshold of {SCAM_THRESHOLD} due to the presence of high-risk keywords."
    elif found_keywords:
        explanation = f"This text contains some suspicious keywords ({', '.join(found_keywords)}), but the overall risk score ({total_score}) is below the threshold. Please still proceed with caution."

    return {
        "is_scam": is_scam,
        "score": total_score,
        "found_keywords": sorted(found_keywords, key=lambda k: SCAM_KEYWORD_WEIGHTS[k], reverse=True),
        "explanation": explanation
    } 