import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()

const app = express()
const PORT = 3000

app.use(cors()) 
app.use(express.json()) 

app.get("/", (req, res) => {
  res.json({ message: "API do Lucas Gabriel funcionando!" })
})

app.use("/api/users", userRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
