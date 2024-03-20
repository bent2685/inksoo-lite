import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uniqueId } from 'lodash'
/**
 * 编辑器状态管理
 */

export interface IWordsCounter {
  chars /* 字符 */ : number
  words /* 词 */ : number
  lines /* 行 */ : number
}

export const useEditorStore = defineStore('editor', () => {
  const filename = ref('')
  const filepath = ref('')
  const isSaved = ref<boolean>(true)
  const markdownValue = ref<string>('')
  const wordsStats = ref<IWordsCounter>({
    chars: 0,
    words: 0,
    lines: 0
  })

  const setFilename = (name: string) => {
    filename.value = name || 'untitle'
  }
  const setFilepath = (path: string) => {
    filepath.value = path
  }

  const execWordsStats /* 计算字数 */ = (markdown: string) => {
    // 移除 Markdown 标记
    const text = markdown
      .replace(/[#*_`\-~^=<>+]/g, '') // 移除标题、粗体、斜体、代码、删除线、引用、链接和列表标记
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接文字
      .replace(/\n+/g, '\n') // 合并多个换行为单个换行
      .replace(/^\s+|\s+$/g, '') // 移除开头和结尾的空白字符

    const words = text.split(/\s+/).filter((word) => word !== '').length // 单词数量为非空白字符分割后的数组长度
    const chars = text.length // 字符数量为文本长度
    const lines = text.split('\n').length // 行数为换行符数量

    const obj = { words, chars, lines }
    wordsStats.value = obj
  }

  const onMarkdownChange = (preMarkdown: string, markdown: string) => {
    markdownValue.value = markdown
    if (preMarkdown.length) {
      isSaved.value = false
    }
    execWordsStats(markdown)
  }

  // 监听打开文件状态
  window.electron.ipcRenderer.on('save-file-cmd', (_, v) => {
    const { saveNew } = v
    /**
     * !!!!!
     * 任务id
     * 当文件进行另存为时，需要拿到的任务id
     */
    const taskUuid = uniqueId('task_')

    if (!saveNew) {
      window.electron.ipcRenderer.send('save-file', {
        taskId: taskUuid,
        data: markdownValue.value,
        filepath: filepath.value
      } as ISaveOption)
    }
    /**
     * !
     * 另存为操作
     */
    if (saveNew) {
      window.electron.ipcRenderer.send('save-file-as', {
        taskId: taskUuid,
        data: markdownValue.value,
        opt4Dialog: {
          defaultPath: filepath.value,
          filters: [{ name: 'Markdown Files', extensions: ['md'] }]
        }
      } as ISaveAsOption)
    }

    /**
     * 监听另存为
     */
    window.electron.ipcRenderer.on('save-file-as-reply', (_, args: ISaveAsReturn) => {
      const { filepath, filename, taskId } = args
      if (taskId !== taskUuid) return

      // 更新文件路径
      setFilename(filename)
      setFilepath(filepath)
      isSaved.value = true
    })
  })

  return {
    setFilename,
    onMarkdownChange,
    setFilepath,
    filepath,
    filename,
    isSaved,
    wordsStats
  }
})
