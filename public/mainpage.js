// DOM Elements
const mainpopup = document.getElementById("main_popupbox");
const imgpopup = document.getElementById("popupimage");
const closepopup = document.getElementById("closepopup");
const html = document.documentElement;

// --- Password Tools Modal Elements (New Simplified Interface) ---
const passwordToolsModal = document.getElementById('passwordToolsModal');
const closeModalBtnPasswordTools = passwordToolsModal.querySelector('.popupClose');
const passwordManagerInput = document.getElementById('passwordManagerInput');
const passwordManagerBtn = document.getElementById('passwordManagerBtn');
const passwordManagerBtnIcon = passwordManagerBtn.querySelector('i');
const passwordManagerBtnText = passwordManagerBtn.querySelector('span');
const copyPasswordManagerBtn = document.getElementById('copyPasswordManagerBtn');
const strengthVisualizer = document.getElementById('passwordManagerStrengthVisualizer');
const originalPasswordDisplay = document.getElementById('originalPasswordDisplay');

// --- Core Password Logic (Reused) ---
function _getRandomChar(charSet) {
  return charSet.charAt(Math.floor(Math.random() * charSet.length));
}

function generatePasswordCoreLogic() {
  const length = 16;
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  
  let password = "";
  password += _getRandomChar(upperCaseChars);
  password += _getRandomChar(lowerCaseChars);
  password += _getRandomChar(numberChars);
  password += _getRandomChar(specialChars);
  
  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
  for (let i = password.length; i < length; i++) {
    password += _getRandomChar(allChars);
  }
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

function improvePasswordCoreLogic(userPassword) {
  if (!userPassword) return generatePasswordCoreLogic();
  
  let improved = userPassword;
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*";

  if (improved.length < 12) {
    const charsToAdd = 12 - improved.length;
    for (let i = 0; i < charsToAdd; i++) {
      improved += _getRandomChar(lowerCaseChars + numberChars);
    }
  }
  
  if (!/[A-Z]/.test(improved)) improved += _getRandomChar(upperCaseChars);
  if (!/[a-z]/.test(improved)) improved += _getRandomChar(lowerCaseChars);
  if (!/[0-9]/.test(improved)) improved += _getRandomChar(numberChars);
  if (!/[^A-Za-z0-9]/.test(improved)) improved += _getRandomChar(specialChars);
  
  improved = improved.replace(/(.)\1{2,}/g, (match) => {
    return match.charAt(0) + match.charAt(1) + _getRandomChar(upperCaseChars + lowerCaseChars + numberChars + specialChars);
  });
  
  if (improved.length > 24 && userPassword.length <= 20) { 
    improved = improved.substring(0, 24);
  }
  if (improved === userPassword && userPassword.length < 20) { // If no improvement and not too long, add a special char
      improved += _getRandomChar(specialChars);
  }
  return improved;
}

function calculatePasswordStrength(password) {
  if (!password) return 0;
  let strength = 0;
  const len = password.length;

  if (len >= 16) strength += 40;
  else if (len >= 12) strength += 30;
  else if (len >= 8) strength += 20;
  else if (len >= 6) strength += 10;

  let criteriaMet = 0;
  if (/[A-Z]/.test(password)) { strength += 15; criteriaMet++; }
  if (/[a-z]/.test(password)) { strength += 10; criteriaMet++; }
  if (/[0-9]/.test(password)) { strength += 15; criteriaMet++; }
  if (/[^A-Za-z0-9]/.test(password)) { strength += 20; criteriaMet++; }
  
  if (criteriaMet === 4 && len >= 12) strength +=5; // Small bonus for diversity and length

  if (/(.)\1{2,}/.test(password)) strength -= Math.min(strength * 0.1, 10);
  if (/123|abc|password|qwerty|asdf/i.test(password)) strength -= Math.min(strength * 0.2, 20);

  return Math.max(0, Math.min(100, Math.round(strength)));
}

function updateCircularStrengthIndicator(passwordOrStrength, visualizerContainer) {
  if (!visualizerContainer) return;
  const strength = typeof passwordOrStrength === 'string' ? calculatePasswordStrength(passwordOrStrength) : passwordOrStrength;
  
  const circle = visualizerContainer.querySelector('.circle');
  const percentageText = visualizerContainer.querySelector('.strength-percentage-text');

  if (!circle || !percentageText) return;

  circle.style.strokeDasharray = `${strength}, 100`;
  percentageText.textContent = `${strength}%`;
  
  if (strength < 40) {
    circle.style.stroke = '#ff5252'; 
    percentageText.style.fill = '#ff5252';
  } else if (strength < 70) {
    circle.style.stroke = '#ffeb3b';
    percentageText.style.fill = '#ffeb3b';
  } else {
    circle.style.stroke = '#4caf50';
    percentageText.style.fill = '#4caf50';
  }
}

// --- Password Tools Modal Logic (Simplified Interface) ---
const passwordToolsBtn = document.querySelector('.passwordToolsBtn'); // Main button to open modal

passwordToolsBtn.addEventListener('click', () => {
  passwordToolsModal.style.display = 'flex';
  passwordManagerInput.value = '';
  updateCircularStrengthIndicator(0, strengthVisualizer);
  passwordManagerBtnText.textContent = 'Generate New Password';
  passwordManagerBtnIcon.className = 'fas fa-bolt'; // Reset icon
  originalPasswordDisplay.innerHTML = ''; // Clear original password display
});

closeModalBtnPasswordTools.addEventListener('click', () => {
  passwordToolsModal.style.display = 'none';
});

passwordToolsModal.addEventListener('click', (e) => {
    if (e.target === passwordToolsModal) {
        passwordToolsModal.style.display = 'none';
    }
});

passwordManagerInput.addEventListener('input', () => {
  const password = passwordManagerInput.value;
  updateCircularStrengthIndicator(password, strengthVisualizer);
  originalPasswordDisplay.innerHTML = ''; // Clear original display when user types

  if (password.trim() === '') {
    passwordManagerBtnText.textContent = 'Generate New Password';
    passwordManagerBtnIcon.className = 'fas fa-bolt';
    passwordManagerBtnIcon.style.transform = 'rotate(0deg)';
  } else {
    passwordManagerBtnText.textContent = 'Improve This Password';
    passwordManagerBtnIcon.className = 'fas fa-wand-magic-sparkles';
    passwordManagerBtnIcon.style.transform = 'rotate(0deg)';
  }
});

passwordManagerBtn.addEventListener('click', () => {
  const currentPassword = passwordManagerInput.value;
  let newPassword = '';

  passwordManagerBtnIcon.style.transform = 'rotate(360deg)'; // Spin icon on click
    setTimeout(() => { // Reset icon rotation
        passwordManagerBtnIcon.style.transform = 'rotate(0deg)';
    }, 500);

  if (currentPassword.trim() === '') { // Generate new password
    newPassword = generatePasswordCoreLogic();
    passwordManagerInput.value = newPassword;
    updateCircularStrengthIndicator(newPassword, strengthVisualizer);
    passwordManagerBtnText.textContent = 'Improve This Password'; // Update button state
    passwordManagerBtnIcon.className = 'fas fa-wand-magic-sparkles';
    originalPasswordDisplay.innerHTML = ''; // No original to show
  } else { // Improve existing password
    newPassword = improvePasswordCoreLogic(currentPassword);
    passwordManagerInput.value = newPassword;
    updateCircularStrengthIndicator(newPassword, strengthVisualizer);
    // Button text remains "Improve This Password"
    if (newPassword !== currentPassword) {
        originalPasswordDisplay.innerHTML = `Original: <strong>${currentPassword}</strong>`;
    } else {
        originalPasswordDisplay.innerHTML = 'Password is already strong or could not be improved further.';
    }
  }
});

copyPasswordManagerBtn.addEventListener('click', () => {
  const passwordToCopy = passwordManagerInput.value;
  if (!passwordToCopy) return;
  
  navigator.clipboard.writeText(passwordToCopy).then(() => {
    const originalIcon = copyPasswordManagerBtn.innerHTML;
    copyPasswordManagerBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyPasswordManagerBtn.innerHTML = originalIcon;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    // Fallback for older browsers
    try {
        passwordManagerInput.select();
        document.execCommand('copy');
        const originalIcon = copyPasswordManagerBtn.innerHTML;
        copyPasswordManagerBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyPasswordManagerBtn.innerHTML = originalIcon;
        }, 2000);
    } catch (e) {
        console.error('Fallback copy failed: ', e);
        alert('Failed to copy password.');
    }
  });
});


