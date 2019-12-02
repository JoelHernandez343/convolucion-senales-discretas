const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

if (process.env.NODE_ENV !== 'production'){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  });
}

let mainWindow = null;
Menu.setApplicationMenu(null)

let initialize = () => {

  let createMainWindow = () => {

    const winOptions = {
      width: 1000,
      minWidth: 500,
      height: 650,
      title: "Hola mundo!",
      webPreferences: {
        nodeIntegration: true
      },
      frame: false
    };

    if (process.platform === 'linux') {
      winOptions.icon = path.join(__dirname, '../assets/app-icon/512.png')
    }  

    mainWindow = new BrowserWindow(winOptions);

    mainWindow.loadURL(path.join('file://', __dirname, '/views/index.html'));

    mainWindow.on('closed', () => app.quit());

    mainWindow.setMenu(null);
      
  }

  app.on('ready', () => createMainWindow());

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
      app.quit();
    }
  });

}

initialize();