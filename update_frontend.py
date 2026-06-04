import os
import re

directory = r"c:\Users\PV-IT-Intern-6\Projects\JobHub\src"

def process_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content
    
    # 1. Update fetch calls
    # Find fetch(..., { ... }) and insert credentials: "include"
    # A simple way is to replace 'headers: {' with 'credentials: "include", headers: {'
    content = content.replace("headers: {", "credentials: \"include\", headers: {")
    content = content.replace("headers:{\n", "credentials: \"include\",\nheaders:{\n")
    
    # 2. Update axios calls
    # Replace axios.post(URL, data, { headers: ... }) with withCredentials: true
    content = content.replace("withCredentials: true", "") # avoid duplicates
    content = content.replace("headers: { \"Content-Type\": \"application/json\" }", "headers: { \"Content-Type\": \"application/json\" }, withCredentials: true")
    
    # 3. Update RequireAuth to check 'user' instead of 'token'
    if "RequireAuth.jsx" in path:
        content = content.replace("localStorage.getItem('token')", "localStorage.getItem('user')")
        
    # 4. Remove localStorage.setItem("token") to enforce cookie usage
    content = content.replace("localStorage.setItem(\"token\", accessToken);", "")
    content = content.replace("localStorage.setItem(\"refreshToken\", refreshToken);", "")
    
    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {path}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".js") or file.endswith(".jsx"):
            process_file(os.path.join(root, file))
