from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained ML model
model = joblib.load("electricity_model.pkl")


@app.route("/")
def home():
    return "Smart Electricity Predictor ML Backend is Running!"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    room = data.get("room", "classroom")
    students = int(data.get("students", 0))
    temperature = float(data.get("temperature", 0))
    day = int(data.get("day", 0))
    time = data.get("time", "10:00")

    ac = 1 if data.get("ac", False) else 0
    lights = 1 if data.get("lights", False) else 0

    # Convert room into number
    room_value = 1 if room == "lab" else 0

    # Extract hour from time
    hour = int(time.split(":")[0])

    # Prepare input for ML model
    input_data = pd.DataFrame([{
        "room": room_value,
        "students": students,
        "temperature": temperature,
        "day": day,
        "hour": hour,
        "ac": ac,
        "lights": lights
    }])

    # ML prediction
    prediction = model.predict(input_data)[0]

    prediction = round(float(prediction), 2)

    # Determine status
    if prediction >= 12:
        status = "High electricity consumption"
    elif prediction >= 7:
        status = "Moderate electricity consumption"
    else:
        status = "Low electricity consumption"

    return jsonify({
        "predicted_usage": prediction,
        "status": status,
        "room": room,
        "students": students,
        "temperature": temperature,
        "day": day,
        "ac": bool(ac),
        "lights": bool(lights),
        "time": time
    })


if __name__ == "__main__":
    app.run(debug=True)