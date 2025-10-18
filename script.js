const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector('.chat-body');
const sendMessageButton = document.querySelector('#send-message');
const chatbotToggeler = document.querySelector('#chatbot-toggler');
const closeChatbot = document.querySelector('#close-chatbot');
const modeSwitcher = document.getElementById("modeSwitcher");
const modeLabel = document.getElementById("modeLabel");

let useCareerModel = JSON.parse(localStorage.getItem("useCareerModel")) || false;
const mode = useCareerModel ? "career" : "gemini";
const API_KEY = "AIzaSyBG2qHMfwvdKAe7W21oLcjJxHcsRgIqkSw";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = { message: null };
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Update theme UI
const updateTheme = () => {
  const isGemini = !useCareerModel;

  // Body theme classes
  document.body.classList.remove("career-mode", "gemini-mode");
  document.body.classList.add(isGemini ? "gemini-mode" : "career-mode");

  // Label and placeholder
  modeLabel.textContent = isGemini ? "Gemini" : "Career";
  messageInput.placeholder = isGemini
    ? "Ask anything..."
    : "Tell me your interests or skills...";

  // 🎨 Theme colors
  const chatHeader = document.querySelector(".chat-header");
  const toggler = document.querySelector("#chatbot-toggler");
  const allBotAvatars = document.querySelectorAll(".bot-avatar");

  if (chatHeader && toggler) {
    chatHeader.style.background = isGemini ? "darkorchid" : "#9e00f4ff";
    toggler.style.background = isGemini ? "#e07ed1" : "#9e00f4ff";
  }

  // 🟣 Change bot avatar fill (existing and future ones)
  allBotAvatars.forEach(svg => {
    svg.style.backgroundColor = isGemini ? "#e07ed1" : "#9e00f4ff";
  });

  
};


updateTheme();


// Show toast
const showToast = (msg) => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
};

// Toggle event
modeSwitcher.checked = useCareerModel;
modeSwitcher.addEventListener("change", () => {
  useCareerModel = modeSwitcher.checked;
  localStorage.setItem("useCareerModel", useCareerModel);
  updateTheme();
  showToast(useCareerModel ? "Career mode enabled 🎓" : "Gemini mode enabled 🔮");
  
});

// Create message block
const createMessageElement = (content, ...classes) => {
  const div = document.createElement('div');
  div.classList.add('message', ...classes);
  div.innerHTML = content;
  return div;
};

// Gemini API response
const generateGeminiResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");
  chatHistory.push({ role: "user", parts: [{ text: userData.message }] });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiResponseText;
    chatHistory.push({ role: "model", parts: [{ text: apiResponseText }] });
  } catch (error) {
    messageElement.innerHTML = error.message;
    messageElement.style.color = '#ff0000';
  } finally {
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Career model response
const generateCareerResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");
  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userData.message }),
    });
    const data = await response.json();
    messageElement.innerHTML = `📌 Career Recommendation: <b>${data.career_recommendation}</b>`;
  } catch (error) {
    messageElement.innerHTML = "⚠️ Error fetching recommendation.";
    messageElement.style.color = "#ff0000";
  } finally {
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Handle outgoing message
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = '';
  messageInput.dispatchEvent(new Event('input'));
  const messageHTML = `<div class="message-text"></div>`;
  const outgoingMessageDiv = createMessageElement(messageHTML, "message-user");
  outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const isGemini = !useCareerModel;
const botName = isGemini ? "Gemini" : "CareerBot";
const botAvatarIcon = isGemini
  ? `🌌`  // You can also use an SVG path or emoji
  : `🎓`;

const botMessageHTML = `
  <div class="bot-avatar-wrapper">
    <div class="bot-avatar">${botAvatarIcon}</div>
    <span class="bot-name">${botName}</span>
  </div>
  <div class="message-text">
    <div class="thinking-indicator">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
`;

const incomingMessageDiv = createMessageElement(botMessageHTML, "message-bot");
chatBody.appendChild(incomingMessageDiv);
chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

// Add animated glow color
const botAvatar = incomingMessageDiv.querySelector(".bot-avatar");
if (botAvatar) {
  botAvatar.style.backgroundColor = isGemini ? "#e07ed1" : "#9900ffff";
  botAvatar.classList.add("glow");
}


    if (useCareerModel) {
      chatHistory.length = 0;
      generateCareerResponse(incomingMessageDiv);
    } else {
      generateGeminiResponse(incomingMessageDiv);
    }
  }, 500);
};

// Show intro message only once per session
const showInitialBotMessage = () => {
  const currentMode = useCareerModel ? "career" : "gemini";
  const welcomeKey = `welcomeSent-${currentMode}`;
  if (sessionStorage.getItem(welcomeKey)) return; // Show once *per mode*

  const botName = useCareerModel ? "CareerBot" : "Gemini";
  const welcomeMessage = useCareerModel
    ? "🎓 Hello! I'm CareerBot. Tell me your skills or interests, and I'll recommend careers."
    : "🌌 Hi! I'm Gemini, your AI assistant. Ask me anything!";

  const botAvatarIcon = useCareerModel ? "🎓" : "🌌";
  const botColor = useCareerModel ? "#9900ffff" : "#e07ed1";

  const welcomeHTML = `
    <div class="bot-avatar-wrapper">
      <div class="bot-avatar">${botAvatarIcon}</div>
      <span class="bot-name">${botName}</span>
    </div>
    <div class="message-text">${welcomeMessage}</div>
  `;

  const welcomeDiv = createMessageElement(welcomeHTML, "message-bot");
  chatBody.appendChild(welcomeDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  const avatar = welcomeDiv.querySelector(".bot-avatar");
  if (avatar) {
    avatar.style.backgroundColor = botColor;
    avatar.classList.add("glow");
  }

  // Set session flag *per mode*
  sessionStorage.setItem(welcomeKey, "true");
};




// Event Listeners
sendMessageButton.addEventListener('click', (e) => handleOutgoingMessage(e));
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
    handleOutgoingMessage(e);
  }
});
messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";

  const sendButton = document.querySelector("#send-message");
  sendButton.style.display = messageInput.value.trim() ? "block" : "none";
});

chatbotToggeler.addEventListener("click", () => {
  const wasHidden = !document.body.classList.contains("show-chatbot");
  document.body.classList.toggle("show-chatbot");
  if (!sessionStorage.getItem("welcomeSent")) showInitialBotMessage();
  if (wasHidden) showInitialBotMessage();
});
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

sessionStorage.removeItem("welcomeSent-gemini");
sessionStorage.removeItem("welcomeSent-career");


modeSwitcher.addEventListener("change", () => {
  useCareerModel = modeSwitcher.checked;
  localStorage.setItem("useCareerModel", useCareerModel);
  updateTheme();
  showToast(useCareerModel ? "Career mode enabled 🎓" : "Gemini mode enabled 🔮");

  // 👇 Ensure correct welcome shows when mode changes
  setTimeout(() => {
    showInitialBotMessage();
  }, 300);
});
