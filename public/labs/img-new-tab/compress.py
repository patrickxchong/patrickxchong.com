import subprocess
import json

manifest = json.load(open('./src/manifest.json'))
subprocess.call(
    ['7z', 'a', f'../{manifest["short_name"]}-{manifest["version"]}.zip', '*'], cwd="./src")
