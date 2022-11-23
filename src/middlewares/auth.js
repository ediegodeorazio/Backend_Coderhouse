const express = require('express')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = app.use((req, res, next) => {
    req.header('authorization') == process.env.TOKEN 
        ? next()
        : res.status(401).json({"error": "unauthorized"})
})

module.exports = authMiddleware