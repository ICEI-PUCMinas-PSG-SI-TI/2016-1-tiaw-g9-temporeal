
const CHAVE_PERFIL = "perfil";

function obterPerfilSenha() {
    let perfil = JSON.parse(localStorage.getItem(CHAVE_PERFIL));

    if (!perfil) {
        perfil = {
            nome: "João Silva",
            email: "joao@email.com",
            telefone: "(31) 99999-9999",
            tipoUsuario: "Aluno",
            senha: "12345678",
            tema: "claro"
        };
        localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
    }
    return perfil;
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

function alterarSenha(event) {
    event.preventDefault();

    const senhaAtual = document.getElementById("senhaAtual").value.trim();
    const novaSenha = document.getElementById("novaSenha").value.trim();
    const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

    const perfil = obterPerfilSenha();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        mostrarToast("Preencha todos os campos.", "erro");
        return;
    }

    if (senhaAtual !== perfil.senha) {
        mostrarToast("Senha atual incorreta.", "erro");
        return;
    }

    if (novaSenha.length < 8) {
        mostrarToast("A nova senha deve ter pelo menos 8 caracteres.", "erro");
        return;
    }

    if (!/[A-Z]/.test(novaSenha)) {
        mostrarToast("A senha deve conter pelo menos uma letra maiúscula.", "erro");
        return;
    }

    if (!/\d/.test(novaSenha)) {
        mostrarToast("A senha deve conter pelo menos um número.", "erro");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mostrarToast("A confirmação da senha não corresponde.", "erro");
        return;
    }

    if (novaSenha === senhaAtual) {
        mostrarToast("A nova senha deve ser diferente da atual.", "erro");
        return;
    }

    perfil.senha = novaSenha;
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));

    mostrarToast("Senha alterada com sucesso!");
    setTimeout(() => {
        window.location.href = "perfil.html";
    }, 1200);
}

function alternarVisibilidadeSenha(idCampo) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;
    campo.type = campo.type === "password" ? "text" : "password";
}

document.addEventListener("DOMContentLoaded", () => {
    const perfil = obterPerfilSenha();

    if (perfil.tema === "escuro") {
        document.body.classList.add("dark");
    }

    const form = document.getElementById("formSenha");
    if (form) {
        form.addEventListener("submit", alterarSenha);
    }

    document.querySelectorAll(".olho").forEach((botao) => {
        botao.addEventListener("click", () => {
            const alvo = botao.getAttribute("data-alvo");
            alternarVisibilidadeSenha(alvo);

            const icone = botao.querySelector("i");
            if (icone) {
                icone.classList.toggle("fa-eye");
                icone.classList.toggle("fa-eye-slash");
            }
        });
    });
});
