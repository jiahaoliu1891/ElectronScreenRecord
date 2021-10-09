const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path/posix');
const { dialog, Menu, desktopCapturer } = require('electron');
const { writeFile } = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      // preload: path.join(__dirname + '/backend/preload.js')
      nodeIntegration: true,
      contextIsolation: false,

    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'app/index.html'));
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.on('show-video-source', async (event) => {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });
  const template = inputSources.map(source => {
    return {
      label: source.name,
      click: () => {event.sender.send('context-menu-command',  source.name, source.id)}
    };
  });
  const menu = Menu.buildFromTemplate(template);
  menu.popup(BrowserWindow.fromWebContents(event.sender));
})

ipcMain.handle('show-save-dialog', async (event, args) => {
  try{
    console.log('----')
    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: 'Save video',
      defaultPath: `vid-${Date.now()}.webm`
    });
    console.log('!!!!!!!!')
    console.log(filePath);
    return filePath;
  } catch(e) {
    console.log(e);
    return 'No';
  }
});
