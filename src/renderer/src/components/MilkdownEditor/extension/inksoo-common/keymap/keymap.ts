import { $useKeymap } from '@milkdown/utils'
import { commandsCtx } from '@milkdown/core'
import { toggleKbdCommand } from '../command/command'

export const kbdKeymap = $useKeymap('kbdKeymap', {
  ToggleKbd: {
    shortcuts: 'Mod-k',
    command: (ctx) => {
      const commands = ctx.get(commandsCtx)
      return () => commands.call(toggleKbdCommand.key)
    }
  }
})
