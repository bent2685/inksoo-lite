export const getPlatform = (): NodeJS.Platform => {
  return window.electron.ipcRenderer.sendSync('get-platform')
}
