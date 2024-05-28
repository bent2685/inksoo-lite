import { ipcMain, BrowserWindow } from 'electron'
// import db from '../storage/db'
import db from '../storage/connect'
import { getFileDataByFilePath, syncRecentFileByFilePath } from '../utils/file.utils'
export const loadFileEvents = (win: BrowserWindow) => {
  ipcMain.on('file-4-open', async (_) => {
    const dbConn = await db
    const file = await dbConn('recent_files').select('*').orderBy('update_at', 'desc').first()
    // const file = await db.recentFiles.orderBy('updateAt').reverse().first()
    win.webContents.send('file-4-open-reply', file)
  })

  ipcMain.on('get-file-by-path', async (_, filepath) => {
    const file = await getFileDataByFilePath(filepath)
    win.webContents.send('get-file-by-path-reply', file)
  })

  ipcMain.on('file-info-recent', async (_, filepath) => {
    await syncRecentFileByFilePath(filepath)
    win.webContents.send('file-info-recent-reply')
  })
}