// --- Original Main Page Script Logic (Untouched unless related to modal structure) ---

// Toggle Popup for "Add New Service"
imgpopup.onclick = () => mainpopup.style.display = "flex";
closepopup.onclick = () => mainpopup.style.display = "none";
window.addEventListener('click', (e) => {
  if (e.target === mainpopup) {
    mainpopup.style.display = "none";
  }
});


// Theme Toggle
let themeValue = 0; 
if (html.getAttribute('data-theme') === 'light') {
    themeValue = 1; 
}
function theme() {
  themeValue++;
  const themeToggleIcon = document.querySelector('.themeToggle i');
  
  if (themeValue % 2 === 0) {
    html.setAttribute('data-theme', 'dark');
    if(themeToggleIcon) themeToggleIcon.classList.replace('fa-sun', 'fa-moon');
  } else {
    html.setAttribute('data-theme', 'light');
    if(themeToggleIcon) themeToggleIcon.classList.replace('fa-moon', 'fa-sun');
  }
}
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleIcon = document.querySelector('.themeToggle i');
    if (!themeToggleIcon) return;
    if (html.getAttribute('data-theme') === 'light') {
        themeToggleIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeToggleIcon.classList.replace('fa-sun', 'fa-moon');
    }
});


// Sidebar Toggle
function sidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('visible');
  
  const nonSidebar = document.querySelector('.nonSidebar');
  if (window.innerWidth > 992) { 
    nonSidebar.style.marginLeft = sidebar.classList.contains('visible') ? '280px' : '0';
  } else {
    nonSidebar.style.marginLeft = '0'; 
  }
}

