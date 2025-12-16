const API_URL = "http://127.0.0.1:5000";

/* --- HELPER FUNCTION: Updates the Visual Gauge --- */
function updateMeter(score) {
    // Maps score (-1 to 1) to percentage (0% to 100%)
    const percentage = ((score + 1) / 2) * 100;

    const marker = document.getElementById("meterMarker");
    if (marker) {
        marker.style.left = `${percentage}%`;
    }
}

/* --- HELPER FUNCTION: Adds Result to History Table --- */
function addToHistory(text, sentiment, score) {
    const tableBody = document.querySelector("#historyTable tbody");
    if (!tableBody) return;

    const row = document.createElement("tr");

    const time = new Date().toLocaleTimeString();
    const shortText = text.length > 20 ? text.substring(0, 20) + "..." : text;

    // Define color class
    let colorClass = "";
    if (sentiment === "Positive") colorClass = "positive-text";
    else if (sentiment === "Negative") colorClass = "negative-text";
    else colorClass = "neutral-text";

    row.innerHTML = `
        <td>${time}</td>
        <td>${shortText}</td>
        <td class="${colorClass}"><b>${sentiment}</b></td>
    `;

    // Add to top
    tableBody.prepend(row);

    // Limit to 5 rows
    if (tableBody.rows.length > 10) {
        tableBody.deleteRow(10);
    }
}

/* --- MAIN FUNCTION --- */
async function analyzeSentiment() {
    const text = document.getElementById("tweetInput").value;
    const resultBox = document.getElementById("result");
    const labelSpan = document.getElementById("sentimentLabel");
    const scoreSpan = document.getElementById("confidenceScore");
    const realLabelSection = document.getElementById("realLabelSection");
    const emojiSpan = document.getElementById("sentimentEmoji");

    if (!text) {
        alert("Please enter some text!");
        return;
    }

    resultBox.classList.add("hidden");
    document.getElementById("loading").classList.remove("hidden");
    realLabelSection.classList.add("hidden");

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        // Update Text
        labelSpan.innerText = data.sentiment;
        scoreSpan.innerText = data.score;

        // Update Emoji
        if (data.sentiment === "Positive") emojiSpan.innerText = "😃";
        else if (data.sentiment === "Negative") emojiSpan.innerText = "😠";
        else emojiSpan.innerText = "😐";

        // Update Meter & History
        updateMeter(data.score);
        addToHistory(text, data.sentiment, data.score);

        // Update Color
        resultBox.className = "result-box";
        if (data.sentiment === "Positive") resultBox.classList.add("positive");
        else if (data.sentiment === "Negative") resultBox.classList.add("negative");
        else resultBox.classList.add("neutral");

        resultBox.classList.remove("hidden");

    } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to the backend. Is PyCharm running?");
    } finally {
        document.getElementById("loading").classList.add("hidden");
    }
}

/* --- RANDOM TWEET FUNCTION --- */
async function fetchRandomTweet() {
    try {
        const response = await fetch(`${API_URL}/random`);
        const data = await response.json();

        document.getElementById("tweetInput").value = data.text;

        const realLabelSection = document.getElementById("realLabelSection");
        const realLabelSpan = document.getElementById("realLabel");

        if (realLabelSpan) {
            realLabelSpan.innerText = data.real_label;
            realLabelSection.classList.remove("hidden");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Could not fetch tweet. Make sure backend is running!");
    }
}