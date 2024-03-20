<script setup lang="ts"></script>

<template>
  <div class="info-tag">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.info-tag {
  border-radius: 999px;
  padding: 2px 4px;
  display: flex;
  border: 1px solid $border-color;
  transition: 0.3s;
  &:hover {
    border-color: $primary;
    .info-tag-item {
      color: $primary;
    }
  }
  .info-tag-item {
    padding: 0 6px;
    position: relative;
    &:not(:last-child) {
      &::after {
        content: '';
        position: absolute;
        height: 70%;
        top: 15%;
        right: 0;
        width: 1px;
        background: $border-color;
      }
    }
  }
}
</style>
