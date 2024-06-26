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
  headingAttr,
  linkSchema,
  insertImageInputRule
} from '@milkdown/preset-commonmark'
import { history, historyProviderConfig } from '@milkdown/plugin-history'
import { automd } from '@milkdown/plugin-automd'
import { gfm } from '@milkdown/preset-gfm'
import { usePrism } from './scripts/use-prism'
import { $view, insert, replaceAll, outline, getMarkdown } from '@milkdown/utils'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import ListItem from './plugins/ListItem.vue'
import { useInksoo } from './scripts/use-inksoo'
import { useNodeViewFactory } from '@prosemirror-adapter/vue'
import { useOutlineStore } from '@renderer/store/outline.store'
import { useEditorStore } from '@renderer/store/editor.store'
import { useAppStore } from '@renderer/store/app.store'
const nodeViewFactory = useNodeViewFactory()
const markdownValue /* markdown默认值 */ = ``

const { setOutline } = useOutlineStore()
const { setFilename, onMarkdownChange, setFilepath, setSaved } = useEditorStore()
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
    // 自动闭合链接图片等
    .use(automd)
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
  // 使用Inksoo配置
  useInksoo(editor)
  // 使用Prism配置
  usePrism(editor)
  editorEl = editor
  window.electron.ipcRenderer.on('open-new-file', (_, v) => {
    openNewFile(v)
  })
  editorEl?.onStatusChange((e) => {
    if (e == 'Created') {
      // 请求新文件
      window.electron?.ipcRenderer.send('file-4-open')
      window.electron?.ipcRenderer.on('file-4-open-reply', (_, fileInDb) => {
        console.log(fileInDb)
        if (!fileInDb) return
        const { path } = fileInDb
        window.electron?.ipcRenderer.send('get-file-by-path', path)
        window.electron?.ipcRenderer.once('get-file-by-path-reply', (_, file: IChooseFile) => {
          openNewFile(file)
        })
      })
    }
  })
  return editor
})

const openNewFile = async (v: IChooseFile) => {
  const ctx = editorEl?.ctx
  const { filename, data, filepath } = v
  editorEl?.action(replaceAll(data, true))
  const md = editorEl?.action(getMarkdown()) || ''
  onMarkdownChange('', md)
  setOutline(outline()(ctx!))
  setFilename(filename)
  setFilepath(filepath)
  setSaved(true)
}

window.electron.ipcRenderer.on('new-file-cmd', (_) => {
  const ctx = editorEl?.ctx
  setFilename(null)
  setFilepath(null)
  setSaved(false)
  editorEl?.action(replaceAll('', true))
  setOutline(outline()(ctx!))
})
</script>

<style lang="scss">
.milkdown-el {
  height: 100%;
}
</style>
