import { defineStore } from 'pinia'
import { ref } from 'vue'
/**
 * 大纲状态管理
 */
type OutlineItem = { text: string; level: number; id: string }
export const useOutlineStore = defineStore('outline', () => {
  const outline = ref<OutlineItem[]>([])

  const setOutline = (opt: OutlineItem[]) => {
    outline.value = opt
  }

  return { setOutline, outline }
})
