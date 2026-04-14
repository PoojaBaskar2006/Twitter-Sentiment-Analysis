# Twitter Sentiment Analysis Tool

A full-stack web application that uses Natural Language Processing (NLP) to classify tweets as **Positive**, **Negative**, or **Neutral**.

Built with a **Python Flask** backend and a **Vanilla JavaScript** frontend, utilizing the **VADER** lexicon for sentiment scoring.

## 🚀 Features
* **Real-time Analysis:** Type any sentence to get an instant sentiment classification.
* **Confidence Meter:** Visual gauge showing the strength of the sentiment (e.g., highly positive vs. slightly positive).
* **Historical Data Integration:** Fetches random real-world tweets from the **Sentiment140** dataset (1.6 million tweets).
* **Analysis History:** Tracks the last 10 queries in a session.
* **Responsive UI:** Clean, side-by-side layout that works on desktop and mobile.

## 🛠️ Tech Stack
* **Backend:** Python, Flask, NLTK (VADER), Pandas
* **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
* **Data:** Sentiment140 Dataset (Kaggle)

## 📂 Project Structure
```text
/Backend
    ├── app.py           # Flask API endpoints
    ├── dataset.csv.csv  # Sentiment140 dataset (Sample)
/Frontend
    ├── index.html       # User Interface
    ├── style.css        # Styling & Animations
    ├── script.js        # Logic to connect Frontend to Backend
```
