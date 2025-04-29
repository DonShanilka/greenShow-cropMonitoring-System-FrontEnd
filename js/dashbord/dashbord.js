const apiKey = '4cc364fbc08bf7bb27e45c9a4e9c742b';
const city = 'Maharagama';

async function getWeather() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await res.json();

        document.getElementById('current-temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-description').innerText = `${data.weather[0].main}, ${data.weather[0].description}`;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // NEW: Advanced Weather Details
        document.getElementById('humidity').innerText = `💧 Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').innerText = `🌬️ Wind: ${data.wind.speed} m/s`;
        document.getElementById('cloudiness').innerText = `☁️ Clouds: ${data.clouds.all}%`;

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();

        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        const days = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 4);
        days.forEach(day => {
            const date = new Date(day.dt_txt);
            const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = `${Math.round(day.main.temp)}°C`;

            forecastContainer.innerHTML += `
                <div>
                    <p class="text-gray-500 text-xs">${weekday}</p>
                    <p class="text-sm font-medium">${temp}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error('Weather fetch failed:', error);
        document.getElementById('weather-description').innerText = 'Error loading weather';
    }
}

getWeather();
