import express, { json } from 'express'
import cors from 'cors'
import 'express-async-errors'
import 'dotenv/config'

import handleErrorMiddleware from './middlewares/handleErrorMiddleware.js'

const app = express()
app.use(cors())
app.use(json())

app.use(handleErrorMiddleware)

export default app
