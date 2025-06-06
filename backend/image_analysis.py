import pytesseract
from PIL import Image
import tempfile
from text_analysis import analyze_text

def extract_text_from_image(image_file):
    # Save the uploaded image to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
        image_file.save(temp_file.name)
        temp_path = temp_file.name
    # Open and OCR the image
    image = Image.open(temp_path)
    text = pytesseract.image_to_string(image)
    return text

def analyze_image(image_file):
    text = extract_text_from_image(image_file)
    analysis = analyze_text(text)
    return text, analysis 