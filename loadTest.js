import fetch from "node-fetch";

const URL = "http://localhost:5001/api/logs"; //  FIX PORT

const TOTAL_REQUESTS = 1000;
const BATCH_SIZE = 100;

async function sendLogs() {

  for (let i = 0; i < TOTAL_REQUESTS; i += BATCH_SIZE) {

    const requests = [];

    for (let j = 0; j < BATCH_SIZE; j++) {
      requests.push(
        fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            level: "info",
            message: "Load test log",
            source: "load-test"
          })
        })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            console.log("❌ Rate limited:", data.message);
          }
        })
        .catch(err => console.log("❌ Error:", err.message))
      );
    }

    await Promise.all(requests);

    console.log(`Sent ${i + BATCH_SIZE} logs`);
  }

  console.log("Finished sending logs 🚀");
}

sendLogs();