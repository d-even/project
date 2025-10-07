from fastapi import FastAPI, Request
from pydantic import BaseModel
import joblib
import numpy as np
import uvicorn

# Load your trained model
model = joblib.load("behavior_auth_model.pkl")

app = FastAPI()

# Define expected input format
class UserBehavior(BaseModel):
    typing_speed: float
    average_key_hold_time: float
    average_flight_time: float
    total_typing_duration: float
    straightness: float
    speed_cv: float
    idle_ratio: float
    direction_change_rate: float

@app.post("/predict")
async def predict_risk(data: UserBehavior):
    # Convert input to numpy array
    features = np.array([[data.typing_speed,
                          data.average_key_hold_time,
                          data.average_flight_time,
                          data.total_typing_duration,
                          data.straightness,
                          data.speed_cv,
                          data.idle_ratio,
                          data.direction_change_rate]])
    
    # Predict risk score
    result = model.predict(features)
    risk_score = float(result[0])
    return {"risk_score": risk_score}
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
