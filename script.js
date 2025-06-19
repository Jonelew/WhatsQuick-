let userCount = 0;
let users = {};

function addUser() {
  userCount++;
  const userDiv = document.createElement('div');
  userDiv.className = 'user-section';
  userDiv.id = `user-${userCount}`;
  
  userDiv.innerHTML = `
    <h3>Friend #${userCount}</h3>
    
    <div class="input-group">
      <input type="text" placeholder="Your Name" id="name-${userCount}" 
             oninput="validateForm(${userCount})">
    </div>
    
    <div class="input-group">
      <input type="tel" placeholder="Phone Number (e.g., 919876543210)" id="phone-${userCount}" 
             oninput="validatePhone(${userCount}); validateForm(${userCount})"
             pattern="[0-9]{10,15}">
      <div class="phone-hint">Include country code without + (e.g., 91 for India, 1 for US)</div>
    </div>
    
    <div class="input-group">
      <textarea placeholder="Type your message here..." id="message-${userCount}" 
                oninput="updateCharCount(${userCount}); validateForm(${userCount})"
                maxlength="1000"></textarea>
      <div class="char-counter" id="char-count-${userCount}">0/1000 characters</div>
    </div>
    
    <div class="button-group">
      <button class="btn btn-primary" onclick="sendMessage(${userCount})" id="send-btn-${userCount}" disabled>
        📱 Send via WhatsApp
      </button>
      <button class="btn btn-danger" onclick="removeUser(${userCount})">
        🗑️ Remove
      </button>
    </div>
  `;
  
  document.getElementById('users').appendChild(userDiv);
  document.getElementById('empty-state').style.display = 'none';
  
  // Store user reference
  users[userCount] = userDiv;
  
  // Focus on name input
  setTimeout(() => {
    document.getElementById(`name-${userCount}`).focus();
  }, 100);
}

function removeUser(id) {
  const userDiv = document.getElementById(`user-${id}`);
  if (userDiv) {
    userDiv.style.animation = 'slideOutDown 0.3s ease-in';
    setTimeout(() => {
      userDiv.remove();
      delete users[id];
      
      // Show empty state if no users
      if (Object.keys(users).length === 0) {
        document.getElementById('empty-state').style.display = 'block';
      }
    }, 300);
  }
}

function validatePhone(id) {
  const phoneInput = document.getElementById(`phone-${id}`);
  const phone = phoneInput.value.replace(/\D/g, ''); // Remove non-digits
  phoneInput.value = phone;
  
  if (phone.length > 0 && phone.length < 10) {
    phoneInput.style.borderColor = '#ff4757';
  } else if (phone.length >= 10) {
    phoneInput.style.borderColor = '#25D366';
  } else {
    phoneInput.style.borderColor = '#e1e5e9';
  }
}

function updateCharCount(id) {
  const textarea = document.getElementById(`message-${id}`);
  const counter = document.getElementById(`char-count-${id}`);
  const length = textarea.value.length;
  
  counter.textContent = `${length}/1000 characters`;
  
  if (length > 800) {
    counter.style.color = '#ff4757';
  } else if (length > 600) {
    counter.style.color = '#ffa726';
  } else {
    counter.style.color = '#888';
  }
}

function validateForm(id) {
  const name = document.getElementById(`name-${id}`).value.trim();
  const phone = document.getElementById(`phone-${id}`).value.trim();
  const message = document.getElementById(`message-${id}`).value.trim();
  const sendBtn = document.getElementById(`send-btn-${id}`);
  
  const isValid = name && phone.length >= 10 && message;
  sendBtn.disabled = !isValid;
  sendBtn.style.opacity = isValid ? '1' : '0.6';
}

function sendMessage(id) {
  const name = document.getElementById(`name-${id}`).value.trim();
  const phone = document.getElementById(`phone-${id}`).value.trim();
  const message = document.getElementById(`message-${id}`).value.trim();

  if (!name || !phone || !message) {
    showNotification("Please fill out all fields.", "error");
    return;
  }

  if (phone.length < 10) {
    showNotification("Please enter a valid phone number.", "error");
    return;
  }

  const encodedMessage = encodeURIComponent(`Hi, this is ${name}:\n\n${message}`);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Visual feedback
  const sendBtn = document.getElementById(`send-btn-${id}`);
  const originalText = sendBtn.innerHTML;
  sendBtn.innerHTML = '📤 Opening WhatsApp...';
  sendBtn.disabled = true;
  
  setTimeout(() => {
    sendBtn.innerHTML = originalText;
    sendBtn.disabled = false;
  }, 2000);
  
  window.open(url, '_blank');
  showNotification(`Message prepared for ${phone}!`, "success");
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  `;
  
  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #25D366, #1ebe5b)';
  } else {
    notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize with one user for demo when page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    addUser();
  }, 500);
});