import fs from 'fs'
import { WriteFileOptions } from 'fs'
import { dialog, SaveDialogOptions, ipcMain } from 'electron'
import path from 'path'

export const saveAs /* 另存为 */ = (
  taskId: string,
  data: string,
  opt4Save: WriteFileOptions = {
    encoding: 'utf-8'
  },
  opt4Dialog: SaveDialogOptions = {
    title: 'Save as'
  }
): Promise<ISaveAsReturn> => {
  return new Promise((r, reject) => {
    if (!taskId) {
      dialog.showErrorBox('Save Failed', 'unknown task')
      reject(false)
      return
    }
    dialog.showSaveDialog(opt4Dialog).then(async (result) => {
      if (result.canceled || !result.filePath) {
        dialog.showErrorBox('Save Failed', 'Failed to save file')
        reject(false)
        return
      }
      const res = await saveFile(result.filePath, data, opt4Save)
      const { filename, filepath } = res

      dialog.showMessageBox({ message: 'Save Successfully' })
      r({
        taskId,
        filename,
        filepath
      })
    })
  })
}

export const save /* 保存 */ = async (
  filepath: string,
  data: string,
  opt4Save: WriteFileOptions = {
    encoding: 'utf-8'
  },
  taskId: string,
  opt4Dialog: SaveDialogOptions = {
    title: 'Save as'
  }
): Promise<ISaveAsReturn> => {
  // 文件不存在则保存
  if (!filepath || !fs.existsSync(filepath)) {
    const res = await saveAs(taskId, data, opt4Save, opt4Dialog)

    return {
      taskId,
      filename: res.filename,
      filepath: res.filepath
    }
  }
  const res = await saveFile(filepath, data, opt4Save)
  return {
    taskId,
    filename: res.filename,
    filepath: res.filepath
  }
}

export const saveFile /* 保存文件 */ = (
  filepath: string,
  data: string,
  opt4Save: WriteFileOptions = {
    encoding: 'utf-8'
  }
) => {
  return new Promise<{ filepath: string; filename: string }>((r, reject) => {
    fs.writeFile(filepath, data, opt4Save, (err) => {
      if (err) {
        dialog.showErrorBox('Save Failed', 'Failed to save file')
        reject(err)
        return
      }
      const filename = path.basename(filepath) || ''

      r({ filepath, filename })
    })
  })
}

export const changesSaveDialog = (win, callback) => {
  // 若用户未保存，提示用户是否需要保存
  win.webContents.send('check-save')
  ipcMain.once('check-save-reply', async (_, isSave) => {
    if (!isSave) {
      const result = await dialog.showMessageBox({
        type: 'question',
        message: 'Do you want to save and continue, discard changes, or cancel?',
        buttons: ['Save and Continue', 'Discard Changes', 'Cancel'],
        defaultId: 0,
        cancelId: 2
      })
      switch (result.response) {
        case 0:
          //! 保存并继续
          win.webContents.send('save-file-cmd', { saveNew: false })
          ipcMain.once('file-save-okay', (_) => {
            // win.webContents.send('new-file-cmd')
            callback()
          })
          break
        case 1:
          //! 放弃更改并继续
          // win.webContents.send('new-file-cmd')
          callback()
          break
        case 2:
          return
      }
      return
    }
    callback()
    // win.webContents.send('new-file-cmd')
  })
}
