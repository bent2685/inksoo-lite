import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './event/main-win.event'
import { syncRecentFileByFilePath } from './utils/file.utils'
import path from 'path'
// import db from './storage/db'
import db from './storage/connect'
let mainWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  electronApp.setAppUserModelId('org.titato.app')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  mainWindow = createMainWindow()
  // 删除数据
  // db.then(async (conn) => await conn('recent_files').truncate())
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('open-file', async (_, filepath) => {
  try {
    const file = await syncRecentFileByFilePath(filepath)
    mainWindow?.webContents.send('file-4-open-reply', file)
  } catch (err) {
    dialog.showErrorBox('main process fail', 'open file fail')
  }
})
