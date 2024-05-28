import { BrowserWindow, Menu, app, dialog, ipcMain } from 'electron'
import { chooseFile } from '../actions/choose-file'
import { save, saveAs } from '../actions/save-file'
import db from '../storage/connect'
import path from 'path'
import { changesSaveDialog } from '../actions/save-file'
import { syncRecentFileByFilePath } from '../utils/file.utils'
const isMac = process.platform === 'darwin'
let menu: Menu

let mainWindow: BrowserWindow
export const loadMenu = (win: BrowserWindow) => {
  mainWindow = win
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' },
        {
          //! 新增文件
          label: 'New File',
          accelerator: 'CommandOrControl+N',
          click: async () => {
            changesSaveDialog(win, () => {
              win.webContents.send('new-file-cmd')
            })
          }
        },
        {
          //! 导入文件
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click: async () => {
            changesSaveDialog(win, async () => {
              const filepath = await chooseFile(['md'])
              try {
                const file = await syncRecentFileByFilePath(filepath)
                win.webContents.send('file-4-open-reply', file)
              } catch (e: any) {
                throw new Error(e.message)
              }
            })
          }
        },
        {
          //! 保存文件
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click: async () => {
            // 保存文件
            win.webContents.send('save-file-cmd', { saveNew: false })
          }
        },
        {
          //! 另存为文件
          label: 'Save as ...',
          accelerator: 'CommandOrControl+Shift+S',
          click: async () => {
            // 另存为文件
            win.webContents.send('save-file-cmd', { saveNew: true })
          }
        }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
              }
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        {
          id: 'showSiderbar',
          label: '侧边栏',
          type: 'checkbox',
          checked: true,
          accelerator: 'CommandOrControl+Shift+L',
          click: (e) => {
            const checked = e.checked
            win.webContents.send('toggle-sidebar', checked)
          }
        }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }])
      ]
    }
  ]

  menu = Menu.buildFromTemplate(template as never)
  Menu.setApplicationMenu(menu)

  menu.getMenuItemById
}

ipcMain.on('active-menu', (_, id) => {
  const menuItem = menu.getMenuItemById(id)
  menuItem?.click && menuItem?.click()
})
