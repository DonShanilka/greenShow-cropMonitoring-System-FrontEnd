const apiKey = '4cc364fbc08bf7bb27e45c9a4e9c742b';
const city = 'Maharagama';

async function getWeather() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await res.json();

        const weatherMain = data.weather[0].main.toLowerCase();
        const windSpeed = data.wind.speed;

        // Update basic weather info
        document.getElementById('current-temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-description').innerText = `${data.weather[0].main}, ${data.weather[0].description}`;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Advanced Weather Details
        document.getElementById('humidity').innerText = `💧 Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').innerText = `🌬️ Wind: ${windSpeed} m/s`;
        document.getElementById('cloudiness').innerText = `☁️ Clouds: ${data.clouds.all}%`;

        // Weather Type Label
        let label = "";
        if (weatherMain.includes("rain")) {
            label = "🌧️ Rainy Day";
        } else if (weatherMain.includes("thunderstorm")) {
            label = "⛈️ Thunderstorm Day";
        } else if (weatherMain.includes("clear")) {
            label = "☀️ Sunny Day";
        } else if (windSpeed > 8) {
            label = "💨 Windy Day";
        } else {
            label = "🌤️ Mild Weather";
        }
        document.getElementById('weather-label').innerText = label;

        // Forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();

        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        const days = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
        days.forEach(day => {
            const date = new Date(day.dt_txt);
            const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = `${Math.round(day.main.temp)}°C`;
            const icon = day.weather[0].icon;
            const condition = day.weather[0].main.toLowerCase();
            const wind = day.wind.speed;

            let dailyLabel = "";
            if (condition.includes("rain")) {
                dailyLabel = "🌧️ Rain";
            } else if (condition.includes("thunderstorm")) {
                dailyLabel = "⛈️ Thunder";
            } else if (condition.includes("clear")) {
                dailyLabel = "☀️ Sunny";
            } else if (wind > 8) {
                dailyLabel = "💨 Windy";
            } else {
                dailyLabel = "🌤️ Mild";
            }

            forecastContainer.innerHTML += `
                <div class="flex flex-col items-center">
                    <p class="text-gray-200 text-xs">${weekday}</p>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Icon" class="w-8 h-8 mb-1">
                    <p class="text-sm font-medium">${temp}</p>
                    <p class="text-xs">${dailyLabel}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error('Weather fetch failed:', error);
        document.getElementById('weather-description').innerText = 'Error loading weather';
    }
}

getWeather();
