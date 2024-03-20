import { prism, prismConfig } from '@milkdown/plugin-prism'

// 编程语言高亮
import markdown from 'refractor/lang/markdown'
import css from 'refractor/lang/css'
import javascript from 'refractor/lang/javascript'
import typescript from 'refractor/lang/typescript'
import jsx from 'refractor/lang/jsx'
import tsx from 'refractor/lang/tsx'
import { Editor } from '@milkdown/core'

export const usePrism = (editor: Editor) => {
  return editor
    .config((ctx) => {
      ctx.set(prismConfig.key, {
        configureRefractor: (refractor) => {
          refractor.register(markdown)
          refractor.register(css)
          refractor.register(javascript)
          refractor.register(typescript)
          refractor.register(jsx)
          refractor.register(tsx)
        }
      })
    })
    .use(prism)
}
