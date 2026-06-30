
const CHAVE_PERFIL = "perfil";

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

function excluirConta(event) {
    event.preventDefault();

    const senha = document.getElementById("senhaExcluir").value;
    const perfil = JSON.parse(localStorage.getItem(CHAVE_PERFIL));

    if (!perfil) {
        mostrarToast("Nenhuma conta encontrada.", "erro");
        return;
    }

    if (senha !== perfil.senha) {
        mostrarToast("Senha incorreta.", "erro");
        return;
    }

    const confirmar = confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");
    if (!confirmar) return;

    localStorage.clear();
    mostrarToast("Conta excluída com sucesso!");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
}

document.addEventListener("DOMContentLoaded", () => {
    const perfil = JSON.parse(localStorage.getItem(CHAVE_PERFIL));

    if (perfil && perfil.tema === "escuro") {
        document.body.classList.add("dark");
    }

    const form = document.getElementById("formExcluir");
    if (form) {
        form.addEventListener("submit", excluirConta);
    }
});
