import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRoutes from './routes/chat.routes.js'
dotenv.config()

const app = express();

const PORT = 8000 || process.env.PORT

app.use(cors())
app.use(express.json())

app.use('/api/v1/chat', chatRoutes)

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))