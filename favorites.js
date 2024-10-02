document.addEventListener("DOMContentLoaded", function () {
  const favoritesList = document.getElementById("favorites-list");
  const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function updateFavoritesList() {
      favoritesList.innerHTML = "";  
      savedFavorites.forEach((favorite, index) => {
          const listItem = document.createElement("li");
          
          const linkItem = document.createElement("a");
          linkItem.href = "#"; 
          linkItem.innerText = favorite; 

         
          linkItem.addEventListener("click", () => {
              const city = favorite.split(", ")[0]; 
              myWeather.getWeather(city);  
          });

          
          const removeButton = document.createElement("button");
          removeButton.innerText = "x"; 
          removeButton.className = "remove-favorite";  
          
          removeButton.addEventListener("click", () => {
              savedFavorites.splice(index, 1);
              localStorage.setItem("favorites", JSON.stringify(savedFavorites));  
              updateFavoritesList();  
          });

          listItem.appendChild(linkItem);
          listItem.appendChild(removeButton); 
          favoritesList.appendChild(listItem);
      });
  }


  updateFavoritesList();

  const saveButton = document.getElementById("save-favorite");
  saveButton.addEventListener("click", function () {
      const city = document.querySelector(".location .city").innerText;
      const country = document.querySelector(".location .country").innerText;
      const favoriteLocation = `${city}, ${country}`; 

      if (city && country && !savedFavorites.includes(favoriteLocation)) {
          savedFavorites.push(favoriteLocation); 
          localStorage.setItem("favorites", JSON.stringify(savedFavorites));  
          updateFavoritesList(); 
      } else {
          alert("This location is already in your favorites or fields are empty.");
      }
  });
});


function updateFavoritesList() {
  favoritesList.innerHTML = ""; 
  savedFavorites.forEach(favorite => {
      const listItem = document.createElement("li");
      const linkItem = document.createElement("a");
      linkItem.href = "#"; 
      linkItem.innerText = favorite; 

      
      linkItem.addEventListener("click", () => {
          const city = favorite.split(", ")[0]; 
          this.getWeather(city); 
      });

      listItem.appendChild(linkItem);
      favoritesList.appendChild(listItem);
  });
}



