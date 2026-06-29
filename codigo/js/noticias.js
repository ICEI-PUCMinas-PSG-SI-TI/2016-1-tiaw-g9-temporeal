// função para calcular o tempo de publicação
function calculaTempoPublicacao(dataPublicacao) {
    let hoje = new Date();
    return Math.floor(
        (hoje - dataPublicacao) / (1000 * 60 * 60 * 24)
    );
}

// função para dividir data em partes e retorná-la no objeto Date
function converterData(noticia) {
    let partes = noticia.dataPublicacao.split("/");
    return new Date(partes[2], partes[1] - 1, partes[0]);
}

// função para exibir as notícias do json
function exibirNoticias(noticiasJson) {
    let tabela = document.getElementById("noticias");
    tabela.innerHTML = "";

    noticiasJson.forEach(noticia => {
        let tempo = calculaTempoPublicacao(converterData(noticia));
        tabela.innerHTML += `
            <tr>
                <td>${noticia.titulo}</td>
                <td>${noticia.descricao}</td>

                <td>
                    <a href="${noticia.link}" target="_blank">${noticia.nomeSite}</a>
                </td>

                <td>${tempo} dias</td>

                <td>
                    <button onclick="deletarNoticia('${noticia.id}')">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// função assíncrona para carregar as notícias
async function carregarNoticias() {
    const requisicao = await fetch(
        "http://localhost:3000/noticias"
    );

    const noticias = await requisicao.json();

    exibirNoticias(noticias)
}

carregarNoticias();

// função para deletar as notícias
async function deletarNoticia(id) {

    await fetch(`http://localhost:3000/noticias/${id}`,
        {
            method: "DELETE"
        }
    );

    await carregarNoticias();
}

// função para adicionar as notícias
async function adicionarNoticia(event) {

    event.preventDefault();

    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    let data = document.getElementById("data").value;
    let hora = document.getElementById("hora").value;
    let site = document.getElementById("site").value;
    let link = document.getElementById("link").value;

    const resposta = await fetch(
        "http://localhost:3000/noticias"
    );

    const noticias = await resposta.json();

    let maiorId = 0;

    noticias.forEach(noticia => {

        let idAtual = parseInt(noticia.id);

        if (!isNaN(idAtual) && idAtual > maiorId) {
            maiorId = idAtual;
        }
    });

    let novoId = maiorId + 1;

    let partes = data.split("-");
    data = `${partes[2]}/${partes[1]}/${partes[0]}`;

    await fetch("http://localhost:3000/noticias",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                id: novoId,
                titulo,
                descricao,
                dataPublicacao: data,
                horaPublicacao: hora,
                nomeSite: site,
                link
            })
        }
    );

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("data").value = "";
    document.getElementById("hora").value = "";
    document.getElementById("site").value = "";
    document.getElementById("link").value = "";

    await carregarNoticias();
}