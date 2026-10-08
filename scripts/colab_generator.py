import json
import os
import subprocess
import time
import soundfile as sf
import numpy as np

# Load manifest
with open('/content/speech_manifest.json', 'r') as f:
    manifest = json.load(f)

print(f"Loaded {len(manifest)} clips from manifest.")

# Voices to generate
VOICES = [
    ('bf_emma', 'b', 'British Female (Emma)'),
    ('bm_george', 'b', 'British Male (George)'),
    ('af_heart', 'a', 'American Female (Heart)'),
    ('am_adam', 'a', 'American Male (Adam)'),
]

os.makedirs('/content/audio_mp3', exist_ok=True)
tmp_wav = '/content/temp_chunk.wav'

from kokoro import KPipeline

total_start = time.time()

for voice_id, lang_code, label in VOICES:
    print(f"\n==========================================")
    print(f"Starting voice: {label} [{voice_id}] (lang={lang_code})")
    print(f"==========================================")
    v_start = time.time()
    pipeline = KPipeline(lang_code=lang_code, device='cuda')

    voice_dir = f"/content/audio_mp3/{voice_id}"
    os.makedirs(voice_dir, exist_ok=True)

    success_count = 0
    for idx, item in enumerate(manifest):
        clip_path = item['id'] # e.g. "wmc/wmc_cellular_concept/analogy"
        out_mp3 = f"{voice_dir}/{clip_path}.mp3"
        
        # Ensure parent dir exists
        os.makedirs(os.path.dirname(out_mp3), exist_ok=True)

        if os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 1000:
            success_count += 1
            continue

        text = item['text']
        try:
            generator = pipeline(text, voice=voice_id, speed=1.0)
            chunks = []
            for gs, ps, audio in generator:
                chunks.append(audio)
            
            if chunks:
                full_audio = np.concatenate(chunks)
                sf.write(tmp_wav, full_audio, 24000)
                # Convert to high-quality compressed 48k mp3
                subprocess.run([
                    'ffmpeg', '-y', '-loglevel', 'error',
                    '-i', tmp_wav,
                    '-codec:a', 'libmp3lame',
                    '-b:a', '48k',
                    out_mp3
                ], check=True)
                success_count += 1
        except Exception as e:
            print(f"Error on {clip_path} ({voice_id}): {e}")

        if (idx + 1) % 50 == 0 or (idx + 1) == len(manifest):
            elapsed = time.time() - v_start
            rate = (idx + 1) / elapsed
            print(f"[{voice_id}] {idx + 1}/{len(manifest)} done ({rate:.1f} clips/s, {elapsed:.1f}s elapsed)")

    v_elapsed = time.time() - v_start
    print(f"Finished {voice_id}: {success_count} clips in {v_elapsed:.1f}s ({v_elapsed/60:.2f} mins)")

print(f"\nAll voices finished in {(time.time() - total_start)/60:.2f} mins!")

# Zip results into a single archive
print("\nCreating zip archive /content/quizquest_audio.zip ...")
subprocess.run([
    'zip', '-q', '-r', '/content/quizquest_audio.zip', 'audio_mp3'
], cwd='/content', check=True)

zip_size = os.path.getsize('/content/quizquest_audio.zip') / (1024 * 1024)
print(f"Archive created: /content/quizquest_audio.zip ({zip_size:.2f} MB)")
