import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env'
import { pinoHttp } from 'pino-http'
import logger from './utils/logger'

const app = express()

app.use(
  cors({
    origin: [`${APP_ORIGIN}`, 'http://localhost:3000'],
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({logger}))

// Routes
// health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' })
})


app.listen(Number(PORT), () => {
  console.log(`[server]: Server is running at http://localhost:${PORT} in ${NODE_ENV} environment`)
})
