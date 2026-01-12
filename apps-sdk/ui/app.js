const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const mockInput = document.getElementById('mock-input');
const setMockBtn = document.getElementById('set-mock');
const clearMockBtn = document.getElementById('clear-mock');
const mockStatus = document.getElementById('mock-status');
const apiStatus = document.getElementById('api-status');

const apiBase = new URLSearchParams(window.location.search).get('api') || 'http://127.0.0.1:8787';
apiStatus.textContent = `API: ${apiBase}`;

function addMessage(text, type) {
  const el = document.createElement('div');
  el.className = `message ${type}`;
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendChat() {
  const message = chatInput.value.trim();
  if (!message) {
    return;
  }
  chatInput.value = '';
  addMessage(message, 'user');

  const response = await fetch(`${apiBase}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    addMessage('Request failed.', 'system');
    return;
  }

  const payload = await response.json();
  addMessage(payload.reply || 'No reply.', 'bot');
}

async function refreshMock() {
  const response = await fetch(`${apiBase}/mock-response`);
  if (!response.ok) {
    mockStatus.textContent = 'Current: error';
    return;
  }
  const payload = await response.json();
  mockStatus.textContent = `Current: ${payload.mockReply ?? 'none'}`;
}

async function setMock() {
  const reply = mockInput.value.trim();
  await fetch(`${apiBase}/mock-response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  });
  mockInput.value = '';
  refreshMock();
}

async function clearMock() {
  await fetch(`${apiBase}/mock-response`, { method: 'DELETE' });
  refreshMock();
}

sendBtn.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendChat();
  }
});
setMockBtn.addEventListener('click', setMock);
clearMockBtn.addEventListener('click', clearMock);

refreshMock();