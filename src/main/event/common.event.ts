import { BrowserWindow, ipcMain } from 'electron'
import { save, saveAs } from '../actions/save-file'
let mainWindow: BrowserWindow
export const loadCommonEvents = (win: BrowserWindow) => {
  mainWindow = win

  ipcMain.on('get-platform', (event) => {
    event.returnValue = process.platform
  })

  ipcMain.on('save-file', async (_, args: ISaveOption) => {
    // 获取
    const { filepath, data, opt4Save, taskId } = args
    const res = await save(filepath!, data!, opt4Save, taskId)
    win.webContents.send('save-file-as-reply', res)
  })

  ipcMain.on('save-file-as', async (_, args: ISaveAsOption) => {
    const { data, opt4Save, opt4Dialog, taskId } = args
    const res = await saveAs(taskId, data!, opt4Save, opt4Dialog)
    win.webContents.send('save-file-as-reply', res)
  })
}
