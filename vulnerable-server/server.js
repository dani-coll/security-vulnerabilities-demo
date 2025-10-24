
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3003;

// Middleware to parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Handle preflight OPTIONS requests for CORS
app.options("*", (req, res) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// Serve static files from my-app/dist
const frontendPath = path.join(__dirname, "../vulnerable-frontend/dist");
console.log("Frontend path:", frontendPath);
console.log("Frontend path exists:", require('fs').existsSync(frontendPath));
app.use(express.static(frontendPath));

// Add logging middleware to see requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Simple session storage (in production, use proper session management)
const sessions = new Map();

// Login endpoint
app.post("/api/login", (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Content-Type", "application/json");
  
  const { username, password } = req.body;
  
  // Simple authentication (in production, use proper password hashing)
  if (username && password) {
    const sessionToken = `session_${Date.now()}_${Math.random()}`;
    sessions.set(sessionToken, { username, loginTime: new Date() });
    
    // Set session cookie that will be sent with subsequent requests
    res.cookie('sessionToken', sessionToken, { 
      httpOnly: false, // Allow JavaScript access for demo purposes (normally should be true)
      secure: false,   // Set to true in production with HTTPS
      sameSite: 'none'  // Changed from 'none' to 'lax' for localhost testing
    });
    
    res.json({ 
      success: true, 
      sessionToken, // Also return in response for localStorage demo
      message: "Login successful" 
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: "Username and password required" 
    });
  }
});

// User details endpoint with CORS vulnerability - REQUIRES AUTHENTICATION
app.get("/api/userDetails", (req, res) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "application/json");

  // Check for session token in cookies first (for CORS attack), then Authorization header
  let sessionToken = req.cookies?.sessionToken;
  
  if (!sessionToken) {
    // Fallback to Authorization header
    const authHeader = req.headers.authorization;
    sessionToken = authHeader?.replace('Bearer ', '');
  }
  
  console.log('Session token from cookies:', req.cookies?.sessionToken);
  console.log('Session token from auth header:', req.headers.authorization);
  
  if (!sessionToken || !sessions.has(sessionToken)) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Valid session token required" 
    });
  }
  
  const session = sessions.get(sessionToken);
  
  // Simulate user details with sensitive token
  const userDetails = {
    username: session.username,
    token: "secret_api_token_12345",
    sessionInfo: {
      loginTime: session.loginTime,
      sessionToken: sessionToken
    }
  };
  
  res.json(userDetails);
});

// Fallback to index.html for SPA routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Vulnerable server running at http://localhost:${PORT}`);
});
