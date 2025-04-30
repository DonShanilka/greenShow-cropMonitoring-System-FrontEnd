const apiKey = '79ba89af816650552640ef5fe0b0244c';
const city = 'Maharagama';


// Wether Card Js
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


//  Bar Chart
async function loadCropYieldChart() {
    const jwtToken = localStorage.getItem('jwtToken');
    try {
        const res = await fetch("http://localhost:5050/greenshow/api/v1/crops", {
            headers: { Authorization: `Bearer ${jwtToken}` }
        });
        const json = await res.json();

        console.log("Crop response:", json); // <-- Add this

        const crops = json.data;
        if (!crops || !Array.isArray(crops)) {
            throw new Error("Invalid crop data format");
        }

        // Proceed with processing crops...
        const currentYear = new Date().getFullYear();
        const yieldByYear = {
            [currentYear - 4]: 0,
            [currentYear - 3]: 0,
            [currentYear - 2]: 0,
            [currentYear - 1]: 0,
            [currentYear]: 0
        };

        crops.forEach(crop => {
            const year = new Date(crop.date).getFullYear(); // adjust field name as needed
            if (year in yieldByYear) {
                yieldByYear[year] += crop.yield || 1; // adjust field name
            }
        });

        renderYieldChart(Object.keys(yieldByYear), Object.values(yieldByYear));

    } catch (err) {
        console.error("Failed to load chart data:", err);
    }
}


function renderBarChart(cropCount, fieldCount) {
    const ctx = document.getElementById('yieldChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Crops', 'Fields'],
            datasets: [{
                label: 'Total Count',
                data: [cropCount, fieldCount],
                backgroundColor: ['#60A5FA', '#A78BFA'], // green and blue4ade80
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Pie Chart js
function loadResourceChart() {
    const jwtToken = localStorage.getItem('jwtToken');

    let counts = {
        Equipment: 0,
        Field: 0,
        Staff: 0,
        Vehicle: 0,
        Crop: 0
    };

    function tryRenderChart() {
        const total = counts.Equipment + counts.Field + counts.Staff + counts.Vehicle + counts.Crop;
        if (total === 0) return;

        const percentages = [
            (counts.Equipment / total * 100).toFixed(1),
            (counts.Field / total * 100).toFixed(1),
            (counts.Staff / total * 100).toFixed(1),
            (counts.Vehicle / total * 100).toFixed(1),
            (counts.Crop / total * 100).toFixed(1)
        ];

        const ctx = document.getElementById('resourceChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Equipment', 'Field', 'Staff', 'Vehicle', 'Crop'],
                datasets: [{
                    label: 'Resource %',
                    data: percentages,
                    backgroundColor: [
                        '#A78BFA', // Equipment - purple
                        '#60A5FA', // Field - blue
                        '#FBBF24', // Staff - yellow
                        '#F87171', // Vehicle - red
                        '#4ADE80'  // Crop - green 
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    let loadedCount = 0;
    function checkAllLoaded() {
        loadedCount++;
        if (loadedCount === 5) {
            tryRenderChart();
        }
    }

    // Load each resource
    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/equipment",
        type: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
        success: (res) => {
            counts.Equipment = res.data?.length || 0;
            checkAllLoaded();
        }
    });

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/field",
        type: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
        success: (res) => {
            counts.Field = res.length || res.data?.length || 0;
            checkAllLoaded();
        }
    });

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/staff",
        type: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
        success: (res) => {
            counts.Staff = res.data?.length || res.length || 0;
            checkAllLoaded();
        }
    });

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/vehicle",
        type: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
        success: (res) => {
            counts.Vehicle = res.data?.length || res.length || 0;
            checkAllLoaded();
        }
    });

    // ✅ Load Crop
    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/crops",
        type: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
        success: (res) => {
            counts.Crop = res.data?.length || 0;
            checkAllLoaded();
        }
    });
}

loadResourceChart();


// Progess Bar

function renderProgressBars(percentages) {
    const container = document.getElementById('resourceProgress');
    container.innerHTML = ''; // Clear existing bars

    const labels = ['Equipment', 'Field', 'Staff', 'Vehicle', 'Crop'];
    const colors = {
        Equipment: 'bg-green-400',
        Field: 'bg-blue-400',
        Staff: 'bg-yellow-400',
        Vehicle: 'bg-red-400',
        Crop: 'bg-purple-400'
    };

    labels.forEach((label, i) => {
        const percent = percentages[i];

        const bar = document.createElement('div');
        bar.innerHTML = `
            <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">${label}</span>
                <span class="text-sm font-medium text-gray-700">${percent}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="${colors[label]} h-4 rounded-full" style="width: ${percent}%"></div>
            </div>
        `;
        container.appendChild(bar);
    });
}
