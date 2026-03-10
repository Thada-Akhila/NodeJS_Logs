import fetch from 'node-fetch';

const URL = "http://localhost:3001/api/logs";

async function sendLogs() {
   const requests = [];

   for (let i = 0; i < 50000; i++) {
    requests.push(
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: "info",
          message: `Load test log ${i}`,
          source: "load-test-script",
        }),
      })
    );
  }


  console.log('sendling 50,000 requests');

  await Promise.all(requests);

  console.log("Finished sending logs 🚀");

}

sendLogs();