import express from "express"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserByName } from "../controllers/userController.js"

const router = express.Router()

router.get("/", getAllUsers) 
router.get("/:id", getUserByName) 
router.post("/", createUser) 
router.put("/:id", updateUser) 
router.delete("/:id", deleteUser)

export default router
