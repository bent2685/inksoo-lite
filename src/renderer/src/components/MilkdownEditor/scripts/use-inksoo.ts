import { Editor } from '@milkdown/core'
import { inksoo } from '../themes/inksoo'
import { inksooCommonPreset } from '../extension/inksoo-common'

export const useInksoo = (editor: Editor) => {
  return editor.config(inksoo).use(inksooCommonPreset)
}
