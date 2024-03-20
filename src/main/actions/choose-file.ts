import { dialog } from 'electron'
import fs from 'fs'

export const chooseFile /* 选择文件 */ : (suffix: string[]) => Promise<IChooseFile> = (
  suffix = []
) => {
  return new Promise((resolve, reject) => {
    dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: suffix }]
      })
      .then((res) => {
        if (res.canceled || res.filePaths?.length <= 0) {
          dialog.showErrorBox('fail', 'select file fail')
          return
        }
        const filepath = res.filePaths[0]
        const filename = filepath.split('/').pop() || 'unknow file'

        let data = ''
        const stream = fs.createReadStream(filepath, 'utf-8')
        stream.on('data', (chunk) => {
          data += chunk
        })

        stream.on('end', () => {
          resolve({ data, filename, filepath })
        })
        stream.on('error', (err) => {
          reject(err)
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
