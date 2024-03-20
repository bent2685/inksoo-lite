<!-- MilkdownEditor.vue -->
<template>
  <Milkdown class="milkdown-el" />
</template>

<script setup lang="ts">
import { Editor, rootCtx, defaultValueCtx, EditorStatus } from '@milkdown/core'
import { Milkdown, useEditor } from '@milkdown/vue'
import {
  commonmark,
  listItemSchema,
  headingIdGenerator,
  headingAttr
} from '@milkdown/preset-commonmark'
import { history, historyProviderConfig } from '@milkdown/plugin-history'
import { gfm } from '@milkdown/preset-gfm'
import { usePrism } from './scripts/use-prism'
import { $view, insert, replaceAll, outline, getMarkdown } from '@milkdown/utils'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import ListItem from './plugins/ListItem.vue'
import { useInksoo } from './scripts/use-inksoo'
import { useNodeViewFactory } from '@prosemirror-adapter/vue'
import { useOutlineStore } from '@renderer/store/outline.store'
import { useEditorStore } from '@renderer/store/editor.store'
const nodeViewFactory = useNodeViewFactory()
const markdownValue /* markdown默认值 */ = ``

const { setOutline } = useOutlineStore()
const { setFilename, onMarkdownChange, setFilepath } = useEditorStore()
let editorEl: Editor | undefined
useEditor((root) => {
  const editor = Editor.make()
    // 配置主题
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdownValue)
    })
    // 配置历史记录插件
    .use(history)
    .config((ctx) => {
      ctx.set(historyProviderConfig.key, {
        depth: 100,
        newGroupDelay: 100
      })
    })
    .config((ctx) => {
      const listener = ctx.get(listenerCtx)
      listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
        onMarkdownChange(prevMarkdown, markdown)
        setOutline(outline()(ctx))
      })
    })
    .use(listener)
    .config((ctx) => {
      ctx.set(headingIdGenerator.key, (node) => {
        return node.textContent
      })
    })
    .use(commonmark)
    // gfm
    .use(gfm)
    .use(
      $view(listItemSchema.node, () =>
        nodeViewFactory({
          component: ListItem
        })
      )
    )

  useInksoo(editor)
  usePrism(editor)
  editorEl = editor
  return editor
})

// 监听打开文件状态
window.electron.ipcRenderer.on('open-new-file', (_, v) => {
  const ctx = editorEl?.ctx
  const { filename, data, filepath } = v
  editorEl?.action(replaceAll(data, true))
  const md = editorEl?.action(getMarkdown()) || ''
  onMarkdownChange('', md)
  setOutline(outline()(ctx!))
  setFilename(filename)
  setFilepath(filepath)
})
</script>

<style lang="scss">
.milkdown-el {
  height: 100%;
}
</style>
