import { toggleKbdInputRule } from '../inputrule/inputrule'

import type { MilkdownPlugin } from '@milkdown/ctx'

export const inputrules: MilkdownPlugin[] = [toggleKbdInputRule].flat()
