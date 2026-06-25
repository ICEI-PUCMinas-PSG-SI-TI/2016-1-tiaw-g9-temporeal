// tarefas.js - João

const url = 'http://localhost:3000/tarefas';

const formulario = document.getElementById('form-tarefa');
const caixaTitulo = document.getElementById('titulo');
const caixaDescricao = document.getElementById('descricao');
const caixaTipo = document.getElementById('tipo');
const caixaData = document.getElementById('data');
const lista = document.getElementById('lista-tarefas');

let idParaEditar = null;

async function carregarTarefas() {
    let resposta = await fetch(url);
    let tarefas = await resposta.json();
    lista.innerHTML = '';

    if (tarefas.length === 0) {
        lista.innerHTML = '<li class="text-muted">Nenhuma tarefa ainda</li>';
        return;
    }

    for (let item of tarefas) {
        let htmlDaTarefa = `
            <li>
                <strong>${item.titulo}</strong>
                <span>Descrição: ${item.descricao}</span>
                <span>Tipo: ${item.tipo}</span>
                <span>Data: ${item.data}</span>
                <div class="botoes">
                    <button class="btn btn-sm btn-outline-primary" onclick="prepararEdicao('${item.id}')">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="apagarTarefa('${item.id}')">Apagar</button>
                </div>
            </li>`;
        lista.innerHTML += htmlDaTarefa;
    }
}

if (formulario) {
    formulario.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        let pacoteDeDados = {
            titulo: caixaTitulo.value,
            descricao: caixaDescricao.value,
            tipo: caixaTipo.value,
            data: caixaData.value
        };

        if (idParaEditar !== null) {
            await fetch(url + '/' + idParaEditar, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacoteDeDados)
            });
            idParaEditar = null;
        } else {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacoteDeDados)
            });
        }

        formulario.reset();
        carregarTarefas();
    });
}

async function apagarTarefa(idDaTarefa) {
    if (!confirm('Quer mesmo apagar essa tarefa?')) return;
    await fetch(url + '/' + idDaTarefa, { method: 'DELETE' });
    carregarTarefas();
}

async function prepararEdicao(idDaTarefa) {
    let resposta = await fetch(url + '/' + idDaTarefa);
    let tarefa = await resposta.json();

    caixaTitulo.value = tarefa.titulo;
    caixaDescricao.value = tarefa.descricao;
    caixaTipo.value = tarefa.tipo;
    caixaData.value = tarefa.data;

    idParaEditar = tarefa.id;
}

carregarTarefas();
