var xLib;
try {
  xLib = new ExternalObject("lib:\PlugPlugExternalObject");
} catch(e) { alert("Missing ExternalObject: " + e); }

// send an event to the tool VM
function dispatch(type, data) {
  if (!xLib) {
    return;
  }
  var eventObj = new CSXSEvent();
  eventObj.type = type;
  eventObj.data = data.join(',');
  eventObj.dispatch();
}

function _log(args, type) {
  var msg = args.join(',');
  dispatch('CONSOLE_' + type, args);
  writeDebugLog(msg);
  $.writeln(msg);
}

function logConsole() {
  var args = Array.prototype.slice.call(arguments);
  _log(args, 'LOG')
}

function logError() {
  var args = Array.prototype.slice.call(arguments);
  _log(args, 'ERROR')
}

console = {
  log: logConsole,
  error: logError
}
