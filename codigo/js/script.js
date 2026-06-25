// script.js - Luiz (Login, Cadastro e logout)

function cadastrar() {
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
        //alert("As senhas são diferentes!");
        return;
    }

    const usuario = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        cidade: document.getElementById("cidade").value,
        categoria: document.getElementById("categoria").value,
        escola: document.getElementById("escola").value,
        email: document.getElementById("email").value,
        senha: senha
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    //alert("Cadastro realizado com sucesso!");
    window.location.href = "index.html";
}

function login() {
    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario && usuario.email === email && usuario.senha === senha) {
        
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        window.location.href = "home.html";
    } else {
        //alert("Email ou senha incorretos!");
    }
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

// coloca nome do usuário na home
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (usuarioLogado) {
    const mensagem = document.getElementById("mensagem");
    if (mensagem) mensagem.innerHTML = "Bem-vindo, " + usuarioLogado.nome + "!";

    const nomeUsuario = document.getElementById("nomeUsuario");
    if (nomeUsuario) nomeUsuario.textContent = usuarioLogado.nome;

    const tipoUsuario = document.getElementById("tipoUsuario");
    if (tipoUsuario) tipoUsuario.textContent = usuarioLogado.categoria || "";
}
