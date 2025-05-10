// DOM Elements
const mainpopup = document.getElementById("main_popupbox");
const imgpopup = document.getElementById("popupimage");
const closepopup = document.getElementById("closepopup");
const html = document.documentElement;

// Toggle Popup
imgpopup.onclick = () => mainpopup.style.display = "flex";
closepopup.onclick = () => mainpopup.style.display = "none";

// Theme Toggle
let themeValue = 0;
function theme() {
  themeValue++;
  const themeToggle = document.querySelector('.themeToggle i');
  
  if (themeValue % 2 === 0) {
    html.setAttribute('data-theme', 'dark');
    themeToggle.classList.replace('fa-sun', 'fa-moon');
  } else {
    html.setAttribute('data-theme', 'light');
    themeToggle.classList.replace('fa-moon', 'fa-sun');
  }
}

// Sidebar Toggle
function sidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('visible');
  
  const nonSidebar = document.querySelector('.nonSidebar');
  if (window.innerWidth > 992) {
    nonSidebar.style.marginLeft = sidebar.classList.contains('visible') ? '280px' : '0';
  }
}

// Add New Icon
async function addIcons() {
  const sites = document.querySelector('.popupInput').value.trim();
  if (!sites) return;
  
  const logoUrl = `https://img.logo.dev/${sites}?token=pk_eL8XSiNLSuiTmeedsY98Kw`;
  
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) throw new Error('Invalid site or network error');
    
    const blob = await response.blob();
    const transparent_blob = await background_remove(blob);
    const imgUrl = URL.createObjectURL(transparent_blob);
    
    const quickAccessGrid = document.querySelector('.quickAccessGrid');
    const newItem = document.createElement('div');
    newItem.className = 'quickAccessItem';
    newItem.innerHTML = `
      <div class="quickAccessIcon" style="background: ${getRandomColor()}">
        <img src="${imgUrl}" alt="${sites}" style="width: 60%; height: 60%; object-fit: contain;">
      </div>
      <p class="quickAccessName">${sites}</p>
    `;
    
    quickAccessGrid.insertBefore(newItem, quickAccessGrid.lastElementChild);
    mainpopup.style.display = "none";
    
    // Add hover effect to new item
    newItem.addEventListener('mouseenter', function() {
      this.querySelector('.quickAccessIcon').style.transform = 'scale(1.05)';
      this.querySelector('.quickAccessIcon').style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    });
    
    newItem.addEventListener('mouseleave', function() {
      this.querySelector('.quickAccessIcon').style.transform = 'scale(1)';
      this.querySelector('.quickAccessIcon').style.boxShadow = 'none';
    });
    
  } catch (error) {
    console.error("Error:", error);
    alert("Couldn't fetch logo. Please try another site name.");
  }
}

// Helper function for random colors
function getRandomColor() {
  const colors = ['#7c4dff', '#ff4081', '#00bcd4', '#ff9800', '#4caf50'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Clear Input
function clearinput() {
  document.getElementById('INPUTT').value = '';
}

// Background Removal API
async function background_remove(blob) {
  const api_key = '75998077dcd2b634f276aa9451e2e5ecf3a208b6ff9f9fe9c98b8cf2df9f21e6ba9ae02e09e0512203375a9fd87b32e8';
  const url = 'https://clipdrop-api.co/remove-background/v1';
  const formData = new FormData();
  formData.append('image_file', blob, 'image.png');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'x-api-key': api_key },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error("Background removal failed:", error);
    return blob; // Return original if removal fails
  }
}

// Close popup when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === mainpopup) {
    mainpopup.style.display = "none";
  }
});

function sterngthCheck(){
alert('hello')
}


function generate(){
  const input = document.getElementsByClassName('.strength-input');
  
}