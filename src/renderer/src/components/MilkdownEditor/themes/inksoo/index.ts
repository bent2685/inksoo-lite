import type { Ctx } from '@milkdown/ctx'
import { editorViewOptionsCtx } from '@milkdown/core'

import '@milkdown/prose/view/style/prosemirror.css'
import '@milkdown/prose/tables/style/tables.css'
import './inksoo.scss'

export function inksoo(ctx: Ctx): void {
  ctx.update(editorViewOptionsCtx, (prev) => {
    const prevClass = prev.attributes
    return {
      ...prevClass,
      attributes: {
        class: 'milkdown milkdown-theme-inksoo'
      }
    }
  })
}
