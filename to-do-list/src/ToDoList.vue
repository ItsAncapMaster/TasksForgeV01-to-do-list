<template>
    <div class="main-container">
      
      <h1 class="title">CREATE TASK</h1>
    
    <div class="modal" ref="modal">
        <input type="text" v-model="tarefa" placeholder="create new">
        <button @click="CreateTask()" class="btn-create">create<img src="C:\Users\energ\OneDrive\Documentos\vue-to-do-list\to-do-list\src\assets\icones\close (1).png" alt="" class="img-create"></button>
    </div>

   
    

    <div v-for="task of lista" class="task-container">
      <div class="text-container">
        <p class="text">{{ task.titulo }}</p>
      </div>
        <p class="status-red" v-if="task.status !== 'concluida'">{{ task.status }}</p>
        <p class="status-green" v-if="task.status === 'concluida'">{{ task.status }}</p>
        <button v-if="task.status && task.status.trim().toLowerCase() === 'concluida'" @click="finishedTask(task.id)" class="btn-check"><img src="C:\Users\energ\OneDrive\Documentos\vue-to-do-list\to-do-list\src\assets\icones\quadrado (2).png" alt="" class="border-check"><img src="C:\Users\energ\OneDrive\Documentos\vue-to-do-list\to-do-list\src\assets\icones\marca-de-verificacao (1).png" alt="" class="v-check"></button>
        <button v-if="task.status && task.status.trim().toLowerCase() !== 'concluida' " @click="finishedTask(task.id)" class="btn-check"><img src="C:\Users\energ\OneDrive\Documentos\vue-to-do-list\to-do-list\src\assets\icones\quadrado.png" alt="" class="img-nc"></button>
        <button @click="excluirTask(task.id)" class="btn-delete"><img src="C:\Users\energ\OneDrive\Documentos\vue-to-do-list\to-do-list\src\assets\icones\marca-cruzada.png" alt=""></button>

    </div>
 

  </div>
  
</template>

<script setup>

import { reactive, ref } from 'vue';

const modal = ref(null);
const btn_open = ref(null);
const lista = ref([]);
const tarefa = ref("");

function modalOpen(){

    btn_open.value.classList.toggle('escondido')
    modal.value.classList.toggle('modal')

}

function modalClose(){

  btn_open.value.classList.toggle('btn-open')
    modal.value.classList.toggle('escondido')

}


function showMensagens() {
  lista.value = []; 
  fetch('http://localhost:8090/getTasks')
    .then(res => res.json())
    .then(data => {
      data.task.forEach(element => {
        lista.value.push(element);
      });
    })
    .catch(err => console.log(err)); // 
}

showMensagens();


function CreateTask() {
     // isso deve estar fora da função se for reativo no Vue

    fetch('http://localhost:8090/PostTasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tarefa: tarefa.value })
    })
    .then(res => {
  console.log("Status da resposta:", res.status);
  return res.json();
})
    .then(data => {
      tarefa.value = ""; // limpa o campo
      showMensagens();
    })
    .catch(err => {
        console.error("Erro ao criar tarefa:", err);
    });
}

function finishedTask(id) {
  fetch(`http://localhost:8090/finishTasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) { 

      tarefa.value = ""; // limpa o campo
      showMensagens();
     
     
    }
  })
  .catch(err => {
    console.error("Erro ao atualizar tarefa:", err);
  });
}

function excluirTask(id){

  fetch(`http://localhost:8090/deleteTasks/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    if(data.ok){
      tarefa.value = ""; // limpa o campo
      showMensagens();
     
    }
  })
  .catch(err =>{
    console.log('deu erro' + err);
  })

}


</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Dangrek&family=Karla:ital,wght@0,200..800;1,200..800&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');

.text{
  font-family: "Poppins", sans-serif;
}

.title{
  color: rgb(255, 255, 255);
  font-family: "Poppins", sans-serif;
  font-size: 21px;
  font-weight: 600;
  position: relative;
  top: 60px;
}

.container-tasks {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto; /* Altura ajustável */
  max-height: 80vh; /* Limita a altura máxima */
  overflow-y: auto; /* Adiciona rolagem vertical */
  justify-content: start;
  align-items: center;
}

.main-container{
  display: flex;
  height: scroll;
  justify-content: start;
  align-items: center;
  flex-direction: column;
}


.escondido{
    display: none;
}

.modal{
    display: flex;
    position: relative; top: 68px;
}
 
.modal input{
  width: 200px;
  height: 35px;
  border-radius: 5px;
  border: none;
  border-top-right-radius:0px ;
  border-bottom-right-radius:0px ;
  padding-left: 20px;
  outline: none;
  font-weight: bolder;
}

.modal input::placeholder{
  color: rgb(18, 18, 18);
  font-family: "Poppins", sans-serif;
  font-weight: 400;
}

body{
  background-color: rgb(21, 21, 21);
  color: white;
}

.task-container {
  background-color: rgb(19, 19, 19);
  border-radius: 3px;
  box-shadow: rgba(110, 110, 110, 0.05) 0px 6px 24px 0px, rgba(138, 138, 138, 0.08) 0px 0px 0px 1px;
  width: 34%;
  min-height: 80px;
  display: flex;
  flex-direction: column; /* Garante que o conteúdo seja empilhado verticalmente */
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  top: 100px;
  padding: 10px; /* Adiciona espaçamento interno */
  box-sizing: border-box; /* Inclui padding no cálculo do tamanho */
  overflow-wrap: break-word; /* Quebra o texto longo */
  word-wrap: break-word; /* Compatibilidade adicional */
  word-break: break-word; /* Quebra palavras longas */
}

.btn-check{
background-color: transparent;
border: none;
position: absolute;right: 620px;top: 2px;
}

.img-nc{
width: 17px;
height: 17px;
position: absolute;
}

.border-check{
  width: 17px;
  height: 17px;
  position: absolute;
}

.v-check{
  width: 10px;
  height: 10px;
  position: absolute;left: 10px;top: 4px;
  z-index: 4000;
}

.btn-delete{
  width: 12px;
  height: 12px;
  position: absolute;left: 612px;top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
}

.btn-delete img{
  width: 12px;
  height: 12px;
  cursor: pointer;
}

.btn-delete img:hover{
  width: 14px;
  height: 14px;

}

.btn-delete :hover{
  width: 15px;
  height: 15px;

}

.status-green{
  color: rgb(1, 103, 33);
  position: absolute;
  bottom: -10px;    /* distância do fundo */
  left: 6px;      /* distância da esquerda */
  padding-right: 44px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 15px;
}

.status-red{
  color: rgb(216, 107, 107);
  position: absolute;
  bottom: -10px;    /* distância do fundo */
  left: 6px;      /* distância da esquerda */
  padding-right: 44px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 15px;
}

.text-container {
  position: relative;top: -9px;
  max-width: 450px;
  overflow-wrap: break-word;
  word-break: break-word;       /* compatibilidade extra */
  white-space: normal;
}

.img-create{
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  position: relative; left: 6px;
}

.btn-create{
  background-color: white;
  font-weight: bold;
  border: none;
  padding-right: 14px;
  border-radius: 6px;
  border-top-left-radius:0px ;
  border-bottom-left-radius:0px ;
  position: relative;left: 2px;
  font-size: 16px;
}

</style>