import base64

file_path = "./track.ogg"

with open(file_path, "rb") as file:
    audio_data = file.read()
    audio_base64 = base64.b64encode(audio_data).decode()

with open("track.json", "w") as file:
    file.write(f'{{"track": "{audio_base64}"}}')