// Add New Icon
async function addIcons() {
  const sitesInput = document.querySelector('#main_popupbox .popupInput'); 
  const sites = sitesInput.value.trim();
  if (!sites) return;
  
  const logoUrl = `https://logo.clearbit.com/${sites.toLowerCase().replace(/\s+/g, '')}.com`;

  try {
    const quickAccessGrid = document.querySelector('.quickAccessGrid');
    const newItem = document.createElement('div');
    newItem.className = 'quickAccessItem';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'quickAccessIcon';
    iconDiv.style.background = getRandomColor();
    
    const imgElement = document.createElement('img');
    imgElement.src = logoUrl;
    imgElement.alt = sites;
    imgElement.style.width = '60%';
    imgElement.style.height = '60%';
    imgElement.style.objectFit = 'contain';
    imgElement.onerror = () => { 
        iconDiv.innerHTML = `<span style="font-size: 1.5em; font-weight: bold;">${sites.charAt(0).toUpperCase()}</span>`;
        imgElement.remove(); 
    };
    iconDiv.appendChild(imgElement);
    newItem.appendChild(iconDiv);
    
    const nameP = document.createElement('p');
    nameP.className = 'quickAccessName';
    nameP.textContent = sites;
    newItem.appendChild(nameP);
    
    quickAccessGrid.insertBefore(newItem, quickAccessGrid.lastElementChild); 
    mainpopup.style.display = "none";
    if(sitesInput) sitesInput.value = ''; 
    
  } catch (error) {
    console.error("Error adding icon:", error);
    // Fallback logic from previous version
    const quickAccessGrid = document.querySelector('.quickAccessGrid');
    const newItem = document.createElement('div');
    newItem.className = 'quickAccessItem';
    newItem.innerHTML = `
      <div class="quickAccessIcon" style="background: ${getRandomColor()}">
        <span style="font-size: 1.5em; font-weight: bold;">${sites.charAt(0).toUpperCase()}</span>
      </div>
      <p class="quickAccessName">${sites}</p>
    `;
    quickAccessGrid.insertBefore(newItem, quickAccessGrid.lastElementChild);
    mainpopup.style.display = "none";
    if(sitesInput) sitesInput.value = '';
    alert("Couldn't fetch logo. Displaying generic icon.");
  }
}

function getRandomColor() {
  const colors = ['#7c4dff', '#ff4081', '#00bcd4', '#ff9800', '#4caf50', '#e91e63', '#3f51b5'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function clearinput() { 
  const sitesInput = document.querySelector('#main_popupbox .popupInput');
  if(sitesInput) sitesInput.value = '';
}

async function background_remove(blob) { /* Kept as is */
  const api_key = '75998077dcd2b634f276aa9451e2e5ecf3a208b6ff9f9fe9c98b8cf2df9f21e6ba9ae02e09e0512203375a9fd87b32e8';
  const url = 'https://clipdrop-api.co/remove-background/v1';
  const formData = new FormData();
  formData.append('image_file', blob, 'image.png');
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'x-api-key': api_key }, body: formData });
    if (!response.ok) { const error = await response.text(); throw new Error(`API error: ${error}`); }
    return await response.blob();
  } catch (error) { console.error("Background removal failed:", error); return blob; }
}

// Original sterngthCheck and generate functions (kept untouched at the end)
function sterngthCheck(){ /* ... */ }
function generate(){ /* ... */ }
// Make sure the old sterngthCheck and generate functions don't conflict with class names
// if their old HTML structure is somehow still present or added by other scripts.
// Current setup for the modal uses IDs, so it should be fine.