const API_ALUNOS = "http://localhost:3000/alunos";
const API_ALERTAS = "http://localhost:3000/alertas";
const API_TAREFAS = "http://localhost:3000/tarefas";



const usuarioLogado =
JSON.parse(localStorage.getItem("usuarioLogado"));



if(!usuarioLogado){

    window.location.href = "index.html";

}



async function carregarProfessor(){


try{


// Nome do professor

const saudacao =
document.getElementById("saudacao");



if(saudacao && usuarioLogado){

    saudacao.innerHTML =
    `Olá, ${usuarioLogado.nome} 👋`;

}



const respostaAlunos =
await fetch(API_ALUNOS);



const alunos =
await respostaAlunos.json();



let somaNotas = 0;

let somaFrequencia = 0;

let alunosAtencao = 0;



alunos.forEach(aluno=>{


    somaNotas += Number(aluno.nota);


    somaFrequencia += Number(aluno.frequencia);



    if(aluno.status === "Atenção"){

        alunosAtencao++;

    }


});





const mediaTurma =

alunos.length

?

(somaNotas / alunos.length).toFixed(1)

:

0;




const frequenciaMedia =

alunos.length

?

(somaFrequencia / alunos.length).toFixed(0)

:

0;





document.getElementById("totalAlunos").innerText =
alunos.length;



document.getElementById("mediaTurma").innerText =
mediaTurma;



document.getElementById("frequenciaMedia").innerText =
frequenciaMedia + "%";



document.getElementById("alunosAtencao").innerText =
alunosAtencao;




const respostaAlertas =
await fetch(API_ALERTAS);



const alertas =
await respostaAlertas.json();




document.getElementById("totalAlertas").innerText =
alertas.length;




const listaAlertas =
document.getElementById("listaAlertas");



listaAlertas.innerHTML="";




alertas.slice(0,5).forEach(alerta=>{


listaAlertas.innerHTML += `

<li>

⚠ ${alerta.aluno} - ${alerta.titulo}

</li>

`;


});




const respostaTarefas =
await fetch(API_TAREFAS);



const tarefas =
await respostaTarefas.json();



document.getElementById("totalTarefas").innerText =
tarefas.length;



}



catch(error){


console.error(

"Erro ao carregar painel do professor:",

error

);


}


}



function logout(){


localStorage.removeItem("usuarioLogado");


window.location.href="index.html";


}






document.addEventListener(

"DOMContentLoaded",

carregarProfessor

);