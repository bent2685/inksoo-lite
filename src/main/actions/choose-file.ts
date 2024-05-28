import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { getFileDataByFilePath } from '../utils/file.utils'
import db from '../storage/connect'
export const chooseFile /* 选择文件 */ : (suffix: string[]) => Promise<string> = (suffix = []) => {
  return new Promise((resolve, reject) => {
    dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: suffix }]
      })
      .then(async (res) => {
        if (res.canceled || res.filePaths?.length <= 0) {
          dialog.showErrorBox('fail', 'select file fail')
          return
        }
        const filepath = res.filePaths[0]
        resolve(filepath)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
