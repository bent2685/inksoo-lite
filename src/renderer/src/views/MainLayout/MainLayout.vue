<script setup lang="ts">
import MilkdownEditor from '@renderer/components/MilkdownEditor/MilkdownEditor.vue'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
</script>

<template>
  <div class="main-layout">
    <section class="editor">
      <MilkdownProvider class="milkdown-provider">
        <ProsemirrorAdapterProvider>
          <MilkdownEditor />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  & > .editor {
    padding: 60px 12px 0;
  }
}
</style>
