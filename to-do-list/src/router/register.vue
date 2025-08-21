<template>
    <input type="text" v-model="name" placeholder="name">
    <input type="email" v-model="email" placeholder="email">
    <input type="password" v-model="senha" placeholder="senha">
    <button @click="fetchSend">sing in</button>
    <p v-if="estado === true">{{ estado_dado }}</p>
</template>

<script>

export default{
    data(){
    return{
        name: '',
        email: '',
        senha: '',
        estado_dado: undefined,
        estado : false

    }
  },
    methods: {
        fetchSend(){
            const dados = {
                name: this.name,
                email: this.email,
                senha: this.senha
            }

            if(!dados.name || !dados.email ||!dados.senha){
                this.estado_dado = 'por favor prencha todos os campos!'
                this.estado = true;
               return console.log(this.estado_dado);
            }

            this.estado = false;

            (async () => {
                    try {
                        const response = await fetch('http://localhost:8090/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dados)
                        });

                        const resultado = await response.json();

                        localStorage.setItem('token', resultado.token)
                        console.log(resultado);

                        if(resultado.ok){
                        this.$router.push("/");
                        }
                    } catch (erro) {
                        console.error('Erro na requisição:', erro);
                    }
                    })();


        }
    }
}
</script>

<style>

</style>