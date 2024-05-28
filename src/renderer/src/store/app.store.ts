import { defineStore } from 'pinia'
import { ref } from 'vue'
/**
 * app状态管理
 */
export const useAppStore = defineStore('app', () => {
  const isAppReady = ref(false)

  window.electron.ipcRenderer.on('dom-mount-down', () => {
    console.log(121121)
    isAppReady.value = true
    console.log('finish')
  })

  async function waitForAppReady() {
    return new Promise((resolve) => {
      if (isAppReady.value) {
        resolve(true)
        return
      }

      window.electron.ipcRenderer.once('app-ready', () => {
        resolve(true)
      })
    })
  }

  return { waitForAppReady }
})
