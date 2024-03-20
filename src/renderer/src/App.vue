<script setup lang="ts">
import { useDark, useToggle, usePreferredDark } from '@vueuse/core'
import MenuBar from '@renderer/components/layout/MenuBar/MenuBar.vue'
import MainLayout from './views/MainLayout/MainLayout.vue'
import SideArea from './components/layout/SideArea/SideArea.vue'
import { onMounted, ref } from 'vue'
const isDark = useDark()
isDark.value = usePreferredDark().value
const isSideBarShow = ref(true)
const toggleDark = useToggle(isDark)
import { useSiderDrag } from '@renderer/hooks/use-sider-drag'

const { sideBarWidth } = useSiderDrag({
  resizeDomName: '.resize-bar',
  width: 240,
  minWidth: 160,
  maxWidth: 400
})

// 监听侧边栏状态
window.electron.ipcRenderer.on('toggle-sidebar', (_, v) => {
  isSideBarShow.value = v
})
</script>
<template>
  <section class="menu-bar-space"></section>
  <main class="app-layout">
    <aside v-show="isSideBarShow" :style="{ width: sideBarWidth + 'px' }">
      <SideArea />
    </aside>
    <span v-show="isSideBarShow" class="resize-bar"></span>
    <section class="right-area">
      <section id="menubar">
        <MenuBar :is-side-show="isSideBarShow" :no-sider="!isSideBarShow" />
      </section>
      <section class="workbench">
        <MainLayout />
      </section>
    </section>
  </main>
</template>

<style lang="scss">
.menu-bar-space {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: $menubar-h;
  // electron拖拽
  -webkit-app-region: drag;
}
.app-layout {
  height: 100vh;
  display: flex;
  width: 100vw;

  aside {
    background: var(--bg-2-fuzzy);
    // transition: 0.2s ease-out;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .right-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: $bg;
    #menubar {
      // background: $bg2;
      border-bottom: 1px solid $border-color;
      height: $menubar-h;
    }

    .workbench {
      flex: 1;
      overflow: auto;
    }
  }
}

.resize-bar {
  $color: #00f8;
  display: block;
  height: 100%;
  z-index: 100;
  transition: 0.3s;
  width: 1px;
  background: $border-color;

  &:hover {
    cursor: ew-resize;
    background: $color;
    // 通过设置阴影，增加宽度
    box-shadow: 0 0 0 1px $color;
  }
}
</style>
