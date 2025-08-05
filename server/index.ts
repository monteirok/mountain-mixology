import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes-simple";
import { networkInterfaces } from "os";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function log(message: string) {
  console.log(message);
}

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files from Next.js build in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(process.cwd(), ".next/static")));
    app.use(express.static(path.join(process.cwd(), "public")));
  }

  // Serve the app on port 3001 (Next.js uses 3000)
  const port = parseInt(process.env.PORT || "3001", 10);
  server.listen(port, '0.0.0.0', () => {
    const localIP = Object.values(networkInterfaces())
      .flat()
      .find(ip => ip?.family === 'IPv4' && !ip?.internal)?.address;
    log(`API Server is running on:`);
    log(`- Local: http://localhost:${port}`);
    log(`- Network: http://${localIP}:${port}`);
  });
})();
