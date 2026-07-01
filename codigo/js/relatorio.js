const API = "http://localhost:3000/recados";



const usuarioLogado =
JSON.parse(localStorage.getItem("usuarioLogado"));



if(!usuarioLogado){

    window.location.href = "index.html";

}



async function carregarRecados(){


try{


const resposta =
await fetch(API);



const recados =
await resposta.json();





const lista =
document.getElementById("listaRecados");



lista.innerHTML = "";





if(recados.length === 0){


lista.innerHTML = `

<p>
Nenhum recado publicado.
</p>

`;


return;


}





recados.forEach(recado=>{


lista.innerHTML += `

<div class="card-dashboard mt-3">


<h6>
📢 Recado
</h6>


<p>
${recado.mensagem}
</p>


<small>
Publicado em: ${recado.data}
</small>



<br>


<button

class="btn btn-danger btn-sm mt-2"

onclick="excluirRecado('${recado.id}')"

>

🗑️ Apagar

</button>



</div>

`;

});





}


catch(error){


console.error(

"Erro ao carregar recados:",

error

);


}


}



async function adicionarRecado(){



const mensagem =

document.getElementById("mensagem").value;





if(!mensagem.trim()){


alert("Digite um recado.");


return;


}



await fetch(API,{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


mensagem,


professor: usuarioLogado.nome,


data:new Date().toLocaleDateString("pt-BR")


})


});




document.getElementById("mensagem").value="";



carregarRecados();



}



function logout(){


localStorage.removeItem("usuarioLogado");


window.location.href="index.html";


}


async function excluirRecado(id){


const confirmar = confirm(
"Tem certeza que deseja apagar este recado?"
);


if(!confirmar){

return;

}



await fetch(`${API}/${id}`,{

method:"DELETE"

});



carregarRecados();


}




document.addEventListener(

"DOMContentLoaded",

carregarRecados

);