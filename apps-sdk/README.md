# GPT App UI Scaffold (Mock)

This folder contains a simple UI scaffold meant to be wired to the local mock server in `node/`.

## Structure

- `ui/index.html` UI page
- `ui/styles.css` UI styles
- `ui/app.js` UI logic
- `manifest.mock.json` placeholder manifest data (not official)

## Run locally (mock)

1) Start the mock server:

```
node index.js
```

2) Serve the UI (from this repo root):

```
python -m http.server 5173
```

3) Open the UI:

```
http://127.0.0.1:5173/apps-sdk/ui/index.html
```

## Configure API base URL

The UI reads `api` from the query string. Example:

```
http://127.0.0.1:5173/apps-sdk/ui/index.html?api=http://127.0.0.1:8787
```

## Apps SDK integration

Use the official Apps SDK to replace this mock UI with a real ChatGPT App UI. See:

- https://developers.openai.com/apps-sdk/
- https://developers.openai.com/apps-sdk/quickstart/

When you generate the real app, point its backend to the mock server's `/mcp` endpoint or replace the mock with a real model.