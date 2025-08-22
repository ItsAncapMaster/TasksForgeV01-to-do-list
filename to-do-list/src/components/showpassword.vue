<template>
    <img src="@/assets/icones/eye.png" alt="" class="btn" @click="show" ref="showr">
    <img src="@/assets/icones/eye-crossed.png" alt="" class="hided" @click="hide" ref="hider">
  </template>
  
  <script>
  import EyeIcon from '@/assets/icones/eye.png'
  import EyeCrossedIcon from '@/assets/icones/eye-crossed.png'
  
  export default {
    props: ['input'],
    methods: {
      show() {
        
          this.input.type = 'text';
          this.$refs.showr.classList.add('hided');
          this.$refs.hider.classList.remove('hided');
          this.$refs.hider.classList.add('btn');
        
      },
      hide() {
         
          this.input.type = 'password';
          this.$refs.showr.classList.remove('hided');
          this.$refs.hider.classList.remove('btn');
          this.$refs.hider.classList.add('hided');
        
      }
    }
  }
  </script>
  
  
  
  
  <style>
  .btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .hided{
    display: none;
  }
  </style>
  