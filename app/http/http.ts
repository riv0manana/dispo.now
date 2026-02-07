import { OpenAPIHono } from "npm:@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { serveStatic } from "hono/serve-static";
import { cors } from "hono/cors";
import { projects } from "./routes/projects.ts";
import { resources } from "./routes/resources.ts";
import { bookings } from "./routes/bookings.ts";
import { users } from "./routes/users.ts";
import { mcpApp } from "../mcp/server.ts";
import { openapiSpec } from "./openapi.ts";
import { HonoEnv } from "./types.ts";
import { rateLimitMiddleware } from "./middlewares/rateLimit.ts";
import { httpLogger } from "./middlewares/httpLogger.ts";
import { securityHeaders } from "./middlewares/securityHeaders.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

export const app = new OpenAPIHono<HonoEnv>();

// CORS Middleware
app.use("/*", cors());

app.use("/api/*", rateLimitMiddleware);
app.use("/api/*", httpLogger);
app.use("/*", securityHeaders);

// Global Error Handler
app.onError(errorHandler);

// Health Check
app.get("/health", (c) => c.json({ status: "ok", uptime: performance.now() }));

// Routes
app.route("/api/users", users);
app.route("/api/projects", projects);
app.route("/api/resources", resources);
app.route("/api/bookings", bookings);

// MCP Server (Only enabled if MCP_SERVER is present)
const mcp_state = Deno.env.get("MCP_SERVER") || "disabled";
if (mcp_state === "enabled") {
  app.route("/mcp", mcpApp);
}

app.get("/doc", (c) => c.json(openapiSpec));

// Swagger UI
app.get("/ui", swaggerUI({ url: "/doc" }));

// Serve Frontend (Static Files)
const getContent = async (path: string) => {
  try {
    return await Deno.readFile(path);
  } catch (e) {
    return null;
  }
};

app.use("/*", serveStatic({ root: "./frontend/dist", getContent }));

// SPA Fallback (Serve index.html for unknown routes)
app.get("*", serveStatic({ path: "./frontend/dist/index.html", getContent }));
