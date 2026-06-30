const API = 'http://localhost:3000'

async function carregarAtividades() {
  const resposta = await fetch(API + '/atividades')
  const atividades = await resposta.json()

  const hoje = new Date().toISOString().split('T')[0]

  const atividadesHoje = atividades.filter(a => a.data === hoje)
  const horasHoje = atividadesHoje.reduce((s, a) => s + Number(a.horas || 0), 0)
  const metaDiaria = 4
  const percentual = Math.min(Math.round((horasHoje / metaDiaria) * 100), 100)

  const elTempo = document.getElementById('tempoHoje')
  const elPercentual = document.getElementById('percentual')
  const elBarra = document.getElementById('barraProgresso')

  if (elTempo) elTempo.textContent = horasHoje + 'h'
  if (elPercentual) elPercentual.textContent = percentual + '%'
  if (elBarra) elBarra.style.width = percentual + '%'

  const totalHoras = atividades.reduce((s, a) => s + Number(a.horas || 0), 0)
  const mediaSemanal = atividades.length > 0
    ? (totalHoras / Math.max(1, Math.ceil(atividades.length / 5))).toFixed(1)
    : 0

  const elMedia = document.getElementById('mediaSemanal')
  if (elMedia) elMedia.textContent = mediaSemanal + 'h'

  const elSequencia = document.getElementById('sequencia')
  if (elSequencia) elSequencia.textContent = calcularSequencia(atividades) + ' dias'

  const elTotal = document.getElementById('totalHoras')
  if (elTotal) elTotal.textContent = totalHoras

  renderizarLista(atividades)
}

function calcularSequencia(atividades) {
  const diasComAtividade = new Set(atividades.map(a => a.data))
  let sequencia = 0
  const hoje = new Date()

  for (let i = 0; i < 30; i++) {
    const d = new Date(hoje)
    d.setDate(d.getDate() - i)
    const dataStr = d.toISOString().split('T')[0]
    if (diasComAtividade.has(dataStr)) {
      sequencia++
    } else if (i > 0) {
      break
    }
  }
  return sequencia
}

function renderizarLista(atividades) {
  const pesquisa = document.getElementById('pesquisa')
  const termo = pesquisa ? pesquisa.value.toLowerCase() : ''

  const filtradas = atividades.filter(a =>
    a.titulo.toLowerCase().includes(termo) ||
    (a.categoria || '').toLowerCase().includes(termo)
  )

  const el = document.getElementById('listaAtividades')
  if (!el) return

  if (filtradas.length === 0) {
    el.innerHTML = '<p class="text-secondary">Nenhuma atividade encontrada.</p>'
    return
  }

  el.innerHTML = filtradas.map(a => `
    <div class="col-md-6">
      <div class="card p-3 shadow-sm">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>${a.titulo}</strong>
            <p class="text-secondary mb-1 small">${a.categoria} · ${a.horas}h · ${formatarData(a.data)}</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="prepararEdicao('${a.id}')">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deletarAtividade('${a.id}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('')
}

const formAtividade = document.getElementById('formAtividade')
let idEditando = null

if (formAtividade) {
  formAtividade.addEventListener('submit', async function(e) {
    e.preventDefault()

    const pacote = {
      titulo:    document.getElementById('titulo').value,
      categoria: document.getElementById('categoria').value,
      horas:     document.getElementById('horas').value,
      data:      document.getElementById('data').value
    }

    if (idEditando) {
      await fetch(API + '/atividades/' + idEditando, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacote)
      })
      idEditando = null
    } else {
      await fetch(API + '/atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacote)
      })
    }

    formAtividade.reset()
    carregarAtividades()
  })
}

async function prepararEdicao(id) {
  const resposta = await fetch(API + '/atividades/' + id)
  const atividade = await resposta.json()

  document.getElementById('titulo').value    = atividade.titulo
  document.getElementById('categoria').value = atividade.categoria
  document.getElementById('horas').value     = atividade.horas
  document.getElementById('data').value      = atividade.data

  idEditando = id
  formAtividade.scrollIntoView()
}

async function deletarAtividade(id) {
  if (!confirm('Quer mesmo apagar essa atividade?')) return
  await fetch(API + '/atividades/' + id, { method: 'DELETE' })
  carregarAtividades()
}

const pesquisa = document.getElementById('pesquisa')
if (pesquisa) {
  pesquisa.addEventListener('input', async function() {
    const resposta = await fetch(API + '/atividades')
    const atividades = await resposta.json()
    renderizarLista(atividades)
  })
}

function formatarData(dataISO) {
  if (!dataISO) return '—'
  const [ano, mes, dia] = dataISO.split('-')
  return dia + '/' + mes + '/' + ano
}

carregarAtividades()
