import pandas as pd
import numpy as np
import tensorflow as tf
import cv2 
import keras
from tensorflow import keras
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import numpy as np
image_size = 150
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add the URL of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the 'static' directory to serve static files like CSS
app.mount("/static", StaticFiles(directory="static"), name="static")

# Jinja2 templates for HTML rendering
templates = Jinja2Templates(directory="templates")

def process_image(file):
    # Processing logic for the image (you can replace this with your actual processing steps)\
    contents = file.file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # Assuming color image, adjust if needed
    img = cv2.resize(img, (image_size, image_size))
    img_array = np.array([img])
    return img_array

def classify_emotion(img_array):
    model = keras.models.load_model("/Users/rishabhchauhan/pyth/test folder/parent/doggo_model.h5")
    ans=model.predict(img_array)
    classification_result=np.argmax(ans,axis=1)
    emotion_label = "Happy" if classification_result == 0 else "Angry" if classification_result == 1 else "Sad"
    return {"emotion_label": emotion_label}

@app.get("/", response_class=HTMLResponse)
async def read_item(request: dict = {}):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...), request: Request = None):
    img_array = process_image(file)
    classification_result = classify_emotion(img_array)

    return JSONResponse(content=classification_result)
