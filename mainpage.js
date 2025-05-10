let themeValue = 0;
function sidebarToggle(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('visible');
}

function theme(){
    let theme = document.querySelector('.theme');
    if (themeValue%2 == 0){
        theme.src = 'images/darkmode.png';
    }
    else{
        theme.src = 'images/lightmode.png';
    }
    themeValue++
}

async function addIcons() {
    const sites = document.querySelector('.input').value.trim(); 
    
    const logoUrl = `https://img.logo.dev/${sites}?token=pk_eL8XSiNLSuiTmeedsY98Kw`;
    try {
        const response = await fetch(logoUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok or invalid site entered');
        }

        const blob = await response.blob();
        
        const transparent_blob = await background_remove(blob);
        const imgUrl =  URL.createObjectURL(transparent_blob);


        
        const iconsDiv = document.querySelector('.iconsDivSecond');
        const newImage = document.createElement('img');
        newImage.src = imgUrl; 
        newImage.className = 'iconImages';
        iconsDiv.appendChild(newImage);
        
        
    } 
    catch (error) {
        console.error("Error fetching the logo:", error.message);
    }
}

async function background_remove(blob) {
    const api_key = '75998077dcd2b634f276aa9451e2e5ecf3a208b6ff9f9fe9c98b8cf2df9f21e6ba9ae02e09e0512203375a9fd87b32e8';
    const url = 'https://clipdrop-api.co/remove-background/v1';
    const formData = new FormData();
    formData.append('image_file', blob, 'image.png');
    try {
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key':   api_key, 
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }
     return await response.blob(); 
    }
    catch (error) {
    console.error("Background removal failed:", error);
    throw error;
  }

}
