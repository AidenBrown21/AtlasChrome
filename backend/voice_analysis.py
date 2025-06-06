import os
import tempfile
from vosk import Model, KaldiRecognizer
import wave
import json
from text_analysis import analyze_text

def transcribe_audio(audio_file):
    """
    Transcribe audio file using Vosk (offline speech recognition)
    """
    try:
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            audio_file.save(temp_file.name)
            
            # Load the Vosk model (assuming it's in the 'model' directory)
            model_path = os.path.join(os.path.dirname(__file__), 'model')
            if not os.path.exists(model_path):
                raise Exception("Vosk model not found. Please download the model first.")
            
            model = Model(model_path)
            
            # Open the audio file
            wf = wave.open(temp_file.name, "rb")
            
            # Check if audio file is valid
            if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
                raise Exception("Audio file must be WAV format mono PCM.")
            
            # Create recognizer
            rec = KaldiRecognizer(model, wf.getframerate())
            rec.SetWords(True)
            
            # Process the audio
            results = []
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    part = json.loads(rec.Result())
                    results.append(part)
            
            # Get the final result
            part = json.loads(rec.FinalResult())
            results.append(part)
            
            # Combine all transcriptions
            transcript = ' '.join([result.get('text', '') for result in results if result.get('text')])
            
            # Clean up
            wf.close()
            os.unlink(temp_file.name)
            
            return transcript
            
    except Exception as e:
        print(f"[ERROR] Transcription error: {e}")
        raise Exception("Failed to transcribe audio file")

def analyze_audio(audio_file):
    """
    Analyze audio file by transcribing it and then analyzing the transcript
    """
    try:
        # First, transcribe the audio
        transcript = transcribe_audio(audio_file)
        
        # Then analyze the transcript using the existing text analysis
        analysis_result = analyze_text(transcript)
        
        # Add the transcript to the result
        analysis_result['transcript'] = transcript
        
        return analysis_result
        
    except Exception as e:
        print(f"[ERROR] Audio analysis error: {e}")
        raise Exception("Failed to analyze audio file") 