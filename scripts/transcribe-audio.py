import os
import sys
import whisper
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
INBOX_DIR = PROJECT_ROOT / "ingestion_inbox"

# Supported audio/video formats for Whisper
SUPPORTED_EXTENSIONS = {".mp3", ".mp4", ".m4a", ".wav", ".flac"}

def main():
    if not INBOX_DIR.exists():
        print(f"[Error] Inbox directory not found: {INBOX_DIR}")
        sys.exit(1)

    # Find all media files
    media_files = [
        f for f in INBOX_DIR.iterdir() 
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not media_files:
        print(f"No media files found in {INBOX_DIR}.")
        print(f"Supported formats: {', '.join(SUPPORTED_EXTENSIONS)}")
        return

    print(f"Found {len(media_files)} media file(s). Loading Whisper 'base' model...")
    print("Note: The first time you run this, it will download the model weights (~140MB).")
    
    # Load model (base is a good balance of speed and accuracy for CPU)
    try:
        model = whisper.load_model("base")
    except Exception as e:
        print(f"[Error] loading Whisper model: {e}")
        sys.exit(1)

    for media_file in media_files:
        output_txt = media_file.with_suffix(".txt")
        
        if output_txt.exists():
            print(f"Skipping {media_file.name} (transcript already exists).")
            continue

        print(f"\n[Transcribing] {media_file.name}...")
        try:
            # Transcribe the audio
            result = model.transcribe(str(media_file))
            
            # Save the raw text to a file
            with open(output_txt, "w", encoding="utf-8") as f:
                f.write(result["text"].strip())
            
            print(f"[Success] Transcription saved to: {output_txt.name}")
        except Exception as e:
            print(f"[Error] transcribing {media_file.name}: {e}")

if __name__ == "__main__":
    main()
