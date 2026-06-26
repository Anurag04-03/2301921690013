const http = require('http');


const myDetails = {
    "rollNo": "2301921690013",
    "name": "Anurag Srivastava",                  // <--- Fill in your full name
    "email": "cshews2301@glbitm.ac.in",
    "mobileNo": "8887647697",     // <--- Fill in your mobile number
    "accessCode": "xxkJnk",
    "githubUsername": "Anurag04-03"       // <--- Using just your username as instructed
};
// ==========================================

const postData = JSON.stringify(myDetails);

const options = {
    hostname: '4.224.186.213',
    port: 80,
    path: '/evaluation-service/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log("Sending registration request...");

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`\nStatus Code: ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log("\nSuccess! Here are your credentials:");
            console.log(data);
            console.log("\nMake sure to save your clientID and clientSecret safely!");
        } else {
            console.log("\nFailed to register. Server responded with:");
            console.log(data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
