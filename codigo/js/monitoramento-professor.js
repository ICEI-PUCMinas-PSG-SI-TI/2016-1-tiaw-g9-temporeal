const API = "http://localhost:3000/alunos";


const usuarioLogado =
JSON.parse(localStorage.getItem("usuarioLogado"));


if(!usuarioLogado){

    window.location.href = "index.html";

}




async function carregarAlunos(){


try{


const resposta =
await fetch(API);



const alunos =
await resposta.json();



const tabela =
document.getElementById("listaAlunos");



tabela.innerHTML = "";



let somaNotas = 0;

let somaFrequencia = 0;

let atencao = 0;





alunos.forEach(aluno=>{



somaNotas += Number(aluno.nota);


somaFrequencia += Number(aluno.frequencia);




if(aluno.status === "Atenção"){

    atencao++;

}





tabela.innerHTML += `

<tr>


<td>
${aluno.nome}
</td>


<td>
${aluno.nota}
</td>


<td>
${aluno.frequencia}%
</td>


<td>
${aluno.status}
</td>



<td>

<button

class="btn btn-warning btn-sm"

onclick="editarAluno('${aluno.id}')"

>

✏️ Editar

</button>


</td>


</tr>

`;



});





const media =

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
media;



document.getElementById("frequenciaMedia").innerText =
frequenciaMedia + "%";



document.getElementById("alunosAtencao").innerText =
atencao;



}



catch(error){


console.error(

"Erro ao carregar alunos:",

error

);


}


}



async function adicionarAluno(){



const nome =
document.getElementById("nomeAluno").value;



const nota =
document.getElementById("notaAluno").value;



const frequencia =
document.getElementById("freqAluno").value;





if(!nome || !nota || !frequencia){


alert("Preencha todos os campos.");


return;


}




const status =
calcularStatus(Number(nota));





await fetch(API,{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


nome,

nota:Number(nota),

frequencia:Number(frequencia),

status


})


});







document.getElementById("nomeAluno").value="";

document.getElementById("notaAluno").value="";

document.getElementById("freqAluno").value="";





carregarAlunos();


}




async function editarAluno(id){



const resposta =
await fetch(`${API}/${id}`);



const aluno =
await resposta.json();





const novaNota =
prompt(

"Digite a nova nota:",

aluno.nota

);




const novaFrequencia =
prompt(

"Digite a nova frequência:",

aluno.frequencia

);





if(novaNota === null || novaFrequencia === null){

return;

}







const status =
calcularStatus(Number(novaNota));






await fetch(`${API}/${id}`,{


method:"PUT",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


...aluno,


nota:Number(novaNota),


frequencia:Number(novaFrequencia),


status


})


});







carregarAlunos();


}





function calcularStatus(nota){


if(nota < 7){

return "Atenção";

}



if(nota >= 9){

return "Excelente";

}



return "Bom";


}



function logout(){


localStorage.removeItem("usuarioLogado");


window.location.href="index.html";


}







document.addEventListener(

"DOMContentLoaded",

carregarAlunos

);