# modern-extendscript

This package uses browserify, budo and babel to give you an awesome dev setup for writing CEP / ExtendScript applications.

At the moment this setup works best (is only tested) on OSX 10.12.1 and After Effects CC 2017.

It uses a bunch of tricks to make working with ExtendScript joyful again.

## Requirements

- node.js
- npm
- git

## Terminology

- CEP - Common Extensibility Platform
- CEF - Chrome Embedded Framework
- AE - After Effects
- ExtendScript - The JavaScript runtime that has access to the native application (ES3)

## Getting started

```shell
git clone https://github.com/vespakoen/modern-extendscript.git
cd modern-extendscript
npm install
npm start
```

Running `npm start` will do a couple of things:

- Enable debug mode for CEP 4 5 6 and 7 (by running `defaults write com.adobe.CSXS.__VERSION_GOES_HERE__ PlayerDebugMode 1;`)
- Tail the AE log file (v6)
- Tail the AE html engine renderer log file (v6)
- Tail the AE html engine log file (v6)
- Open the chrome remote debugger page in Google Chrome (this will show a 404 until you start the extension in Adobe)
- Symlink the extension into the `/Library/Application\ Support/Adobe/CEP/extensions` folder
- Start the watch process that compiles index.jsx (the ExtendScript code) to build/bundle.jsx
- Start the watch process that compiles index.js (the panel code) and serves it on port 3000

When the debugger opens (make sure to start Adobe and load up the extension first!), go to the settings page (icon in the top right) and disable source-maps.
If you don't disable source-maps, you will get `WEBSOCKET_CLOSED` errors.

## Using

If `npm start` is running successfully, and you enabled the extension in Adobe, you can start making changes to the code.
Whenever you make a change, the packager will see this and recompile your code and notify the Panel about the change through LiveReload.

**This will however hang** until you focus the AE application (simply click on it every time you saved some changes)

Once AE is focused, it will reload the panel and the code will update.

The provided shim will also make "console.log" and "console.error" available within ExtendScript, and whenever you log an error, it will show up in your Panel's window as well.
