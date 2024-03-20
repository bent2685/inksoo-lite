import { commands, inputrules, schema, keymaps } from './composed'
import type { MilkdownPlugin } from '@milkdown/ctx'

export const inksooCommonPreset: MilkdownPlugin[] = [schema, inputrules, commands, keymaps].flat()
