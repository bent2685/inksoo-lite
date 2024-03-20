import { kbdKeymap } from '../keymap/keymap'

import type { MilkdownPlugin } from '@milkdown/ctx'

export const keymaps: MilkdownPlugin[] = [kbdKeymap].flat()
