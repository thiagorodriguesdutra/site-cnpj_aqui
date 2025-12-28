"use client";

type LogData = Record<string, unknown>;

interface ClientLogger {
  debug: (obj: LogData, msg?: string) => void;
  info: (obj: LogData, msg?: string) => void;
  warn: (obj: LogData, msg?: string) => void;
  error: (obj: LogData, msg?: string) => void;
}

export function createClientLogger(context: string): ClientLogger {
  const formatLog = (level: string, obj: LogData, msg?: string) => {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      context,
      message: msg,
      ...obj,
    };
  };

  return {
    debug: (obj: LogData, msg?: string) => {
      if (process.env.NODE_ENV !== "production") {
        const logData = formatLog("debug", obj, msg);
        console.debug(`[${context}] ${msg || ""}`, logData);
      }
    },
    info: (obj: LogData, msg?: string) => {
      if (process.env.NODE_ENV !== "production") {
        const logData = formatLog("info", obj, msg);
        console.info(`[${context}] ${msg || ""}`, logData);
      }
    },
    warn: (obj: LogData, msg?: string) => {
      const logData = formatLog("warn", obj, msg);
      console.warn(`[${context}] ${msg || ""}`, logData);
    },
    error: (obj: LogData, msg?: string) => {
      const logData = formatLog("error", obj, msg);
      console.error(`[${context}] ${msg || ""}`, logData);
    },
  };
}
