import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import connectDatabase from "./config/Database_Connection.js"
import notesRouters from "./routes/noteRoute.js"

dotenv.config({
    path: ".env"
})

const app = express()
const PORT = process.env.PORT
connectDatabase();


app.use(express.json())
app.use(cors())
app.use(helmet())
app.use("/api/notes", notesRouters)

app.listen(PORT, () => {
    console.log(`Server is up and running in Port ${PORT}`)
})


