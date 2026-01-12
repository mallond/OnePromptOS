import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const widgetHtml = readFileSync("public/chat-widget.html", "utf8");

const chatInputSchema = {
  message: z.string().min(1),
};

let mockReply = null;

function createChatServer() {
  const server = new McpServer({ name: "mock-chat", version: "0.1.0" });

  server.registerResource(
    "chat-widget",
    "ui://widget/chat.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/chat.html",
          mimeType: "text/html+skybridge",
          text: widgetHtml,
          _meta: { "openai/widgetPrefersBorder": true },
        },
      ],
    })
  );

  server.registerTool(
    "set_mock_reply",
    {
      title: "Set mock reply",
      description: "Overrides the chat reply with a canned response.",
      inputSchema: {
        reply: z.string().optional(),
      },
      _meta: {
        "openai/toolInvocation/invoking": "Setting mock reply",
        "openai/toolInvocation/invoked": "Set mock reply",
      },
    },
    async (args) => {
      const reply = args?.reply;
      mockReply = typeof reply === "string" ? reply : null;
      return {
        content: [
          {
            type: "text",
            text: mockReply ? "Mock reply updated." : "Mock reply cleared.",
          },
        ],
        structuredContent: { mockReply },
      };
    }
  );

  server.registerTool(
    "chat",
    {
      title: "Chat",
      description: "Returns a mock reply or echoes the message.",
      inputSchema: chatInputSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/chat.html",
        "openai/toolInvocation/invoking": "Replying",
        "openai/toolInvocation/invoked": "Replied",
      },
    },
    async (args) => {
      const message = args?.message?.trim?.() ?? "";
      const reply = mockReply ?? `here is your message: ${message}`;
      return {
        content: [{ type: "text", text: reply }],
        structuredContent: { lastMessage: message, reply, mockReply },
      };
    }
  );

  return server;
}

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  console.log(`[mcp] ${req.method ?? "UNKNOWN"} ${url.pathname}`);

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/plain" }).end("Mock chat MCP server");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const server = createChatServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(
    `Mock chat MCP server listening on http://localhost:${port}${MCP_PATH}`
  );
});