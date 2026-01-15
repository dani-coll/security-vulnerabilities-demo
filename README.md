# CORS Vulnerability Demo

This project demonstrates a Cross-Origin Resource Sharing (CORS) vulnerability exploit using a set of simple Node.js/Express servers and frontends. The goal is to show how improper CORS configuration can allow malicious websites to access sensitive data from a vulnerable backend.

## Project Structure

- `vulnerable-server/`: Node.js server with intentionally insecure CORS settings.
- `vulnerable-frontend/`: Example frontend that interacts with the vulnerable server.
- `phishing-site/`: Simulates a malicious site exploiting the CORS vulnerability.
- `data-collector-server/`: Server to collect stolen data (used by the phishing site).

## How the Exploit Works

1. The `vulnerable-server` is configured to allow cross-origin requests from any origin (using `Access-Control-Allow-Origin: *` or similar insecure settings).
2. The `vulnerable-frontend` is a normal web app that interacts with the vulnerable server.
3. An attacker creates a malicious website (`phishing-site`) that makes requests to the vulnerable server from a different origin.
4. Because of the insecure CORS policy, the browser allows the attacker's site to read sensitive responses from the vulnerable server.
5. The attacker can send the stolen data to their own server (`data-collector-server`).

## How to Run Everything

### 1. Start the Vulnerable Server

```
cd vulnerable-server
npm install
node server.js
```

The server will start on port 3000 (or as specified in `server.js`).

### 2. Start the Vulnerable Frontend

```
cd ./vulnerable-frontend
npm install
npm run dev
```

The frontend will start on a port like 5173 (see the terminal output). Open your browser to the URL shown (e.g., `http://localhost:5173`).

### 3. Start the Data Collector Server (optional, for full exploit demo)

```
cd ./data-collector-server
npm install
node server.js
```

This server will listen for incoming data sent by the phishing site.

### 4. Start the Phishing Site (malicious site)

```
cd ./phishing-site
npm install
node server.js
```

The phishing site will start on its own port (e.g., 4000). Open your browser to the phishing site URL (e.g., `http://localhost:4000`).

### 5. Demonstrate the Exploit

- Visit the phishing site in your browser.
- The phishing site will make cross-origin requests to the vulnerable server and read sensitive data (e.g., user details, tokens).
- The phishing site may send this data to the data collector server.

## How to Fix

- Restrict `Access-Control-Allow-Origin` to trusted domains only.
- Avoid using `*` for sensitive endpoints.
- Implement proper authentication and CSRF protections.

## Disclaimer

This project is for educational purposes only. Do not use these techniques for unauthorized testing or exploitation.
