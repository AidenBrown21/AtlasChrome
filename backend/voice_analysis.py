import os
import tempfile
from vosk import Model, KaldiRecognizer
import wave
import json
from text_analysis import analyze_text
from pydub import AudioSegment

def transcribe_audio(audio_file):
    """
    Transcribe audio file using Vosk (offline speech recognition), with automatic conversion to WAV mono PCM.
    """
    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.tmp') as temp_file:
            audio_file.save(temp_file.name)
            original_path = temp_file.name

        # Convert to WAV mono PCM using pydub
        wav_path = original_path + '.wav'
        audio = AudioSegment.from_file(original_path)
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export(wav_path, format="wav", codec="pcm_s16le")

        # Load the Vosk model
        model_path = os.path.join(os.path.dirname(__file__), 'model')
        if not os.path.exists(model_path):
            raise Exception("Vosk model not found. Please download the model first.")

        model = Model(model_path)
        wf = wave.open(wav_path, "rb")

        # Check if audio file is valid
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
            raise Exception("Audio file must be WAV format mono PCM.")

        rec = KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True)

        results = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                part = json.loads(rec.Result())
                results.append(part)

        part = json.loads(rec.FinalResult())
        results.append(part)
        transcript = ' '.join([result.get('text', '') for result in results if result.get('text')])

        # Clean up
        wf.close()
        os.unlink(original_path)
        os.unlink(wav_path)

        return transcript

    except Exception as e:
        print(f"[ERROR] Transcription error: {e}")
        raise Exception("Failed to transcribe audio file: " + str(e))

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
        raise Exception("Failed to analyze audio file: " + str(e)) 