<script setup lang="ts">
/**
 * 大纲组件
 */
import { ref, toRefs } from 'vue'
import { useOutlineStore } from '@renderer/store/outline.store'
const { outline } = toRefs(useOutlineStore())
console.log(outline.value)
</script>

<template>
  <div class="outline-board">
    <div class="board-title-area">
      <div i-tabler:vocabulary class="ico"></div>
      <h4>Outline</h4>
    </div>
    <div class="outline-board__list">
      <a
        v-for="item in outline"
        :key="item.id"
        :href="`#${item.id}`"
        class="outline-board__item"
        :class="[`level-${item.level}`]"
      >
        <span>{{ item.text }}</span>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outline-board {
  height: 100%;
  &__list {
    height: 100%;
    overflow: auto;
    padding: 4px 0 60px;
  }
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-track {
    border: 0;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: $bg2;
  }
  &__item {
    padding: 4px 12px;
    cursor: pointer;
    transition: 0.3s;
    color: $text2;
    font-size: 13px;
    display: block;
    text-decoration: none;
    span {
      display: block;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @for $i from 1 through 6 {
      &.level-#{$i} {
        text-indent: calc($i - 1) * 1em;
      }
    }

    &:hover {
      background-color: $bg2;
    }
  }
}
</style>
