const API_BASE_URL = "http://localhost:3000/api/users"

const form = document.getElementById("form")
const resultadosDiv = document.getElementById("resultados")
const listaUsuariosDiv = document.getElementById("lista-usuarios")

function msg(texto, tipo = "ok") {
  alert(tipo === "ok" ? texto : "Erro: " + texto)
}

function renderUsuarios(usuarios) {
  listaUsuariosDiv.innerHTML = ""
  if (!usuarios || usuarios.length === 0) {
    listaUsuariosDiv.innerHTML = "<p>Nenhum usuário encontrado.</p>"
    return
  }
  usuarios.forEach(u => {
    listaUsuariosDiv.innerHTML += `
      <div>
        <b>${u.name}</b> - ${u.email} - ID: ${u.id}
        <button onclick="delUser('${u.id}')">Deletar</button>
      </div>
    `
  })
  resultadosDiv.style.display = "block"
}

form.onsubmit = async e => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(form).entries())
  try {
    const r = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    msg(r.ok ? "Usuário salvo!" : "Erro ao salvar", r.ok ? "ok" : "err")
    form.reset()
  } catch {
    msg("Erro de conexão", "err")
  }
}

async function listUsers() {
  try {
    const r = await fetch(API_BASE_URL)
    renderUsuarios(await r.json())
  } catch {
    msg("Erro ao listar", "err")
  }
}

async function updateUser() {
  const id = prompt("ID do usuário:")
  if (!id) return
  const name = prompt("Novo nome:")
  try {
    const r = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    msg(r.ok ? "Atualizado!" : "Erro ao atualizar", r.ok ? "ok" : "err")
  } catch {
    msg("Erro", "err")
  }
}

async function delUser(id) {
  if (!confirm("Deletar usuário?")) return
  try {
    const r = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
    if (r.ok) { msg("Deletado!"); listUsers() }
  } catch {
    msg("Erro ao deletar", "err")
  }
}

document.getElementById("listar").onclick = listUsers
document.getElementById("atualizar").onclick = updateUser
document.getElementById("deletar").onclick = () => delUser(prompt("ID do usuário:"))