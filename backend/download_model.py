import os
import requests
import zipfile
import shutil

def download_model():
    """
    Download and extract the Vosk small English model
    """
    # Create model directory if it doesn't exist
    model_dir = os.path.join(os.path.dirname(__file__), 'model')
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    
    # Model URL (small English model)
    model_url = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip"
    
    # Download the model
    print("Downloading Vosk model...")
    response = requests.get(model_url, stream=True)
    zip_path = os.path.join(os.path.dirname(__file__), "model.zip")
    
    with open(zip_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    
    # Extract the model
    print("Extracting model...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(os.path.dirname(__file__))
    
    # Move the model files to the model directory
    extracted_dir = os.path.join(os.path.dirname(__file__), "vosk-model-small-en-us-0.15")
    for item in os.listdir(extracted_dir):
        shutil.move(os.path.join(extracted_dir, item), model_dir)
    
    # Clean up
    os.remove(zip_path)
    shutil.rmtree(extracted_dir)
    
    print("Model downloaded and installed successfully!")

if __name__ == "__main__":
    download_model() 