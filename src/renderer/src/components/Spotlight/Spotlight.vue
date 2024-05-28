<script setup lang="ts"></script>

<template>
  <div class="spotlight spotlight__mask">
    <input type="text" placeholder="type something..." />
  </div>
</template>

<style lang="scss" scoped>
.spotlight {
  position: fixed;
  left: 0;
  top: 0;
  &__mask {
    height: 100vh;
    width: 100vw;
    background: #f00;
  }
}
</style>
