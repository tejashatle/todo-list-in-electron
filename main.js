const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu, ipcMain} = electron;

process.env.NODE_ENV = 'production';

var mainWindow;

// Listen for app to be ready
app.on('ready' ,function()
{
    //create new window
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        backgroundColor: '#f4f4f4',
        webPreferences: {
            nodeIntegration: true
        }
    });

    // mainWindow.loadURL('https://github.com');

    //Load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Cathc item todo

ipcMain.on('todo:add',function(e, todo){
    mainWindow.webContents.send('todo:add', todo);
});

//create menu template

const mainMenuTemplate = [
    
    {
        label: 'File',
        submenu: [
            {
                label: 'Clear Items',
                click()
                {
                    mainWindow.webContents.send('todo:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl + Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// if mac add {} to menu
if(process.platform == 'darwin')
{
    mainMenuTemplate.unshift({});
}

//add developers tool if not in production
if(process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Devtools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload',
            }
        ]
    });
}