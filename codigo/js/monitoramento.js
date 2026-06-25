// monitoramento.js - Giovana

const API = "http://localhost:3000/atividades";
const form = document.getElementById("formAtividade");
const lista = document.getElementById("listaAtividades");
const totalHoras = document.getElementById("totalHoras");
let atividades = [];

async function carregarAtividades() {
    try {
        const resposta = await fetch(API);
        if (!resposta.ok) throw new Error("Erro no servidor");
        atividades = await resposta.json();
        renderizar();
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = `<div class="alert alert-danger">Erro ao carregar atividades</div>`;
    }
}

function renderizar() {
    lista.innerHTML = "";
    let total = 0;

    if (atividades.length === 0) {
        lista.innerHTML = `
            <div class="col-12">
                <div class="alert alert-secondary text-center">Nenhuma atividade cadastrada</div>
            </div>`;
    }

    atividades.forEach(item => {
        total += Number(item.horas);
        lista.innerHTML += `
            <div class="col-md-4">
                <div class="atividade shadow-sm">
                    <h5>${item.titulo}</h5>
                    <p><strong>Categoria:</strong> ${item.categoria}</p>
                    <p><strong>Horas:</strong> ${item.horas}h</p>
                    <p><strong>Data:</strong> ${item.data}</p>
                </div>
            </div>`;
    });

    totalHoras.textContent = total + "h";
    document.getElementById("tempoHoje").textContent = total + "h";

    let media = atividades.length > 0 ? (total / atividades.length).toFixed(1) : 0;
    document.getElementById("mediaSemanal").textContent = media + "h";

    let percentual = Math.min(Math.round((total / 4) * 100), 100);
    document.getElementById("percentual").textContent = percentual + "%";
    document.getElementById("barraProgresso").style.width = percentual + "%";
    document.getElementById("sequencia").textContent = atividades.length + " dias";
}

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const atividade = {
            titulo: document.getElementById("titulo").value,
            categoria: document.getElementById("categoria").value,
            horas: document.getElementById("horas").value,
            data: document.getElementById("data").value
        };

        try {
            const resposta = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(atividade)
            });
            if (!resposta.ok) throw new Error("Erro ao salvar");
            form.reset();
            carregarAtividades();
        } catch (erro) {
            console.error(erro);
            alert("Erro ao salvar atividade");
        }
    });
}

carregarAtividades();
