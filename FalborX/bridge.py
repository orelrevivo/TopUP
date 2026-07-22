import os
import re
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer
from flask import Flask, request, jsonify, Response
from threading import Thread

try:
    from duckduckgo_search import DDGS
except ImportError:
    print("WARNING: duckduckgo-search not installed. Web search will not work. Run: pip install duckduckgo-search")

app = Flask(__name__)

def execute_web_search(query):
    print(f"[Agent] Searching web for: {query}")
    try:
        results = DDGS().text(query, max_results=3)
        if not results:
            return "No results found."
        
        formatted_results = []
        for r in results:
            formatted_results.append(f"Title: {r.get('title')}\nSnippet: {r.get('body')}")
        
        return "\n\n".join(formatted_results)
    except Exception as e:
        return f"Search failed: {e}"

# --- MODEL CONFIGURATION ---
MODEL_PATH = "HuggingFaceTB/SmolLM2-360M-Instruct" 

device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = None
model = None

print(f"--- Xb36 AI Bridge ---")
print(f"Loading model: {MODEL_PATH}")
print(f"Target device: {device}")

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        device_map="auto" if device == "cuda" else None,
        trust_remote_code=True
    )
    if device == "cpu":
        model = model.to(device)
    print("--- Model Loaded Successfully ---")
except Exception as e:
    print(f"\n❌ ERROR LOADING MODEL: {e}")

import hashlib
import time
import requests
import json
from bs4 import BeautifulSoup

active_jobs = {}

def fetch_website(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        for script in soup(["script", "style", "nav", "footer"]):
            script.extract()
            
        text = soup.get_text(separator='\n')
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text[:1000] + "\n...[Content Truncated]..."
    except Exception as e:
        return f"Failed to load page: {e}"

@app.route('/chat', methods=['POST'])
def chat():
    if model is None or tokenizer is None:
        return jsonify({"response": "Backend Error: Model is not loaded."}), 500

    data = request.json
    message = data.get('message', '')
    history = data.get('history', [])

    print(f"\n[AI] Streaming requested for: {message[:50]}...")
    
    system_prompt = (
        "You are an AI Browser Agent. You MUST use tools to answer questions or browse the web.\n"
        "To navigate to a website, output EXACTLY this XML tag on its own line:\n"
        "<browser_navigate url=\"https://example.com\" />\n\n"
        "To search the web, output EXACTLY this XML tag on its own line:\n"
        "<internet_search query=\"your search term\" />\n\n"
        "EXAMPLE CONVERSATION:\n"
        "User: go to youtube and search for a video\n"
        "Assistant: I will open YouTube for you right now.\n"
        "<browser_navigate url=\"https://www.youtube.com/results?search_query=video\" />\n\n"
        "User: open wikipedia\n"
        "Assistant: Sure, opening Wikipedia.\n"
        "<browser_navigate url=\"https://www.wikipedia.org/\" />\n\n"
        "You MUST output the exact XML tag when asked to go to a website. DO NOT apologize."
    )
    
    prompt = f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
    for msg in history:
        role = msg['role']
        content = msg['content']
        prompt += f"<|im_start|>{role}\n{content}<|im_end|>\n"
    
    prompt += f"<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"

    job_id = hashlib.md5(prompt.encode()).hexdigest()

    if job_id not in active_jobs:
        active_jobs[job_id] = {"buffer": "", "done": False}
        
        def generate_worker():
            job = active_jobs[job_id]
            current_prompt = prompt
            max_loops = 3
            loop_count = 0
            
            try:
                while loop_count < max_loops:
                    loop_count += 1
                    inputs = tokenizer(current_prompt, return_tensors="pt").to(device)
                    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
                    
                    generation_kwargs = dict(
                        **inputs,
                        streamer=streamer,
                        max_new_tokens=2048,
                        do_sample=True,
                        temperature=0.7,
                        top_p=0.9,
                        repetition_penalty=1.1,
                        pad_token_id=tokenizer.eos_token_id
                    )
                    
                    thread = Thread(target=model.generate, kwargs=generation_kwargs)
                    thread.start()
                    
                    full_text = ""
                    for new_text in streamer:
                        full_text += new_text
                        job["buffer"] += new_text
                        
                    # Check for XML tags in output
                    nav_match = re.search(r"<browser_navigate\s+url=\"([^\"]+)\"\s*/>", full_text)
                    search_match = re.search(r"<internet_search\s+query=\"([^\"]+)\"\s*/>", full_text)
                    
                    if nav_match:
                        url = nav_match.group(1).strip()
                        page_content = fetch_website(url)
                        current_prompt += f"{full_text}<|im_end|>\n<|im_start|>system\nBrowser navigated to: {url}\n\nPage Content:\n{page_content}<|im_end|>\n<|im_start|>assistant\n"
                        continue
                        
                    elif search_match:
                        query = search_match.group(1).strip()
                        search_results = execute_web_search(query)
                        # Ensure we output the closing tag if the AI forgot it
                        if f"</internet_search>" not in job["buffer"]:
                             job["buffer"] += f"\n{search_results}\n</internet_search>\n\n"
                        current_prompt += f"{full_text}<|im_end|>\n<|im_start|>system\nSearch Results:\n{search_results}<|im_end|>\n<|im_start|>assistant\n"
                        continue
                            
                    break
            except Exception as e:
                print(f"Generation error: {e}")
            finally:
                job["done"] = True

        Thread(target=generate_worker).start()

    def stream_job():
        job = active_jobs[job_id]
        cursor = 0
        while not job["done"]:
            while cursor >= len(job["buffer"]) and not job["done"]:
                time.sleep(0.1)
            
            new_data = job["buffer"][cursor:]
            cursor += len(new_data)
            if new_data:
                yield new_data
                
        if cursor < len(job["buffer"]):
            yield job["buffer"][cursor:]

    return Response(stream_job(), mimetype='text/plain')

if __name__ == "__main__":
    app.run(port=8000)
