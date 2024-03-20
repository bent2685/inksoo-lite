/**
 * 键盘映射
 */
import { $remark, $markSchema, $markAttr } from '@milkdown/utils'

import directive from 'remark-directive'

export const kbdAttr = $markAttr('keyboard')
export const kbdDirective = $remark('keyboard', () => directive)

export const kbdSchema = $markSchema('keyboard', (ctx) => ({
  attrs: {
    class: { default: 'inksoo-keyboard' }
  },
  group: 'inline',
  parseDOM: [{ tag: 'kbd' }],
  toDOM: (mark) => ['kbd', { ...ctx.get(kbdAttr.key)(mark), ...mark.attrs }],
  parseMarkdown: {
    match: (node) => node.type === 'keyboard',
    runner: (state, node, markType) => {
      state.openMark(markType)
      state.addText(node.value as string)
      state.closeMark(markType)
    }
  },
  toMarkdown: {
    match: (mark) => mark.type.name === 'keyboard',
    runner: (state, mark, node) => {
      state.withMark(mark, 'text', node.text || '')
    }
  }
}))