import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export class LoggerService {
  private logDir: string;
  private logFilePath: string;

  constructor() {
    const userData = app.getPath('userData');
    this.logDir = path.join(userData, 'logs');
    if (!fs.existsSync(this.logDir)) {
      try {
        fs.mkdirSync(this.logDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create logs directory:', err);
      }
    }
    this.logFilePath = path.join(this.logDir, 'app.log');
    this.info(`Logger initialized for BraveType v${app.getVersion() || '1.0.0'}`);
  }

  private write(level: 'INFO' | 'WARN' | 'ERROR', message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const version = app.getVersion() || '1.0.0';
    let logEntry = `[${timestamp}] [v${version}] [${level}] ${message}\n`;

    if (error) {
      if (error.stack) {
        logEntry += `Stack Trace:\n${error.stack}\n`;
      } else {
        logEntry += `Details: ${JSON.stringify(error)}\n`;
      }
    }

    try {
      fs.appendFileSync(this.logFilePath, logEntry, 'utf-8');
    } catch {
      // Fallback
    }
  }

  public info(message: string) {
    this.write('INFO', message);
  }

  public warn(message: string, details?: any) {
    this.write('WARN', message, details);
  }

  public error(message: string, error?: any) {
    this.write('ERROR', message, error);
  }
}
