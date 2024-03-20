import { Ref, onMounted, ref } from 'vue'

interface IUseSiderDragOptions {
  resizeDomName: string
  width: number
  minWidth: number
  maxWidth: number
}
interface IUseSiderDragReturn {
  // 拖拽事件(由调用者传递执行函数)
  onDrag: (event: () => void) => void
  onDragEnd: (event: () => () => void) => void
  onReachMin: (event: () => void) => void
  onReachMax: (event: () => void) => void
  // 宽度
  sideBarWidth: Ref<number>
}

export const useSiderDrag: (option: IUseSiderDragOptions) => IUseSiderDragReturn = (option) => {
  const { resizeDomName, minWidth, maxWidth, width } = option

  const sideBarWidth = ref(width)

  let onDragEvent
  let onDragEndEvent
  let onReachMinEvent
  let onReachMaxEvent

  /**
   * 监听拖动
   * @param event 执行事件
   */
  const onDrag = (event: () => void) => {
    onDragEvent = event
  }

  const onDragEnd = (event: () => void) => {
    onDragEndEvent = event
  }
  const onReachMin = (event: () => void) => {
    onReachMinEvent = event
  }
  const onReachMax = (event: () => void) => {
    onReachMaxEvent = event
  }

  onMounted(() => {
    const resizeDom = document.querySelector(resizeDomName) as HTMLElement
    let isDragging = false
    resizeDom.addEventListener('mousedown', (e) => {
      isDragging = true
      resizeDom.classList.add('active')
      const startWidth = sideBarWidth.value
      const startX = e.clientX

      const mouseMove = (e: MouseEvent) => {
        if (isDragging) {
          onDragEvent && onDragEvent()
          const deltaX = e.clientX - startX
          let newWidth = startWidth + deltaX

          if (newWidth < minWidth) {
            onReachMinEvent && onReachMinEvent()
            newWidth = minWidth
          }
          if (newWidth > maxWidth) {
            onReachMaxEvent && onReachMaxEvent()
            newWidth = maxWidth
          }
          sideBarWidth.value = newWidth
        }
      }

      const mouseUp = () => {
        if (isDragging) {
          onDragEndEvent && onDragEndEvent()
          isDragging = false
          resizeDom.classList.remove('active')
          document.removeEventListener('mousemove', mouseMove)
          document.removeEventListener('mouseup', mouseUp)
        }
      }

      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    })
  })

  return { sideBarWidth, onDrag, onDragEnd, onReachMax, onReachMin } as IUseSiderDragReturn
}
