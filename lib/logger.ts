/**
 * Error logging utility for CryptoNexus
 * Centralizes error handling and logging across the application
 */

type ErrorLevel = 'error' | 'warn' | 'info';

interface ErrorLog {
  level: ErrorLevel;
  message: string;
  error?: unknown;
  context?: Record<string, unknown>;
  timestamp: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log an error with context
   */
  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const log: ErrorLog = {
      level: 'error',
      message,
      error,
      context,
      timestamp: new Date().toISOString(),
    };

    // In development, log to console for debugging
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, {
        error,
        context,
        timestamp: log.timestamp,
      });
    }

    // In production, send to error tracking service (e.g., Sentry, LogRocket)
    // this.sendToErrorTracking(log);
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: Record<string, unknown>): void {
    const log: ErrorLog = {
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, {
        context,
        timestamp: log.timestamp,
      });
    }
  }

  /**
   * Log info (development only)
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context);
    }
  }

  /**
   * Send error to tracking service (placeholder for future implementation)
   */
  private sendToErrorTracking(log: ErrorLog): void {
    // TODO: Implement error tracking service integration
    // Example: Sentry.captureException(log.error, { extra: log.context });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logError = (message: string, error?: unknown, context?: Record<string, unknown>) => {
  logger.error(message, error, context);
};

export const logWarn = (message: string, context?: Record<string, unknown>) => {
  logger.warn(message, context);
};

export const logInfo = (message: string, context?: Record<string, unknown>) => {
  logger.info(message, context);
};
