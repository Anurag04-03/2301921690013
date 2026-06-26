# Campus Hiring Evaluation

This repository contains the deliverables for the Campus Hiring Evaluation.

## Project Setup
Make sure to install the required dependencies before running the tasks:
```bash
npm install
```

## Stage 0: Pre-Task Setup (Basic Logging Middleware)
This task implements a basic logging middleware using an Express server.

**Command to start the server:**
```bash
node server.js
```
*(Note: Once the server is running on port 3000, you can see the logs in the terminal by sending requests to it, for example using `curl -X GET http://localhost:3000/`)*

## Stage 1: Priority Inbox
This task sorts incoming campus notifications and displays the top 10 most important ones based on weight (`Placement` > `Result` > `Event`) and recency.

**Command to run:**
```bash
node priority_inbox.js
```

## Stage 2: Priority Inbox with Filtering
This extends Stage 1 by allowing you to filter notifications using simulated query parameters passed as command-line arguments.

**Commands to run (Examples):**
```bash
node priority_inbox.js types=Placement,Event
node priority_inbox.js types=Result
```
