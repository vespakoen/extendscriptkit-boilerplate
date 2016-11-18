# extendscript-boilerplate

Boilerplate code for a CEP Panel extension.

- Using browserify & babel to bundle files together and compile ES6 (= ES2015) all the way down to ES3 (ExtendScript compatible).
- Watches for changes to files and rebundles / reloads the script automatically
- When errors occur, logs them to the Chrome Remote Debugger console and the Panel's window.

At the moment this setup works best (is only tested) on OSX 10.12.1 and After Effects CC 2017.

It uses shims from the `ExtendScript/extendscript-es5-shim` and `vespakoen/extendscriptkit` package to make working with ExtendScript joyful again.

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
git clone https://github.com/vespakoen/extendscript-boilerplate.git
cd extendscript-boilerplate
npm install
npm start
```

Running `npm start` will do a couple of things:

- Enable debug mode for CEP 4 5 6 and 7 (by running `defaults write com.adobe.CSXS.__VERSION_GOES_HERE__ PlayerDebugMode 1;`), this will allow the extension to be loaded without being signed.
- "Tail" some AE log files (you might see old error messages, don't worry about this!)
- Symlink the extension into the `/Library/Application\ Support/Adobe/CEP/extensions` folder
- Start the watch process that compiles jsx/index.js (the ExtendScript code) to build/bundle.jsx
- Start the watch process that compiles jsx/index.js (the Panel / CEF code) and serves it on port 3000
- Open the chrome remote debugger page in Google Chrome (this will show a 404 until you start the extension in Adobe)

When the debugger opens (make sure to start Adobe and load up the extension first!), go to the settings page (icon in the top right) and disable source-maps.

**If you don't disable source-maps, you will get `WEBSOCKET_CLOSED` errors.**

To build your extension for production, run `npm run prod`, this will bundle your code and minify it.

## Using

If `npm start` is running successfully, and you enabled the extension in Adobe, you can start making changes to the code.
Whenever you make a change, the packager will see this and recompile your code and notify the Panel about the change through LiveReload.

### Panel code

Code for the panel resides within the `js/` folder, you can use the futuristic `import / export` syntax, but a CommonJS style `require / module.exports` is fine too.
If you want to run Node.js code from the Panel, make sure to use the `nodeRequire()` function!
This boilerplate has setup a SASS compiler, see the `style.scss` file in the root of this project.

### ExtendScript code

ExtendScript code lives in the `jsx/` folder and you can use ES6 + modules syntax (import / export) there as well!
By default it loads shims from `extendscriptkit` to make "console.log" and "console.error" available within ExtendScript.
The log will show up in the ExtendScript Toolkit, the Chrome Remote Debugger and when you log an error it will also show up in the Panel's window.
To communicate from ExtendScript to the Panel, you can use the `dispatch(type, data)` function which can be imported from `extendscriptkit/jsx/bridge`.

## Resources

- [ExtendScriptKit Docs](https://github.com/vespakoen/extendscriptkit)
- [Adobe CEP Samples Github](https://github.com/Adobe-CEP/Samples)
- [Adobe CEP Resources Github](https://github.com/Adobe-CEP/CEP-Resources)
- [Adobe CEP Resources Github Wiki](https://github.com/Adobe-CEP/CEP-Resources/wiki)
- [After Effects CS6 Scripting Guide](http://blogs.adobe.com/wp-content/blogs.dir/48/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf?file=2012/06/After-Effects-CS6-Scripting-Guide.pdf)
- [ExtendScript Github wiki](https://github.com/ExtendScript/wiki/wiki)
