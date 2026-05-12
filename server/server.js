import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("API WORKING")
})
app.get("/debug-sentry", function mainHandler(req,res){
    throw new Error ("My first Sentry error!");
});

app.post('/webhooks',clerkWebhooks)

const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
    try {
        await connectDB()
        console.log("Database connected")

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })

    } catch (error) {
        console.log("DB Connection failed:", error.message)
    }
}

startServer()