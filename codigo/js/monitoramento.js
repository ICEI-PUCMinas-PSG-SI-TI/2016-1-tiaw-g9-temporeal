// monitoramento.js

const API = "http://localhost:3000/alunos";
let idEditando = null;

async function carregarAlunos() {
  try {
    const resposta = await fetch(API);
    if (!resposta.ok) throw new Error("Erro no servidor");
    const alunos = await resposta.json();

    const totalAlunos = alunos.length;
    const mediaTurma = totalAlunos > 0
      ? (alunos.reduce((acc, a) => acc + Number(a.nota), 0) / totalAlunos).toFixed(1)
      : 0;
    const frequenciaMedia = totalAlunos > 0
      ? (alunos.reduce((acc, a) => acc + Number(a.frequencia), 0) / totalAlunos).toFixed(1)
      : 0;
    const alunosAtencao = alunos.filter(a => a.status === "Atenção").length;

    const elTotal = document.getElementById("totalAlunos");
    const elMedia = document.getElementById("mediaTurma");
    const elFreq = document.getElementById("frequenciaMedia");
    const elAtencao = document.getElementById("alunosAtencao");

    if (elTotal) elTotal.textContent = totalAlunos;
    if (elMedia) elMedia.textContent = mediaTurma;
    if (elFreq) elFreq.textContent = frequenciaMedia + "%";
    if (elAtencao) elAtencao.textContent = alunosAtencao;

    montarTabela(alunos);
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar alunos.");
  }
}

function montarTabela(alunos) {
  const tabela = document.getElementById("tabelaAlunos");
  if (!tabela) return;

  tabela.innerHTML = "";

  alunos.forEach(aluno => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.nota}</td>
      <td>${aluno.frequencia}%</td>
      <td>${aluno.status}</td>
      <td>
        <button onclick="editarAluno('${aluno.id}')">Editar</button>
        <button onclick="deletarAluno('${aluno.id}')">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function adicionarAluno() {
  const nome = document.getElementById("nomeAluno").value.trim();
  const nota = parseFloat(document.getElementById("notaAluno").value);
  const frequencia = parseFloat(document.getElementById("freqAluno").value);

  if (!nome || isNaN(nota) || isNaN(frequencia)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  let status;
  if (nota < 7) {
    status = "Atenção";
  } else if (nota >= 9) {
    status = "Excelente";
  } else {
    status = "Bom";
  }

  const aluno = { nome, nota, frequencia, status };

  try {
    if (idEditando) {
      const resposta = await fetch(`${API}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno)
      });
      if (!resposta.ok) throw new Error("Erro ao editar aluno");
      idEditando = null;
    } else {
      const resposta = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno)
      });
      if (!resposta.ok) throw new Error("Erro ao adicionar aluno");
    }

    document.getElementById("nomeAluno").value = "";
    document.getElementById("notaAluno").value = "";
    document.getElementById("freqAluno").value = "";

    carregarAlunos();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar aluno.");
  }
}

async function editarAluno(id) {
  try {
    const resposta = await fetch(`${API}/${id}`);
    if (!resposta.ok) throw new Error("Erro ao buscar aluno");
    const aluno = await resposta.json();

    document.getElementById("nomeAluno").value = aluno.nome;
    document.getElementById("notaAluno").value = aluno.nota;
    document.getElementById("freqAluno").value = aluno.frequencia;

    idEditando = id;
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar dados do aluno.");
  }
}

async function deletarAluno(id) {
  if (!confirm("Deseja excluir o aluno?")) return;

  try {
    const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error("Erro ao excluir aluno");
    carregarAlunos();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao excluir aluno.");
  }
}

carregarAlunos();