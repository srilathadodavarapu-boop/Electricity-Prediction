import pandas as pd
import random
import joblib

from sklearn.ensemble import RandomForestRegressor


# -------------------------------
# 1. Create training data
# -------------------------------

data = []

for i in range(1000):

    room = random.choice(["classroom", "lab"])
    students = random.randint(10, 60)
    temperature = random.randint(20, 40)
    day = random.randint(0, 6)
    hour = random.randint(6, 22)
    ac = random.randint(0, 1)
    lights = random.randint(0, 1)

    # Electricity usage used as training target
    usage = 2.0

    usage += students * 0.07

    if temperature > 25:
        usage += (temperature - 25) * 0.2

    if room == "lab":
        usage += 3

    if ac == 1:
        usage += 2

    if lights == 1:
        usage += 0.8

    if 9 <= hour <= 18:
        usage += 1

    if day >= 5:
        usage -= 1

    usage = max(0, usage)

    # Small variation so the model learns patterns
    usage += random.uniform(-0.3, 0.3)

    data.append([
        room,
        students,
        temperature,
        day,
        hour,
        ac,
        lights,
        usage
    ])


# -------------------------------
# 2. Convert to DataFrame
# -------------------------------

df = pd.DataFrame(
    data,
    columns=[
        "room",
        "students",
        "temperature",
        "day",
        "hour",
        "ac",
        "lights",
        "usage"
    ]
)


# -------------------------------
# 3. Convert room to number
# -------------------------------

df["room"] = df["room"].map({
    "classroom": 0,
    "lab": 1
})


# -------------------------------
# 4. Separate input and output
# -------------------------------

X = df[
    [
        "room",
        "students",
        "temperature",
        "day",
        "hour",
        "ac",
        "lights"
    ]
]

y = df["usage"]


# -------------------------------
# 5. Train Random Forest model
# -------------------------------

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)


# -------------------------------
# 6. Save trained model
# -------------------------------

joblib.dump(model, "electricity_model.pkl")


print("ML model trained successfully!")
print("Model saved as electricity_model.pkl")