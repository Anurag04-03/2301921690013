const http = require('http');

const TYPE_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};


const fallbackNotifications = [
    {
        "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
        "Type": "Result",
        "Message": "mid-sem",
        "Timestamp": "2026-04-22 17:51:30"
    },
    {
        "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
        "Type": "Placement",
        "Message": "CSX Corporation hiring",
        "Timestamp": "2026-04-22 17:51:18"
    },
    {
        "ID": "81589ada-0ad3-4f77-9554-f52fb558e09d",
        "Type": "Event",
        "Message": "farewell",
        "Timestamp": "2026-04-22 17:51:06"
    },
    {
        "ID": "0005513a-142b-4bbc-8678-eefec65e1ede",
        "Type": "Result",
        "Message": "mid-sem",
        "Timestamp": "2026-04-22 17:50:54"
    },
    { "ID": "n1", "Type": "Placement", "Message": "Google hiring", "Timestamp": "2026-04-22 18:00:00" },
    { "ID": "n2", "Type": "Event", "Message": "Tech Talk", "Timestamp": "2026-04-22 19:00:00" },
    { "ID": "n3", "Type": "Placement", "Message": "Microsoft hiring", "Timestamp": "2026-04-22 16:00:00" },
    { "ID": "n4", "Type": "Result", "Message": "End-sem", "Timestamp": "2026-04-22 15:00:00" },
    { "ID": "n5", "Type": "Event", "Message": "Hackathon", "Timestamp": "2026-04-22 14:00:00" },
    { "ID": "n6", "Type": "Placement", "Message": "Amazon hiring", "Timestamp": "2026-04-22 13:00:00" },
    { "ID": "n7", "Type": "Result", "Message": "Quiz 1", "Timestamp": "2026-04-22 12:00:00" },
    { "ID": "n8", "Type": "Event", "Message": "Cultural Fest", "Timestamp": "2026-04-22 11:00:00" }
];

function fetchNotifications(queryString = '', typeFilters = []) {
    return new Promise((resolve) => {
        const url = `http://4.224.186.213/evaluation-service/notifications${queryString}`;
        const req = http.get(url, { timeout: 3000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        let dataToReturn = parsed.notifications || [];
                        if (typeFilters.length > 0) {
                            dataToReturn = dataToReturn.filter(n => typeFilters.includes(n.Type));
                        }
                        resolve(dataToReturn);
                    } catch (e) {
                        resolve(getFallbackData(typeFilters));
                    }
                } else {
                    console.log(`API returned status code ${res.statusCode}, using fallback data.`);
                    resolve(getFallbackData(typeFilters));
                }
            });
        });

        req.on('error', (e) => {
            console.log("Failed to fetch from API, using fallback data.");
            resolve(getFallbackData(typeFilters));
        });

        req.on('timeout', () => {
            req.destroy();
            console.log("API request timed out, using fallback data.");
            resolve(getFallbackData(typeFilters));
        });
    });
}

function getFallbackData(typeFilters) {
    if (typeFilters.length === 0) return fallbackNotifications;
    return fallbackNotifications.filter(notif => typeFilters.includes(notif.Type));
}

function getTopNotifications(notifications, n = 10) {
    // Priority logic:
    // 1. Weight (Placement > Result > Event)
    // 2. Recency (Timestamp string YYYY-MM-DD HH:MM:SS)

    // Create a copy before sorting to avoid mutating original array if it's used elsewhere
    const sorted = [...notifications];

    sorted.sort((a, b) => {
        const weightA = TYPE_WEIGHTS[a.Type] || 0;
        const weightB = TYPE_WEIGHTS[b.Type] || 0;

        if (weightA !== weightB) {
            return weightB - weightA; // Descending order of weight
        }

        // If weights are equal, sort by recency
        const timeA = new Date(a.Timestamp.replace(' ', 'T')).getTime();
        const timeB = new Date(b.Timestamp.replace(' ', 'T')).getTime();

        return timeB - timeA;
    });


    return sorted.slice(0, n);
}

async function main() {
    let typeFilters = [];
    let queryString = '';

    // Parse command line arguments for 'types='
    const args = process.argv.slice(2);
    const typesArg = args.find(arg => arg.startsWith('types='));

    if (typesArg) {
        queryString = `?${typesArg}`;
        typeFilters = typesArg.split('=')[1].split(',');
        console.log(`Filtering by types: ${typeFilters.join(', ')}`);
    }

    console.log("Fetching notifications...");
    const notifications = await fetchNotifications(queryString, typeFilters);
    console.log(`Fetched ${notifications.length} notifications.`);

    const top10 = getTopNotifications(notifications, 10);

    console.log("\n--- TOP 10 PRIORITY INBOX ---");
    top10.forEach((notif, index) => {
        console.log(`${index + 1}. [${notif.Type}] ${notif.Message} - ${notif.Timestamp}`);
    });
}

main();
