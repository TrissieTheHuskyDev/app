'use strict';

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';
import * as DiscordRPC from 'discord-rpc';
import { autoUpdater as updater } from 'electron-updater';

const isDev = process.env.NODE_ENV !== 'production';
protocol.registerSchemesAsPrivileged([{
    scheme: 'app', privileges: {standard: true, secure: true}
}]);

// Updater

updater.on('checking-for-update', () => {
    console.info('[Updater] Checking for update...')
    win.webContents.send('updateCheck');
});

updater.on('update-downloaded', (info) => {
    win.webContents.send('updateAlert', info.version);
});

ipcMain.on('restartForUpdate', (event) => {
    updater.quitAndInstall(true, true);
});

app.on('ready', async () => {
    await installVueDevtools();

    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        minWidth: 1024,
        minHeight: 600,
        width: 1024,
        height: 600,
        frame: false
    });

    if (isDev) {
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app');
        win.loadURL('app://./index.html/')
    }

    updater.checkForUpdatesAndNotify();

    win.on('closed', () => {
        win = null
    });
});

// RPC

const CID = '642758973631758336';
const appRPC = new DiscordRPC.Client({transport: 'ipc'});

let actObj = {
    details: 'Idle',
    state: 'It just started!',
    largeImageKey: 'main',
    largeImageText: 'Idle',
    instance: false
}

appRPC.on('ready', () => {
    ipcMain.on('RPC_ready', (event, _rpc) => {
        if (_rpc.enabled) {
            appRPC.setActivity(actObj);
        } else {
            appRPC.clearActivity();
        }
    });

    ipcMain.on('RPC_settingsChanged', (event, _rpc) => {
        if (!_rpc.enabled) return appRPC.clearActivity();
        appRPC.setActivity(actObj);
    });

    ipcMain.on('RPC_clear', (event) => {
        appRPC.clearActivity();
    });

    ipcMain.on('RPC_status', (event, _rpcStatus) => {
        switch (_rpcStatus.type) {
            case 'SEARCHING':
                actObj.details = 'Looking for...';
                actObj.state = `${_rpcStatus.tags}`;
                actObj.largeImageText = 'Looking for';
            break;
            case 'WATCHING':
                actObj.details = 'Watching post';
                actObj.state = `${_rpcStatus.postid}`;
                actObj.largeImageText = 'Watching';
            break;
            case 'IDLE':
                actObj.details = 'Idle';
                actObj.state = `It just started!`;
                actObj.largeImageText = 'Idle';
            break;
            default:
                actObj.details = 'Unknown';
                actObj.state = 'Seems your settings are wrong...';
                actObj.largeImageText = 'Oops!';
            break;
        }
        appRPC.setActivity(actObj);
    }) 
});

appRPC.login({ clientId: CID }).catch((err) => {
    console.error(`F 'cause :: ${err}`);
});