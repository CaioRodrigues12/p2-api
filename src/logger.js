const winston = require('winston');

async function sendLogToBetterStack(logData) {
  try {
    const BETTERSTACK_URL = process.env.BETTERSTACK_URL;
    const BETTERSTACK_TOKEN = process.env.BETTERSTACK_TOKEN;
    
    if (!BETTERSTACK_URL || !BETTERSTACK_TOKEN) {
      console.warn('⚠️ BetterStack não configurado - logs não serão enviados');
      return;
    }
    
    const response = await fetch(BETTERSTACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BETTERSTACK_TOKEN}`,
        'User-Agent': 'API-P2-Logger'
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Falha no envio para BetterStack:', response.status, errorText);
    } else {
      console.log('✅ Log enviado com sucesso para BetterStack');
    }
  } catch (err) {
    console.error('❌ Erro ao enviar log para BetterStack:', err.message);
  }
}

function loggerMiddleware(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
    
    console.log(`[${timestamp}] ${logMessage}`);

    const logPayload = {
      message: logMessage,
      level: res.statusCode >= 400 ? 'error' : 'info',
      timestamp: timestamp,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: duration,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      environment: process.env.NODE_ENV || 'development'
    };

    sendLogToBetterStack(logPayload);
  });
  
  next();
}

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-integracao' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = {
  loggerMiddleware,
  winstonLogger,
  sendLogToBetterStack
}; 