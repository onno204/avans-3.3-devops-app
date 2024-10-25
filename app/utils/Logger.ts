import { LogLevel } from "./LogLevel";

export class Logger {
  public static log(logLevel: LogLevel, message: any): void {
    if (logLevel >= LogLevel.DEBUG) {
      console.log.apply(console, [this._getCallerFile(), message]);
    }
  }

  private static _getCallerFile() {
    var originalFunc = Error.prepareStackTrace;

    var callerfile;
    try {
      var err = new Error();
      var currentfile;

      Error.prepareStackTrace = function (err, stack) {
        return stack;
      };
      return "123";
      console.error("errr: ", err.stack);

      // currentfile = err.stack.shift().getFileName();

      // while (err.stack.length) {
      //   callerfile = err.stack.shift().getFileName();

      //   if (currentfile !== callerfile) break;
      // }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc;

    return callerfile;
  }
}
