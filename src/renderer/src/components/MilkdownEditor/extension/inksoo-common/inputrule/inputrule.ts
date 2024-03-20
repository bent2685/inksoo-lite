import { $inputRule } from '@milkdown/utils'
import { kbdSchema } from '../schema/kbdSchema'
import { markRule } from '@milkdown/prose'
export const toggleKbdInputRule = $inputRule((ctx) => {
  return markRule(/(?:<kbd>)([^@]+)(?:<\/kbd>)$/, kbdSchema.type(ctx))
})
