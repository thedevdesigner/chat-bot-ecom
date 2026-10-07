(function () {
  // Prevent duplicate loading
  if (window.MySalesChatWidgetLoaded) return;
  window.MySalesChatWidgetLoaded = true;

  // Configuration
  const CONFIG = {
    botName: 'AI Sales Rep (Demo)',
    primaryColor: '#0284c7'
  };

  // 1. Create a host container element inside the host page
  const hostDiv = document.createElement('div');
  hostDiv.id = 'my-sales-chat-root';
  document.body.appendChild(hostDiv);

  // 2. Attach a Shadow DOM to isolate styles completely from the host website
  const shadow = hostDiv.attachShadow({ mode: 'open' });

  // 3. Inject HTML and encapsulated CSS into the Shadow DOM
  shadow.innerHTML = `
    <style>
      /* Reset & scoped styles so host site CSS can't touch us */
      * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      
      #chat-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${CONFIG.primaryColor};
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        z-index: 999999;
        transition: transform 0.2s ease;
      }
      #chat-toggle-btn:hover { transform: scale(1.05); }

      #chat-window {
        position: fixed;
        bottom: 95px;
        right: 20px;
        width: 380px;
        height: 520px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 999999;
        border: 1px solid #e2e8f0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
      }
      #chat-window.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .chat-header {
        background: ${CONFIG.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .chat-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
      #chat-close-btn {
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }

      .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f8fafc;
      }

      .message {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
        word-break: break-word;
      }
      .message.user {
        background: ${CONFIG.primaryColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 2px;
      }
      .message.bot {
        background: white;
        color: #1e293b;
        align-self: flex-start;
        border-bottom-left-radius: 2px;
        border: 1px solid #e2e8f0;
      }

      .chat-input-area {
        padding: 12px;
        background: white;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 8px;
      }
      .chat-input-area input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        outline: none;
        font-size: 14px;
      }
      .chat-input-area input:focus { border-color: ${CONFIG.primaryColor}; }
      .chat-input-area button {
        background: ${CONFIG.primaryColor};
        color: white;
        border: none;
        padding: 0 16px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }
    </style>

    <!-- UI Elements -->
    <button id="chat-toggle-btn" title="Open Sales Chat">💬</button>
    
    <div id="chat-window">
      <div class="chat-header">
        <h3>${CONFIG.botName}</h3>
        <button id="chat-close-btn">&times;</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="message bot">Hi there! 👋 I'm your test sales assistant. Ask me anything to test the UI layout!</div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chat-input" placeholder="Type a message..." />
        <button id="chat-send-btn">Send</button>
      </div>
    </div>
  `;

  // 4. Element Interactivity Logic
  const toggleBtn = shadow.getElementById('chat-toggle-btn');
  const closeBtn = shadow.getElementById('chat-close-btn');
  const chatWindow = shadow.getElementById('chat-window');
  const sendBtn = shadow.getElementById('chat-send-btn');
  const chatInput = shadow.getElementById('chat-input');
  const chatMessages = shadow.getElementById('chat-messages');

  toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('open'));
  closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

  sendBtn.addEventListener('click', handleUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage();
  });

  async function handleUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user message
    appendMessage('user', text);
    chatInput.value = '';

    // Simulate mock sales rep response (Replace this block with your fetch() when backend is ready)
    const typingId = appendMessage('bot', 'Typing...');
    
    setTimeout(() => {
      shadow.getElementById(typingId).remove();
      appendMessage('bot', `Mock Response: I received your message ("${text}"). The UI is working seamlessly!`);
    }, 1000);
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    const msgId = 'msg-' + Math.random().toString(36).substring(2, 9);
    msgDiv.id = msgId;
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgId;
  }
})();