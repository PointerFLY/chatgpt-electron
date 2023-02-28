// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const HOME_URL = 'https://chat.openai.com/chat'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'ChatGPT',
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(HOME_URL)
  buildMenu(mainWindow)
  perseveMainWindow(mainWindow)
}

function perseveMainWindow(mainWindow) {
  var isAppQuitting = false;
  app.on('before-quit', function (evt) {
    isAppQuitting = true;
  });

  mainWindow.on('close', (event) => {
    if (!isAppQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  app.on('activate', () => {
    mainWindow.show()
  })
}

function buildMenu(mainWindow) {
  const menu = Menu.getApplicationMenu()

  const moreMenu = Menu.buildFromTemplate([{
    label: 'Navigate',
    submenu: [
      {
        label: 'Home',
        accelerator: 'Shift+CmdOrCtrl+H',
        click: () => {
          mainWindow.webContents.loadURL(HOME_URL)
        }
      },
      {
        label: 'Forward',
        accelerator: 'CmdOrCtrl+]',
        click: () => {
          mainWindow.webContents.goForward()
        }
      },
      {
        label: 'Back',
        accelerator: 'CmdOrCtrl+[',
        click: () => {
          mainWindow.webContents.goBack()
        }
      }
    ]
  }]);

  moreMenu.items.forEach(item => {
    menu.append(item)
  })

  Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
