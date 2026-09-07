/**
 * SalesBot AI - Standalone Embeddable Website Chat Widget Loader
 * Version: 1.0.0
 * Usage:
 * <script src="http://localhost:5173/widget.js" data-position="bottom-right" data-theme="blue" data-welcome="true"></script>
 */

(function () {
  if (window.SalesBotWidgetLoaded) return;
  window.SalesBotWidgetLoaded = true;

  // Find script element & metadata attributes
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const API_ENDPOINT = currentScript?.getAttribute('data-api-url') || 'http://localhost:8000/api/v1';
  const PRIMARY_COLOR = currentScript?.getAttribute('data-color') || '#0072ff';
  const WELCOME_BANNER = currentScript?.getAttribute('data-welcome') !== 'false';
  const BOT_TITLE = currentScript?.getAttribute('data-title') || 'SalesBot AI Assistant';

  // Visitor Session Management
  const SESSION_KEY = 'salesbot_visitor_session_id';
  let visitorSessionId = localStorage.getItem(SESSION_KEY);
  if (!visitorSessionId) {
    visitorSessionId = 'visitor_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, visitorSessionId);
  }

  // Local Storage Chat Log Persistence
  const CHAT_LOG_KEY = 'salesbot_visitor_chat_logs_' + visitorSessionId;
  let chatHistory = [];
  try {
    const savedLogs = localStorage.getItem(CHAT_LOG_KEY);
    if (savedLogs) chatHistory = JSON.parse(savedLogs);
  } catch (e) {
    chatHistory = [];
  }

  if (chatHistory.length === 0) {
    chatHistory.push({
      sender: 'bot',
      message: '👋 Welcome to our website! I am your AI Sales Assistant. How can I help scale your business today?',
      suggested_actions: ['⚡ Book Demo', '💰 View Pricing', '📊 Calculate Lead Score'],
      timestamp: new Date().toISOString()
    });
    saveHistory();
  }

  function saveHistory() {
    try {
      localStorage.setItem(CHAT_LOG_KEY, JSON.stringify(chatHistory));
    } catch (e) {}
  }

  // Inject Styles into Document Head
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .sb-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .sb-widget-fab {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${PRIMARY_COLOR}, #ff9f00);
      box-shadow: 0 8px 24px rgba(0, 114, 255, 0.35);
      border: 2px solid #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }
    .sb-widget-fab:hover {
      transform: scale(1.08) rotate(3deg);
      box-shadow: 0 12px 30px rgba(0, 114, 255, 0.45);
    }
    .sb-widget-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #10b981;
      border: 2px solid #ffffff;
      border-radius: 50%;
    }
    .sb-welcome-tooltip {
      margin-bottom: 12px;
      background: #0c192c;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      font-size: 13px;
      max-width: 260px;
      line-height: 1.4;
      position: relative;
      animation: sbSlideUp 0.4s ease-out;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .sb-welcome-close {
      position: absolute;
      top: 6px;
      right: 8px;
      cursor: pointer;
      color: #94a3b8;
      font-size: 14px;
      font-weight: bold;
    }
    .sb-chat-window {
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 580px;
      max-height: calc(100vh - 100px);
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(10, 25, 47, 0.25);
      border: 1px solid #e1e8f0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-bottom: 16px;
      animation: sbPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .sb-chat-header {
      background: linear-gradient(135deg, #0c192c 0%, #1a2b4c 100%);
      color: #ffffff;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .sb-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sb-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0072ff, #ff9f00);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      color: #fff;
    }
    .sb-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sb-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.45;
      word-break: break-word;
    }
    .sb-msg-user {
      align-self: flex-end;
      background: #0072ff;
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .sb-msg-bot {
      align-self: flex-start;
      background: #ffffff;
      color: #0c192c;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .sb-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }
    .sb-chip {
      background: #eef4fc;
      color: #0072ff;
      border: 1px solid #bcccdc;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sb-chip:hover {
      background: #0072ff;
      color: #ffffff;
    }
    .sb-footer {
      padding: 12px;
      background: #ffffff;
      border-top: 1px solid #e1e8f0;
      display: flex;
      gap: 8px;
    }
    .sb-input {
      flex: 1;
      border: 1px solid #cbd5e1;
      padding: 10px 14px;
      border-radius: 20px;
      font-size: 13px;
      outline: none;
    }
    .sb-input:focus {
      border-color: #0072ff;
    }
    .sb-send {
      background: #0072ff;
      color: #fff;
      border: none;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @keyframes sbSlideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes sbPopIn {
      from { opacity: 0; transform: scale(0.9) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(styleEl);

  // Render Widget Markup
  const container = document.createElement('div');
  container.className = 'sb-widget-container';

  let isOpen = false;
  let bannerVisible = WELCOME_BANNER;

  function render() {
    container.innerHTML = `
      ${!isOpen && bannerVisible ? `
        <div class="sb-welcome-tooltip">
          <span class="sb-welcome-close" id="sbCloseBanner">✕</span>
          👋 <strong>Need assistance?</strong><br/>Chat with our AI Sales Assistant to get instant pricing or book a live product demo!
        </div>
      ` : ''}

      ${isOpen ? `
        <div class="sb-chat-window">
          <div class="sb-chat-header">
            <div class="sb-header-info">
              <div class="sb-avatar">🤖</div>
              <div>
                <div style="font-weight: 700; font-size: 14px;">${BOT_TITLE}</div>
                <div style="font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px;">
                  ● Online • 24/7 AI Sales Rep
                </div>
              </div>
            </div>
            <button id="sbMinBtn" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">✕</button>
          </div>

          <div class="sb-body" id="sbChatBody">
            ${chatHistory.map(item => `
              <div class="sb-msg ${item.sender === 'user' ? 'sb-msg-user' : 'sb-msg-bot'}">
                <div>${escapeHtml(item.message)}</div>
                ${item.suggested_actions && item.suggested_actions.length > 0 ? `
                  <div class="sb-actions">
                    ${item.suggested_actions.map(act => `<button class="sb-chip" data-act="${escapeHtml(act)}">${escapeHtml(act)}</button>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <div class="sb-footer">
            <input type="text" class="sb-input" id="sbMsgInput" placeholder="Ask about features, pricing, or demos..." />
            <button class="sb-send" id="sbSendBtn">➤</button>
          </div>
          <div style="text-align: center; background:#f8fafc; font-size:10px; color:#64748b; padding-bottom:6px;">
            ⚡ Powered by <strong>SalesBot AI</strong>
          </div>
        </div>
      ` : ''}

      <div class="sb-widget-fab" id="sbFabBtn" title="Chat with AI Sales Assistant">
        ${isOpen ? '✕' : '💬'}
        <div class="sb-widget-badge"></div>
      </div>
    `;

    // Bind Event Listeners
    const fab = container.querySelector('#sbFabBtn');
    if (fab) fab.onclick = toggleWidget;

    const closeBanner = container.querySelector('#sbCloseBanner');
    if (closeBanner) closeBanner.onclick = (e) => { e.stopPropagation(); bannerVisible = false; render(); };

    const minBtn = container.querySelector('#sbMinBtn');
    if (minBtn) minBtn.onclick = toggleWidget;

    const sendBtn = container.querySelector('#sbSendBtn');
    const msgInput = container.querySelector('#sbMsgInput');
    if (sendBtn && msgInput) {
      sendBtn.onclick = () => sendMessage(msgInput.value);
      msgInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(msgInput.value); };
    }

    const chips = container.querySelectorAll('.sb-chip');
    chips.forEach(chip => {
      chip.onclick = () => {
        const text = chip.getAttribute('data-act');
        if (text) sendMessage(text);
      };
    });

    scrollToBottom();
  }

  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) bannerVisible = false;
    render();
  }

  function scrollToBottom() {
    setTimeout(() => {
      const body = container.querySelector('#sbChatBody');
      if (body) body.scrollTop = body.scrollHeight;
    }, 50);
  }

  async function sendMessage(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    chatHistory.push({
      sender: 'user',
      message: cleanText,
      timestamp: new Date().toISOString()
    });
    saveHistory();
    render();

    // Show typing state
    chatHistory.push({
      sender: 'bot',
      message: 'Typing response...',
      timestamp: new Date().toISOString()
    });
    render();

    try {
      const response = await fetch(`${API_ENDPOINT}/bot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          session_id: visitorSessionId
        })
      });

      let botData;
      if (response.ok) {
        botData = await response.json();
      } else {
        botData = fallbackSynthesize(cleanText);
      }

      chatHistory.pop(); // remove typing indicator
      chatHistory.push({
        sender: 'bot',
        message: botData.reply || 'Thank you! Our sales team will get back to you shortly.',
        suggested_actions: botData.suggested_actions || [],
        timestamp: new Date().toISOString()
      });
      saveHistory();
    } catch (err) {
      chatHistory.pop();
      const botData = fallbackSynthesize(cleanText);
      chatHistory.push({
        sender: 'bot',
        message: botData.reply,
        suggested_actions: botData.suggested_actions || [],
        timestamp: new Date().toISOString()
      });
      saveHistory();
    }

    render();
  }

  function fallbackSynthesize(msg) {
    const l = msg.toLowerCase();
    if (['price', 'pricing', 'cost', 'plan', 'quote', 'tier', 'subscription'].some(p => l.includes(p))) {
      return {
        reply: '💰 SalesBot AI offers 3 tiers:\n\n1. Starter ($49/user/mo): BANT Lead Scoring Matrix\n2. Professional ($99/user/mo): Conversational AI Assistant & 1-Click Demo Booking\n3. Enterprise (Custom): Dedicated SLA, SSO & REST API Sync.',
        suggested_actions: ['⚡ Book Demo', '📊 Lead Score Calculator']
      };
    }
    if (['demo', 'book', 'meeting', 'call', 'calendar', 'appointment'].some(p => l.includes(p))) {
      return {
        reply: '📅 We offer live 1-on-1 Product Demos with senior solution engineers!\n\nSlots available this week:\n• Morning Slot: Tomorrow at 10:30 AM EST\n• Afternoon Slot: Tomorrow at 2:00 PM EST',
        suggested_actions: ['Book Morning Slot', 'Book Afternoon Slot']
      };
    }
    if (['feature', 'capabilities', 'what can you do', 'function', 'tool', 'service', 'platform'].some(p => l.includes(p))) {
      return {
        reply: '🚀 SalesBot AI Capabilities:\n\n• Automated BANT Lead Qualification (0-100)\n• 24/7 Conversational AI Chat Widget\n• 1-Click Calendar Meeting Booking\n• AI Sales Outreach Email Generator\n• CRM Pipeline Synchronization',
        suggested_actions: ['⚡ Book Demo', '💰 View Pricing']
      };
    }
    if (['integrate', 'integration', 'api', 'embed', 'script', 'website', 'crm'].some(p => l.includes(p))) {
      return {
        reply: '🔌 Integration & Embedding:\n\n• Copy 1-line script `<script src="http://localhost:5173/widget.js"></script>` to deploy on any site.\n• Full REST API V1 endpoints for custom CRM integration.',
        suggested_actions: ['⚡ Book Demo', '💰 View Pricing']
      };
    }
    if (['hi', 'hello', 'hey', 'greetings'].some(p => l.includes(p))) {
      return {
        reply: 'Hello! 👋 I am your SalesBot AI Assistant. How can I help scale your sales pipeline today?',
        suggested_actions: ['⚡ Book Demo', '💰 View Pricing', '📊 Calculate Lead Score']
      };
    }
    const cleanText = msg.replace(/[^\w\s]/gi, '');
    const words = cleanText.split(' ').filter(w => w.length > 3 && !['what', 'how', 'this', 'that', 'there', 'have', 'with', 'from', 'your', 'they', 'about', 'could', 'would'].includes(w.toLowerCase()));
    const topic = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(', ') || 'Sales Automation';
    return {
      reply: `💡 SalesBot AI Answer regarding '${topic}':\n\nSalesBot AI automates inbound discovery, BANT lead scoring, and meeting booking 24/7. Would you like to explore pricing or schedule a live demo?`,
      suggested_actions: ['⚡ Book Demo', '💰 View Pricing', '📊 Calculate Lead Score']
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  document.body.appendChild(container);
  render();
})();
