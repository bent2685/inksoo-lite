import { toggleKbdCommand } from '../command/command'

import type { MilkdownPlugin } from '@milkdown/ctx'

export const commands: MilkdownPlugin[] = [toggleKbdCommand].flat()
