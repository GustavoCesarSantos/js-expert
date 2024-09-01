import "dotenv/config"
import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'http'
import bodyParser from "body-parser"
import compression from "compression"
import cors from 'cors'
import helmet from "helmet"
import pinoHttp from 'pino-http'

import { db, todos  } from './db'
import { errorHandler, logger } from './utils'
import { randomUUID } from "crypto"

const loggerHttp = pinoHttp({
    logger,
    genReqId: function(req: Request, res: Response) {
        const existingId = req.id ?? req.headers["x-request-id"]
        if(existingId) {
            return existingId
        }
        const id = randomUUID()
        res.setHeader("x-request-id", id)
        return id
    }
})

const app = express()
const server = createServer(app)
app.use(bodyParser.json())
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(loggerHttp)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handler(err, res)
})

app.get("/", async (req: Request, res: Response) => {
    try {
    const result = await db.select().from(todos)
    res.status(200).json(result)
    } catch (error) {
        console.error(error)
       res.status(500).json({ message: "Internal server error" })
    }
})

const port = process.env.PORT ?? 8000
server.listen(port, () => {
    logger.info(`server up in port: ${port}`)
})

process.on("unhandledRejection", (reason, promise) => {
    logger.error({ promise, reason }, "Unhandled Rejection")
})

process.on("uncaughtException", (error) => {
    logger.error({ error }, "Uncaught Exception")
    server.close(() => {
        logger.info("Server closed")
        process.exit(1)
    })
})
