import express, { json } from 'express'
import cors from 'cors'
import 'express-async-errors'
import 'dotenv/config'

import handleErrorMiddleware from './middlewares/handleErrorMiddleware.js'
import router from './routers/indexRouter.js'

const app = express()
app.use(cors())
app.use(json())

app.use(router)
app.use(handleErrorMiddleware)

export default app
