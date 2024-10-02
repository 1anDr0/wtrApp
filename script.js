// hämta väder baserat på stad med api + apinyckel från openweathermap.
let myWeather = {
  apiKey: "b8cd41173744464c062d1a7c1216f366",

  getWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&APPID=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);

        // Hämta latitud och longitud
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        this.getWeatherForecast(lat, lon);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert("Error: Could not fetch weather data. Please try again.");
      });
  },

  // hämta väder baserat på plats från openweathermap.
  getWeatherByLocation: function (lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Location not found");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.getWeatherForecast(lat, lon);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert("Error: Could not fetch weather data for your location.");
      });
  },

  // hämta framtidsprognos från open.meteo med lon + lat.
  getWeatherForecast: function (lat, lon) {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Location not found");
        }
        return response.json();
      })
      .then((data) => {
        this.displayForecast(data);
      })
      .catch((error) => {
        console.error("Error fetching weather forecast:", error);
        alert("Error: Could not fetch weather forecast.");
      });
  },

  // visa väder på framsida/huvudsida.
  displayWeather: function (data) {
    const { name } = data;
    const { country } = data.sys;
    const { icon, description } = data.weather[0];
    const { temp, feels_like, humidity } = data.main;
    const { speed } = data.wind;

    const roundedTemp = Math.round(temp);
    const roundedFeelsLike = Math.round(feels_like);
    const roundedSpeed = Math.round(speed);

    document.querySelector(".city").innerText = name;
    document.querySelector(".country").innerText = country;
    document.querySelector(".temp").innerText = `${roundedTemp}°C`;
    document.querySelector(
      ".feels_like"
    ).innerText = `Feels like: ${roundedFeelsLike}°C`;
    document.querySelector(".front-description").innerText = description;
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + " %";
    document.querySelector(
      ".wind"
    ).innerText = `Wind Speed: ${roundedSpeed} km/h`;

    const weatherIcon = document.querySelector(".weather-icon");
    weatherIcon.className = `weather-icon bi ${this.getWeatherIcon(
      data.weather[0].id
    )}`;
  },

  displayForecast: function (data) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    //datum för morgondagen
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Lägg till en dag för att få morgondagen

    // Hämta veckodagen för morgondagen
    let startDayIndex = tomorrow.getDay();

    // Loopa de 7 dagarna för att visa väderprognosen
    data.daily.time.forEach((day, index) => {
      const forecastDate = new Date(tomorrow);
      forecastDate.setDate(tomorrow.getDate() + index);

      // Beräkna rätt veckodag med start från morgondagen
      const dayOfWeek = daysOfWeek[(startDayIndex + index) % 7];
      const formattedDate = forecastDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
      });

      const forecastDay = document.getElementById(`day${index + 1}`);
      if (forecastDay) {
        forecastDay.querySelector(".day-name").innerText = dayOfWeek;
        forecastDay.querySelector(".day-date").innerText = formattedDate;
        forecastDay.querySelector(
          ".temperature"
        ).innerText = `Max: ${data.daily.temperature_2m_max[index]}°C, Min: ${data.daily.temperature_2m_min[index]}°C`;
        forecastDay.querySelector(".description").innerText =
          this.getWeatherDescription(data.daily.weathercode[index]);

        const iconElement = forecastDay.querySelector(".icon");
        if (iconElement) {
          iconElement.className = `icon bi ${this.getWeatherIcon(
            data.daily.weathercode[index]
          )}`;
        }
      }
    });
  },

  getWeatherDescription: function (code) {
    const _descriptions = config.descriptions;
    return _descriptions[code] || "Unknown weather";
  },

  getWeatherIcon: function (code) {
    const _icons = config.icons;
    return _icons[code] || "bi-question-circle";
  },

  search: function () {
    const city = document.querySelector(".enter-city").value;
    if (city) {
      this.getWeather(city);
    } else {
      alert("Please enter a city name.");
    }
  },

  getLocationWeather: function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.getWeatherByLocation(lat, lon);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          alert(
            "Could not get your location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  },
};

document.querySelector(".press-button").addEventListener("click", function () {
  myWeather.search();
});

document
  .querySelector(".enter-city")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      myWeather.search();
    }
  });

myWeather.getLocationWeather();

console.log(myWeather);
