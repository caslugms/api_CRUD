import express from "express"
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../controllers/userController.js"

const router = express.Router()

// GET todos os usuários
router.get("/", getAllUsers) 

// GET usuário por ID
router.get("/:id", getUserById) 

// POST criar novo usuário
router.post("/", createUser) 

// PUT atualizar usuário por ID
router.put("/:id", updateUser) 

// DELETE remover usuário por ID
router.delete("/:id", deleteUser)

export default router
