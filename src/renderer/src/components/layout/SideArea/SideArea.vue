<script setup lang="ts">
import OutlineBoard from '../OutlineBoard/OutlineBoard.vue'
import { getPlatform } from '@renderer/utils/common.util'

const platfrom = getPlatform()

</script>

<template>
  <div class="side-area" :class="{'darwin': platfrom == 'darwin' }">
    <OutlineBoard />
  </div>
</template>

<style lang="scss" scoped>
.side-area {
  height: 100%;
  &.darwin {
    padding-top: 46px;
  }
}
</style>
