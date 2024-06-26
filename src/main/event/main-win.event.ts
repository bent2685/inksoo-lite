import { BrowserWindow, ipcMain, shell, nativeTheme } from 'electron'
import { join } from 'path'
// @ts-ignore
import icon from '../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { loadMenu } from './menu.event'
import { loadCommonEvents } from './common.event'
import { loadFileEvents } from './file.event'

export const createMainWindow: () => BrowserWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minHeight: 480,
    minWidth: 640,
    icon: join(__dirname, '../../../resources/icon.ico'),
    ...(process.platform === 'darwin'
      ? {
          show: false,
          titleBarStyle: 'hidden',
          frame: false,
          transparent: true
        }
      : {}),
    trafficLightPosition: { x: 10, y: 8 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  loadMenu(mainWindow)
  loadCommonEvents(mainWindow)
  loadFileEvents(mainWindow)

  mainWindow.on('ready-to-show', () => {
    setTimeout(() => {
      mainWindow.show()
    }, 200)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  // mainWindow.webContents.openDevTools()

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.setVibrancy('fullscreen-ui')
  return mainWindow
}
