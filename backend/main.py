from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import librosa
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Voice Shield Backend is running",
        "status": "online"
    }

@app.post("/analyze")
async def analyze_voice(file: UploadFile = File(...)):

    # Read uploaded audio
    audio_data = await file.read()

    print("Received audio:", file.filename)
    print("File size:", len(audio_data), "bytes")

    # Load audio
    audio, sample_rate = librosa.load(
        io.BytesIO(audio_data),
        sr=None,
        mono=False
    )

    # Determine channels
    if audio.ndim == 1:
        channels = 1
    else:
        channels = audio.shape[0]

    # Calculate duration
    duration = len(audio[0] if audio.ndim > 1 else audio) / sample_rate

    print("Sample rate:", sample_rate, "Hz")
    print("Channels:", channels)
    print("Duration:", round(duration, 2), "seconds")

    return {
        "filename": file.filename,
        "file_size": len(audio_data),
        "sample_rate": sample_rate,
        "channels": channels,
        "duration": round(duration, 2),

        # Temporary demo values
        "synthetic_likelihood": 0.94,
        "speaker_match": 0.27,
        "risk": "CRITICAL"
    }