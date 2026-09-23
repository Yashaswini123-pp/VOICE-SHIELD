from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import librosa
import io

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    audio_data = await file.read()

    print("Received audio:", file.filename)
    print("File size:", len(audio_data), "bytes")

    audio, sample_rate = librosa.load(
        io.BytesIO(audio_data),
        sr=None,
        mono=False
    )

    if audio.ndim == 1:
        channels = 1
    else:
        channels = audio.shape[0]

    duration = len(
        audio[0] if audio.ndim > 1 else audio
    ) / sample_rate

    print("Sample rate:", sample_rate, "Hz")
    print("Channels:", channels)
    print("Duration:", round(duration, 2), "seconds")

    return {
        "filename": file.filename,
        "file_size": len(audio_data),
        "sample_rate": sample_rate,
        "channels": channels,
        "duration": round(duration, 2),

        # Demo values for prototype
        "synthetic_likelihood": 0.94,
        "speaker_match": 0.27,
        "risk": "CRITICAL"
    }
