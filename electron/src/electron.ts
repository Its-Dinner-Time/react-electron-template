import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { readFileSync, existsSync } from 'fs';
import { mkdirSync, writeFileSync } from 'original-fs';

const isDev = process.env.IS_DEV == 'true' ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(isDev ? 'http://127.0.0.1:5173/' : `file://${path.join(__dirname, '../../dist/index.html')}`);
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('get-app-path', async (event, date) => {
    try {
      const dataPath = path.join(app.getAppPath(), '..', 'data', `${date}.json`);

      if (!existsSync(dataPath)) return null;
      return JSON.parse(readFileSync(dataPath).toString());
    } catch (error) {
      return null;
    }
  });

  ipcMain.handle('write-data', async (event, date, number) => {
    const dataDir = path.join(app.getAppPath(), '..', 'data');
    const dataPath = path.join(dataDir, `${date}.json`);

    if (!existsSync(dataDir)) mkdirSync(dataDir);

    writeFileSync(dataPath, `${number}`);
    return { date, number };
  });

  createWindow();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
