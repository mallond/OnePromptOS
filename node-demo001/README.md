# MCP Mock Chat Demo (node-demo001)

This is a minimal MCP HTTP server + HTML widget for a mock chat tool.

## Setup

```
npm install
```

## Run

```
npm start
```

The MCP endpoint will be available at:

```
http://localhost:8787/mcp
```

## Widget (browser)

Serve the widget from the repo root:

```
python -m http.server 5173
```

Open the widget (with MCP URL):

```
http://127.0.0.1:5173/node-demo001/public/chat-widget.html?mcp=http://localhost:8787/mcp
```

## Tools

- `chat` takes `{ "message": "..." }` and returns `here is your message: ...` (or a mock reply).
- `set_mock_reply` takes `{ "reply": "..." }` to set/clear the canned response.