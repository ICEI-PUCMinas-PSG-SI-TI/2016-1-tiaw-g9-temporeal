function cadastrar(){


const senha =
document.getElementById("senha").value;



const confirmarSenha =
document.getElementById("confirmarSenha").value;




if(senha !== confirmarSenha){


alert("As senhas são diferentes!");

return;


}




const usuario = {


id: Date.now(),



nome:
document.getElementById("nome").value,



telefone:
document.getElementById("telefone").value,



cidade:
document.getElementById("cidade").value,



tipo:
document.getElementById("categoria").value.toLowerCase(),



escola:
document.getElementById("escola").value,



email:
document.getElementById("email").value,



senha

};





let usuarios =

JSON.parse(localStorage.getItem("usuarios")) || [];





const existe =

usuarios.find(usuarioExistente =>

usuarioExistente.email === usuario.email

);




if(existe){


alert("Este email já está cadastrado!");


return;


}




usuarios.push(usuario);






localStorage.setItem(

"usuarios",

JSON.stringify(usuarios)

);



window.location.href="index.html";



}



function login(){



const email =

document.getElementById("emailLogin").value;





const senha =

document.getElementById("senhaLogin").value;






const usuarios =

JSON.parse(localStorage.getItem("usuarios")) || [];







const usuario =

usuarios.find(usuario =>

usuario.email === email &&

usuario.senha === senha

);




if(usuario){






localStorage.setItem(

"usuarioLogado",

JSON.stringify(usuario)

);




if(usuario.tipo === "professor"){



window.location.href="professor.html";



}

else if(usuario.tipo === "responsavel"){



window.location.href="responsavel.html";



}

else{



window.location.href="home.html";


}





}

else{



alert("Email ou senha incorretos!");



}



}



const usuarioLogado =

JSON.parse(localStorage.getItem("usuarioLogado"));




if(usuarioLogado){



const nomeUsuario =

document.getElementById("nomeUsuario");



if(nomeUsuario){


nomeUsuario.innerHTML =
usuarioLogado.nome;


}




const tipoUsuario =

document.getElementById("tipoUsuario");



if(tipoUsuario){


tipoUsuario.innerHTML =
usuarioLogado.tipo;


}



}





function logout(){


localStorage.removeItem("usuarioLogado");


window.location.href="index.html";


}