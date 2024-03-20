/**
 * 键盘映射
 */
import { $remark, $markSchema, $markAttr } from '@milkdown/utils'

import directive from 'remark-directive'

export const kbdAttr = $markAttr('kbd')
export const kbdDirective = $remark('kbd', () => directive)
export const kbdSchema = $markSchema('kbd', (ctx) => ({
  parseDOM: [{ tag: 'kbd' }],
  toDOM: (mark) => ['kbd', { class: 'inksoo-keyboard' }],
  parseMarkdown: {
    match: (node) => node.type === 'kbd',
    runner: (state, node, markType) => {
      state.openMark(markType)
      state.addText(node.value as string)
      state.closeMark(markType)
    }
  },
  toMarkdown: {
    match: (mark) => mark.type.name === 'kbd',
    runner: (state, mark, node) => {
      state.withMark(mark, 'kbd', node.text || '')
    }
  }
}))
