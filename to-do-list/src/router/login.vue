<template>
    <div class="form">
    <input type="email" v-model="email" placeholder="email" class="inputs">
    <input ref="senhaInput" type="password" v-model="senha" placeholder="senha" class="inputs">
    <showpassword :input="$refs.senhaInput"></showpassword>

    <button @click="fetchSend" class="bt">sing in</button>
  
    <p v-if="estado === true">{{ estado_dado }}</p>
</div>
</template>

<script>

import Showpassword from '@/components/showpassword.vue'



export default{
    data(){
    return{
        email: '',
        senha: '',
        estado_dado: undefined,
        estado : false

    }
  },
    methods: {
        fetchSend(){
            const dados = {
                email: this.email,
                senha: this.senha
            }

            if(!dados.email ||!dados.senha){
                this.estado_dado = 'por favor prencha todos os campos!'
                this.estado = true;
               return console.log(this.estado_dado);
            }

            this.estado = false;

            (async () => {
                    try {
                        const response = await fetch('http://localhost:8090/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dados)
                        });

                        const resultado = await response.json();
                        console.log(resultado);

                        localStorage.setItem('token', resultado.token)

                        if(resultado.ok){
                        this.$router.push("/");
                        }
                    } catch (erro) {
                        console.error('Erro na requisição:', erro);
                    }
                    })();


        }
    
    },

    components: {
    Showpassword
  }

    
}
</script>

<style>

.inputs{
    width: 230px;
    height: 38px;
}

.bt{
    width: 230px;
    height: 38px;
}


.form{
    display: flex;
    flex-direction: column;
}

</style>