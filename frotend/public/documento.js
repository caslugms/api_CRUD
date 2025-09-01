// Configuração da API
const API_BASE_URL = "http://localhost:3000/api/users"

// Elementos do DOM
const form = document.getElementById("form")
const listarBtn = document.getElementById("listar")
const buscarBtn = document.getElementById("buscar")
const atualizarBtn = document.getElementById("atualizar")
const deletarBtn = document.getElementById("deletar")
const resultadosDiv = document.getElementById("resultados")
const listaUsuariosDiv = document.getElementById("lista-usuarios")

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo = "success") {
  const div = document.createElement("div")
  div.style.padding = "10px"
  div.style.margin = "10px 0"
  div.style.borderRadius = "5px"
  div.style.color = "white"
  div.style.backgroundColor = tipo === "success" ? "#2e7d32" : "#c62828"
  div.textContent = mensagem

  document.querySelector(".container").insertBefore(div, form)

  setTimeout(() => {
    div.remove()
  }, 3000)
}

// Função para limpar resultados
function limparResultados() {
  listaUsuariosDiv.innerHTML = ""
  resultadosDiv.style.display = "none"
}

// Função para mostrar resultados
function mostrarResultados(usuarios) {
  limparResultados()

  if (usuarios.length === 0) {
    listaUsuariosDiv.innerHTML = "<p>Nenhum usuário encontrado.</p>"
  } else {
    usuarios.forEach((usuario) => {
      const userDiv = document.createElement("div")
      userDiv.className = "dado-salvo"
      userDiv.innerHTML = `
                <h3>${usuario.name}</h3>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Idade:</strong> ${usuario.age || "Não informado"}</p>
                <p><strong>Telefone:</strong> ${usuario.phone || "Não informado"}</p>
                <p><strong>CPF:</strong> ${usuario.CPF || "Não informado"}</p>
                <p><strong>ID:</strong> ${usuario.id}</p>
                <button onclick="deletarUsuario('${usuario.id}')">Deletar</button>
            `
      listaUsuariosDiv.appendChild(userDiv)
    })
  }

  resultadosDiv.style.display = "block"
}

// Função para salvar usuário
async function salvarUsuario(event) {
  event.preventDefault()

  const formData = new FormData(form)
  const userData = {
    name: formData.get("nome"),
    email: formData.get("email"),
    age: formData.get("age"),
    phone: formData.get("phone"),
    CPF: formData.get("CPF"),
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()

    if (response.ok) {
      mostrarMensagem("Usuário salvo com sucesso!")
      form.reset()
    } else {
      mostrarMensagem(result.error || "Erro ao salvar usuário", "error")
    }
  } catch (error) {
    mostrarMensagem("Erro de conexão com a API", "error")
    console.error("Erro:", error)
  }
}

// Função para listar todos os usuários
async function listarUsuarios() {
  try {
    const response = await fetch(API_BASE_URL)
    const usuarios = await response.json()

    if (response.ok) {
      mostrarResultados(usuarios)
      mostrarMensagem(`${usuarios.length} usuário(s) encontrado(s)`)
    } else {
      mostrarMensagem("Erro ao listar usuários", "error")
    }
  } catch (error) {
    mostrarMensagem("Erro de conexão com a API", "error")
    console.error("Erro:", error)
  }
}

// Função para buscar usuário por nome
async function buscarUsuario() {
  const nome = prompt("Digite o ID do usuário para buscar:")
  if (!nome) return

  try {
    const response = await fetch(`${API_BASE_URL}/${nome}`)
    const usuario = await response.json()

    if (response.ok) {
      mostrarResultados([usuario])
      mostrarMensagem("Usuário encontrado!")
    } else {
      mostrarMensagem(usuario.error || "Usuário não encontrado", "error")
      limparResultados()
    }
  } catch (error) {
    mostrarMensagem("Erro de conexão com a API", "error")
    console.error("Erro:", error)
  }
}

// Função para atualizar usuário
async function atualizarUsuario() {
  const id = prompt("Digite o ID do usuário para atualizar:")
  if (!id) return

  const name = prompt("Novo nome (deixe vazio para manter):")
  const email = prompt("Novo email (deixe vazio para manter):")
  const age = prompt("Nova idade (deixe vazio para manter):")
  const phone = prompt("Novo telefone (deixe vazio para manter):")
  const CPF = prompt("Novo CPF (deixe vazio para manter):")

  const updateData = {}
  if (name) updateData.name = name
  if (email) updateData.email = email
  if (age) updateData.age = age
  if (phone) updateData.phone = phone
  if (CPF) updateData.CPF = CPF

  if (Object.keys(updateData).length === 0) {
    mostrarMensagem("Nenhum dado foi alterado", "error")
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (response.ok) {
      mostrarMensagem("Usuário atualizado com sucesso!")
    } else {
      mostrarMensagem(result.error || "Erro ao atualizar usuário", "error")
    }
  } catch (error) {
    mostrarMensagem("Erro de conexão com a API", "error")
    console.error("Erro:", error)
  }
}

// Função para deletar usuário
async function deletarUsuario(id) {
  if (!id) {
    id = prompt("Digite o ID do usuário para deletar:")
    if (!id) return
  }

  if (!confirm(`Tem certeza que deseja deletar o usuário com ID: ${id}?`)) {
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (response.ok) {
      mostrarMensagem("Usuário deletado com sucesso!")
      // Atualizar a lista se estiver sendo exibida
      if (resultadosDiv.style.display !== "none") {
        listarUsuarios()
      }
    } else {
      mostrarMensagem(result.error || "Erro ao deletar usuário", "error")
    }
  } catch (error) {
    mostrarMensagem("Erro de conexão com a API", "error")
    console.error("Erro:", error)
  }
}

// Event listeners
form.addEventListener("submit", salvarUsuario)
listarBtn.addEventListener("click", listarUsuarios)
buscarBtn.addEventListener("click", buscarUsuario)
atualizarBtn.addEventListener("click", atualizarUsuario)
deletarBtn.addEventListener("click", () => deletarUsuario())

// Mensagem de inicialização
console.log("Sistema de usuários carregado com sucesso!")
console.log("API conectada em:", API_BASE_URL)