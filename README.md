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

Start all three servers with a single command:

```
podman compose up --build
```

| Service | URL |
|---|---|
| Vulnerable app | http://localhost:3003 |
| Phishing site | http://localhost:4000 |
| Data collector | http://localhost:5001 |

## Exposing the Vulnerable Server via ngrok (for live demos)

The phishing site targets the vulnerable server by URL. For a local demo this is `http://localhost:3003`, but when presenting to an audience you can expose it publicly using ngrok:

```
ngrok http 3003
```

This generates a public HTTPS URL (e.g. `https://unimportantly-scraggy-otelia.ngrok-free.dev`). Update the fetch URL in `phishing-site/public/index.html` to match the ngrok URL ngrok assigns you:

```js
const response = await fetch('https://unimportantly-scraggy-otelia.ngrok-free.dev/api/userDetails', {
```

> **Note:** ngrok requires a free account and auth token. Run `ngrok config add-authtoken <your-token>` once before use.

### Demonstrate the Exploit

- Log in at the vulnerable app (http://localhost:3003).
- Open the phishing site (http://localhost:4000) in the same browser — it silently steals your session data on page load.
- View the stolen data at http://localhost:5001/stolen-data.

## How to Fix

- Restrict `Access-Control-Allow-Origin` to trusted domains only.
- Avoid using `*` for sensitive endpoints.
- Implement proper authentication and CSRF protections.

## Disclaimer

This project is for educational purposes only. Do not use these techniques for unauthorized testing or exploitation.
