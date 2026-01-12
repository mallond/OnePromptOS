# BuildMe: Prompting as Infrastructure

Use this document to recreate the MCP mock chat demo and the official Apps SDK quickstart scaffold with parameters.

## Parameters

Set these before you start:

- APP_NAME: name used in MCP server metadata (example: "mock-chat")
- APP_VERSION: semantic version (example: "0.1.0")
- DEMO_DIR: folder for the MCP demo (example: "node-demo001")
- PORT: MCP server port (example: "8787")
- MCP_PATH: MCP endpoint path (example: "/mcp")
- WIDGET_TITLE: widget page title (example: "Mock chat")
- UI_QUERY_PARAM: query string key for MCP URL (example: "mcp")

## Outcome

1) A Node MCP HTTP server using the official MCP SDK.
2) An HTML widget that calls the MCP server from a browser.
3) An official Apps SDK quickstart scaffold (todo example).

## Steps

### 1) MCP mock chat demo (Node, HTTP)

Create `DEMO_DIR/` with these files:

- `DEMO_DIR/package.json`
- `DEMO_DIR/server.js`
- `DEMO_DIR/public/chat-widget.html`
- `DEMO_DIR/README.md`

#### DEMO_DIR/package.json

Use:

```
{
  "name": "<APP_NAME>-demo",
  "version": "<APP_VERSION>",
  "description": "MCP mock chat demo server with HTML widget",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.20.2",
    "zod": "^3.25.76"
  }
}
```

#### DEMO_DIR/server.js

Use the MCP SDK HTTP transport. Register:

- Resource: `ui://widget/chat.html` (HTML widget content)
- Tool: `chat` with input `{ message: string }`
- Tool: `set_mock_reply` with input `{ reply?: string }`

Behavior:

- If `mockReply` is set, return it. Else reply with `here is your message: <message>`.
- Log each HTTP request: `[mcp] METHOD PATH`.

#### DEMO_DIR/public/chat-widget.html

Requirements:

- Calls MCP JSON-RPC at `http://localhost:<PORT><MCP_PATH>` by default.
- Allows override via query parameter: `?<UI_QUERY_PARAM>=http://...`.
- Sends `initialize` before the first `tools/call`.
- Uses `Accept: application/json, text/event-stream`.
- Reuses `Mcp-Session-Id` header if the server returns it.
- Displays chat messages and mock reply status.

#### DEMO_DIR/README.md

Include:

- `npm install`
- `npm start`
- MCP endpoint URL
- Static server command for the widget (example: `python -m http.server 5173`)
- Widget URL with `UI_QUERY_PARAM`

### 2) Official Apps SDK quickstart scaffold

Create `apps-sdk/official/` with:

- `apps-sdk/official/package.json`
- `apps-sdk/official/server.js`
- `apps-sdk/official/public/todo-widget.html`
- `apps-sdk/official/README.md`

Notes:

- Use the official quickstart code from:
  https://developers.openai.com/apps-sdk/quickstart/
- Keep `type: "module"` and the MCP SDK dependencies.
- Ensure the MCP endpoint runs at `http://localhost:<PORT><MCP_PATH>`.

### 3) Verify locally

1) Start the demo MCP server:

```
cd <DEMO_DIR>
npm install
npm start
```

2) Serve the widget from repo root:

```
python -m http.server 5173
```

3) Open the widget:

```
http://127.0.0.1:5173/<DEMO_DIR>/public/chat-widget.html?<UI_QUERY_PARAM>=http://localhost:<PORT><MCP_PATH>
```

4) Confirm server logs show:

```
[mcp] POST <MCP_PATH>
```

## Optional upgrades

- Add auth (API key header) and validate it in `server.js`.
- Add rate limiting or basic request logging to a file.
- Replace mock reply logic with a real model call.
