<script setup lang="ts">
import { getPlatform } from '@renderer/utils/common.util'
import { useEditorStore } from '@renderer/store/editor.store'
import { toRefs } from 'vue'
import InfoTag from '@renderer/components/InfoTag/InfoTag.vue'
import InfoTagItem from '@renderer/components/InfoTag/InfoTagItem.vue'
interface IMenuBarProps {
  noSider: boolean
  isSideShow: boolean
}

const props = defineProps<IMenuBarProps>()
const platfrom = getPlatform()

const { filename, isSaved, wordsStats } = toRefs(useEditorStore())

const showSideBar = () => {
  window.electron.ipcRenderer.send('active-menu', 'showSiderbar')
}
</script>

<template>
  <div
    ref="menuBar"
    class="menu-bar h100% flex gap2 flex-items-center p-x-3 text-text2 select-none"
    :class="{ 'no-sider': props.noSider && platfrom == 'darwin' }"
  >
    <div
      class="no-drag w5 h5 duration-500 cursor-pointer"
      :class="[`i-tabler:layout-sidebar-right-${props.isSideShow ? 'expand' : 'collapse'}-filled`]"
      hover="text-text"
      @click="showSideBar"
    ></div>
    <p>
      <span v-if="!isSaved" class="save-symbol color-pri font-800">*</span>
      <span class="filename">{{ filename || 'untitled' }}</span>
      <span v-if="!isSaved" class="opacity-50"> (unsave) </span>
    </p>
    <div class="menu-bar__right flex-1 flex flex-justify-end">
      <InfoTag>
        <InfoTagItem>chars: {{ wordsStats.chars }}</InfoTagItem>
        <InfoTagItem>lines: {{ wordsStats.lines }}</InfoTagItem>
        <InfoTagItem>words: {{ wordsStats.words }}</InfoTagItem>
      </InfoTag>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-sider {
  padding-left: 80px;
}
</style>
