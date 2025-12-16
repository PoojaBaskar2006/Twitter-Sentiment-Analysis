from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Initialize App
app = Flask(__name__)
CORS(app)  # Allows VS Code frontend to connect to this backend

# Download VADER lexicon (run once)
nltk.download('vader_lexicon', quiet=True)
sia = SentimentIntensityAnalyzer()

# --- LOAD DATASET ---
print("Loading dataset...")
try:
    # Based on your screenshot, the file is named 'dataset.csv.csv'
    # We load 50,000 rows to keep it fast
    df = pd.read_csv('dataset.csv.csv', nrows=50000)

    # Map the 'sentiment' column (assuming 0 is Negative, 1 or 4 is Positive)
    # If your dataset uses different numbers, VADER will still work for the "Analyze" button!
    df['label_text'] = df['sentiment'].map({0: 'Negative', 1: 'Positive', 4: 'Positive'})

    print("Dataset loaded successfully!")
    print(f"Columns found: {df.columns.tolist()}")

except FileNotFoundError:
    print("ERROR: Could not find 'dataset.csv.csv'. Please check the file name in the Backend folder.")
    df = pd.DataFrame()


# --- ROUTES ---

@app.route('/predict', methods=['POST'])
def predict():
    """Analyzes text sent from the Frontend"""
    data = request.json
    text = data.get('text', '')

    # Use VADER for sentiment analysis
    score = sia.polarity_scores(text)
    compound = score['compound']

    if compound >= 0.05:
        sentiment = "Positive"
    elif compound <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return jsonify({
        'sentiment': sentiment,
        'score': compound
    })


@app.route('/random', methods=['GET'])
def get_random_tweet():
    """Returns a random tweet from your Kaggle dataset"""
    if df.empty:
        return jsonify({'text': 'Error: Dataset not loaded.', 'label': 'N/A'})

    # Pick a random row
    random_row = df.sample(1).iloc[0]

    # We use your specific column names here: 'sentence' and 'sentiment'
    return jsonify({
        'text': random_row['sentence'],
        'real_label': str(random_row['sentiment'])  # Returns 0 or 1/4
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)