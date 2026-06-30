
const CHAVE_PERFIL = "perfil";

function criarPerfilPadrao() {
    const hoje = new Date().toLocaleDateString("pt-BR");

    const perfilPadrao = {
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(31) 99999-9999",
        fuso: "GMT-03:00 Brasília",
        tipoUsuario: "Aluno",
        senha: "12345678",
        foto: "",
        membroDesde: hoje
    };

    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfilPadrao));
    return perfilPadrao;
}

function obterPerfil() {
    let perfil = JSON.parse(localStorage.getItem(CHAVE_PERFIL));

    if (!perfil || !perfil.nome || !perfil.email) {
        perfil = criarPerfilPadrao();
    }

    perfil.tipoUsuario = "Aluno";

    return perfil;
}

function salvarPerfilNoStorage(perfil) {
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

function mostrarToast(mensagem, tipo = "sucesso") {
    const toast = document.getElementById("toast");
    if (!toast) {
        alert(mensagem);
        return;
    }
    toast.textContent = mensagem;
    toast.className = "toast mostrar " + tipo;

    setTimeout(() => {
        toast.className = "toast";
    }, 2800);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function carregarPerfil() {
    const perfil = obterPerfil();

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");
    const fuso = document.getElementById("fuso");
    const membroDesde = document.getElementById("membroDesde");

    if (nome) nome.value = perfil.nome;
    if (email) email.value = perfil.email;
    if (telefone) telefone.value = perfil.telefone;
    if (fuso) fuso.value = perfil.fuso || "GMT-03:00 Brasília";
    if (membroDesde) membroDesde.textContent = perfil.membroDesde || "—";

    const nomePerfil = document.getElementById("nomePerfil");
    const nomeHeader = document.getElementById("nomeHeader");
    const emailPerfil = document.getElementById("emailPerfil");

    if (nomePerfil) nomePerfil.textContent = perfil.nome;
    if (nomeHeader) nomeHeader.textContent = perfil.nome;
    if (emailPerfil) emailPerfil.textContent = perfil.email;

    const fotoPerfil = document.getElementById("fotoPerfil");
    const fotoTopo = document.getElementById("fotoTopo");

    if (perfil.foto) {
        if (fotoPerfil) fotoPerfil.src = perfil.foto;
        if (fotoTopo) fotoTopo.src = perfil.foto;
    }
}

function salvarPerfil(event) {
    if (event) event.preventDefault();

    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const telefoneInput = document.getElementById("telefone");
    const fusoInput = document.getElementById("fuso");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    if (!nome) {
        mostrarToast(traduzir("msgNomeObrigatorio"), "erro");
        nomeInput.focus();
        return;
    }

    if (!validarEmail(email)) {
        mostrarToast(traduzir("msgEmailInvalido"), "erro");
        emailInput.focus();
        return;
    }

    const perfil = obterPerfil();
    perfil.nome = nome;
    perfil.email = email;
    perfil.telefone = telefoneInput.value.trim();
    perfil.fuso = fusoInput.value;

    salvarPerfilNoStorage(perfil);
    carregarPerfil();
    mostrarToast(traduzir("msgPerfilAtualizado"));
}

function salvarPreferencias() {
    const perfil = obterPerfil();

    salvarPerfilNoStorage(perfil);
    mostrarToast(traduzir("msgPreferenciasSalvas"));
}

function alterarFoto(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
        mostrarToast(traduzir("msgImagemInvalida"), "erro");
        return;
    }

    const leitor = new FileReader();
    leitor.onload = function (e) {
        const perfil = obterPerfil();
        perfil.foto = e.target.result;
        salvarPerfilNoStorage(perfil);
        carregarPerfil();
        mostrarToast(traduzir("msgFotoAtualizada"));
    };
    leitor.readAsDataURL(arquivo);
}


document.addEventListener("DOMContentLoaded", () => {
    carregarPerfil();

    const formPerfil = document.getElementById("formPerfil");
    if (formPerfil) {
        formPerfil.addEventListener("submit", salvarPerfil);
    }

    const fotoInput = document.getElementById("fotoInput");
    if (fotoInput) {
        fotoInput.addEventListener("change", alterarFoto);
    }

    const irAlterarSenha = document.getElementById("irAlterarSenha");
    if (irAlterarSenha) {
        irAlterarSenha.addEventListener("click", () => {
            window.location.href = "alterarsenha.html";
        });
    }

    const irExcluirConta = document.getElementById("irExcluirConta");
    if (irExcluirConta) {
        irExcluirConta.addEventListener("click", () => {
            window.location.href = "excluirconta.html";
        });
    }
});
