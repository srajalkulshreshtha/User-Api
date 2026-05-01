const express = require("express");
const app = express();

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Custom Middleware (Logging)
app.use((req, res, next) => {
    const currentTime = new Date().toLocaleString();
    console.log(`Request received at: ${currentTime}`);
    console.log(`${req.method} ${req.url}`);
    next();
});

// In-memory user storage
let users = [];
let idCounter = 1;

// Helper function for JSON response
const response = (message) => {
    return {
        message,
        time: new Date().toLocaleString()
    };
};

// 1. SERVER ROUTE
app.get("/", (req, res) => {
    res.json(response("Server Running"));
});

// 2. USER ROUTES

// GET all users
app.get("/users", (req, res) => {
    res.json({
        ...response("Users fetched successfully"),
        data: users
    });
});

// POST add user
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
        return res.json(response("Name and email are required"));
    }

    // Duplicate email check
    const exists = users.find(user => user.email === email);
    if (exists) {
        return res.json(response("Email already exists"));
    }

    const newUser = {
        id: idCounter++,
        name,
        email
    };

    users.push(newUser);

    res.json({
        ...response("User added successfully"),
        data: newUser
    });
});

// DELETE user
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.json(response("User not found"));
    }

    users.splice(index, 1);

    res.json(response("User deleted successfully"));
});

// BONUS: GET user by ID
app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.json(response("User not found"));
    }

    res.json({
        ...response("User fetched successfully"),
        data: user
    });
});

// 4. LOGIN ROUTE
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json(response("All fields required"));
    }

    if (email === "admin@gmail.com" && password === "1234") {
        return res.json(response("Login Success"));
    } else {
        return res.json(response("Invalid Credentials"));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
console.log("app is running");
