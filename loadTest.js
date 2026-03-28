// import fetch from 'node-fetch';

// const URL = "http://localhost:3001/api/logs";

// async function sendLogs() {
//    const requests = [];

//    for (let i = 0; i < 50000; i++) {
//     requests.push(
//       fetch(URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           level: "info",
//           message: `Load test log ${i}`,
//           source: "load-test-script",
//         }),
//       })
//     );
//   }


//   console.log('sendling 50,000 requests');

//   await Promise.all(requests);

//   console.log("Finished sending logs 🚀");

// }

// sendLogs();








import fetch from "node-fetch";

const URL = "http://localhost:5001/api/logs";

const TOTAL_REQUESTS = 10000;
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
      );
    }

    await Promise.all(requests);

    console.log(`Sent ${i + BATCH_SIZE} logs`);
  }

  console.log("Finished sending logs 🚀");
}

sendLogs();