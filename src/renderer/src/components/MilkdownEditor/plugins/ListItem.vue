<script setup lang="ts">
import { computed } from 'vue'
import { useNodeViewContext } from '@prosemirror-adapter/vue'
const { contentRef, node, selected, setAttrs } = useNodeViewContext()
const attrs = computed(() => {
  return node.value.attrs
})

const toggleChecked = () => {
  setAttrs({ checked: !attrs.value.checked })
}
</script>

<template>
  <li :class="{ 'ProseMirror-selectednode': selected }" class="inksoo-list-item">
    <span class="flex h-6 flex-items-center">
      <input
        v-if="attrs?.checked != null"
        type="checkbox"
        :checked="attrs?.checked"
        @change="toggleChecked"
      />
      <span v-else-if="attrs?.listType == 'bullet'" class="bullet"></span>
      <span v-else>{{ attrs?.label }}</span>
    </span>
    <div :ref="contentRef" />
  </li>
</template>
<style lang="scss" scoped>
.inksoo-list-item {
  display: flex;
  align-items: baseline;
  // margin: 0;
  // padding: 0;
  .bullet {
    display: block;
    width: 8px;
    height: 8px;
    margin-right: 12px;
    background: $primary;
    border: 2px solid $primary;

    border-radius: 50%;
  }

  ul {
    .bullet {
      display: block;
      margin-right: 12px;
      background: transparent;
      border-radius: 50%;
    }
  }
}
</style>
