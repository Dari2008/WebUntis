import os

file = "./serviceWorker.js"

if os.path.exists(file):
    content = ""
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    with open(file, "w", encoding="utf-8") as f:
        f.write(content.replace("export {};", ""))