import { kbdSchema, kbdDirective, kbdAttr } from '../schema/kbdSchema'
import type { MilkdownPlugin } from '@milkdown/ctx'

export const schema: MilkdownPlugin[] = [kbdSchema, kbdDirective, kbdAttr].flat()
