import { $command } from '@milkdown/utils'
import { kbdSchema } from '../schema/kbdSchema'
import { toggleMark } from '@milkdown/prose/commands'

export const toggleKbdCommand /* 反转kbd节点 */ = $command('ToggleKbd', (ctx) => () => {
  return toggleMark(kbdSchema.type(ctx))
})
