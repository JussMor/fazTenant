/* eslint-disable no-console */
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

class Logger {
  private static logLevel: LogLevel =
    (process.env.LOG_LEVEL as LogLevel) || 'INFO';

  private static levels: Record<LogLevel, number> = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
  };

  private static shouldLog(level: LogLevel): boolean {
    const shouldLog = this.levels[level] >= this.levels[this.logLevel];
    return shouldLog;
  }

  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static log(level: LogLevel, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const timestamp = this.formatTimestamp();
    let context: string | undefined;

    if (typeof args[0] === 'string') {
      context = args[0];
      args = args.slice(1);
    }

    console.group(`${level} - ${timestamp}`);

    if (context) {
      console.log('Context:', context);
    }

    args.forEach((arg, index) => {
      if (typeof arg === 'string') {
        console.log(`[${index}]:`, arg);
      } else {
        console.dir(arg, { depth: null, colors: true });
      }
    });

    console.groupEnd();
  }

  static debug(...args: unknown[]): void {
    this.log('DEBUG', ...args);
  }

  static info(...args: unknown[]): void {
    this.log('INFO', ...args);
  }

  static warn(...args: unknown[]): void {
    this.log('WARN', ...args);
  }

  static error(...args: unknown[]): void {
    this.log('ERROR', ...args);
  }
}

export default Logger;
