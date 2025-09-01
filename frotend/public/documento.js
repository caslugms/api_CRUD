const API_BASE_URL = "http://localhost:3000/api/users"

const form = document.getElementById("form")
const resultadosDiv = document.getElementById("resultados")
const listaUsuariosDiv = document.getElementById("lista-usuarios")

function msg(texto, tipo = "ok") {
  alert(tipo === "ok" ? texto : "errado" + texto)
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
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    if (r.ok) msg("Usuário salvo!"); else msg("Erro ao salvar", "err")
    form.reset()
  } catch { msg("Erro de conexão", "err") }
}

async function listUsers() {
  try {
    const r = await fetch(API_BASE_URL)
    const dados = await r.json()
    console.log("Resposta do listar:", dados) // <-- debug
    renderUsuarios(Array.isArray(dados) ? dados : [dados])
  } catch (err) {
    console.error("Erro ao listar:", err)
    msg("Erro ao listar", "err")
  }
}

async function getUser() {
  const id = prompt("ID do usuário:")
  if (!id) return
  try {
    const r = await fetch(`${API_BASE_URL}/${id}`)
    const dados = await r.json()
    console.log("Resposta do buscar:", dados) // <-- debug
    renderUsuarios([dados])
  } catch (err) {
    console.error("Erro ao buscar:", err)
    msg("Erro ao buscar", "err")
  }
}

async function updateUser() {
  const id = prompt("ID do usuário:")
  if (!id) return
  const name = prompt("Novo nome:")
  try {
    const r = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    if (r.ok) msg("Atualizado!"); else msg("Erro ao atualizar", "err")
  } catch { msg("Erro", "err") }
}

async function delUser(id) {
  if (!confirm("Deletar usuário?")) return
  try {
    const r = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
    if (r.ok) { msg("Deletado!"); listUsers() }
  } catch { msg("Erro ao deletar", "err") }
}

document.getElementById("listar").onclick = listUsers
document.getElementById("buscar").onclick = getUser
document.getElementById("atualizar").onclick = updateUser
document.getElementById("deletar").onclick = () => delUser(prompt("ID do usuário:"))

console.log("App iniciado, API:", API_BASE_URL)