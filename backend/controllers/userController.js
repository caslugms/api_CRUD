import { db } from "../config/firebase.js"
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"

export const getAllUsers = async (req, res) => {
  try {
    const usersCollection = collection(db, "users")
    const snapshot = await getDocs(usersCollection)

    const userList = []
    snapshot.forEach((docu) => {
      userList.push({
        id: docu.id,
        ...docu.data(),
      })
    })

    res.json(userList)
  } catch (error) {
    console.log("Erro ao buscar usuários:", error.message)
    res.status(500).json({ error: "Erro ao buscar usuários" })
  }
}

const getNextUserId = async () => {
  const usersCollection = collection(db, "users")
  const snapshot = await getDocs(usersCollection)
  return snapshot.size + 1
}

export const createUser = async (req, res) => {
  try {
    const { name, email, age, phone, CPF } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: "Nome e email são obrigatórios" })
    }

    const nextId = await getNextUserId()
    const userId = nextId.toString()

    const userData = {
      name,
      email,
      age: age || null,
      phone: phone || null,
      CPF: CPF || null,
      criadoEm: new Date(),
    }

    const userDoc = doc(db, "users", userId)
    await setDoc(userDoc, userData)

    res.status(201).json({
      id: userId,
      ...userData,
      message: "Usuário criado com sucesso",
    })
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, age, phone, CPF } = req.body

    const userDoc = doc(db, "users", id)
    const docSnap = await getDoc(userDoc)

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (age) updateData.age = age
    if (phone) updateData.phone = phone
    if (CPF) updateData.CPF = CPF
    updateData.atualizadoEm = new Date()

    await updateDoc(userDoc, updateData)

    res.json({ message: "Usuário atualizado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const userDoc = doc(db, "users", id)
    const docSnap = await getDoc(userDoc)

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    await deleteDoc(userDoc)

    res.json({ message: "Usuário deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" })
  }
}