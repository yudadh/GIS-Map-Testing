const form = document.getElementById('hospitalForm')
const emailInput = document.getElementById('email')
const emailError = document.getElementById('emailError');

var map = L.map('map').setView([-8.4095188, 115.188919], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

var myicon = L.icon({
    iconUrl: "/assets/hospital.png",
    iconSize: [40, 40],
}) 

var marker = L.marker([0, 0], {icon: myicon}).addTo(map);
const url = "http://127.0.0.1:8000/api"

map.on('click', function(e) {
    marker.setLatLng(e.latlng);
    document.getElementById('longitude').value = e.latlng.lng.toFixed(6);
    document.getElementById('latitude').value = e.latlng.lat.toFixed(6);
});


document.getElementById('hospitalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    emailError.textContent = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Invalid email address.';
        return;
    }
    const jsonObject = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => {
        jsonObject[key] = value;
    });
    console.log(jsonObject)
    function isTokenExpired(token) {
        if (!token) return true;
      
        const { exp } = jwt_decode(token);
        if (Date.now() >= exp * 1000) {
          return true;
        }
        return false;
    }
    const token = localStorage.getItem("token")
    console.log(token)
    
    if (!token){
        throw new Error("No token found in local storage");
    }
    if (isTokenExpired(token)){
        window.location.href = '/login'
    }
    axios.post(url + '/hospitals', jsonObject, {
        headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json' // Set content type to JSON
        }
    })
        .then(response => {
            // Optionally, redirect to another page
            alert('Hospital created successfully')
            console.log(response.data);
            window.location.href = '/map';
        })
        .catch(error => {
            console.error('Failed to create Hospital:', error);
        });
});