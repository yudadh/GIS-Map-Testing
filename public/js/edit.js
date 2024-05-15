
document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('hospitalForm')
    const emailInput = document.getElementById('email')
    const emailError = document.getElementById('emailError');
    const nameInput = document.getElementById('name')
    const phoneInput = document.getElementById('phone')
    

    const urlParams = new URLSearchParams(window.location.search);
    const hospitalId = urlParams.get('id');
    const url = "http://127.0.0.1:8000/api"

    var map = L.map('map').setView([-8.4095188, 115.188919], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
    function isTokenExpired(token) {
        if (!token) return true;
      
        const { exp } = jwt_decode(token);
        if (Date.now() >= exp * 1000) {
          return true;
        }
        return false;
      }
        
    async function getData(){
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                throw new Error("No token found in local storage");
            }
            if (isTokenExpired(token)){
                window.location.href = '/login'
            }
            const res = await axios.get(url + `/hospitals/` + hospitalId, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
    var myicon = L.icon({
      iconUrl: "/assets/hospital.png",
      iconSize: [40, 40]
    })
    
   try {
    const hospital= await getData()
    console.log(hospital)
        if (hospital.latitude && hospital.longitude) {
          const mark = L.marker([parseFloat(hospital.latitude), parseFloat(hospital.longitude)], {icon:myicon}).addTo(map);
          // Create a div element for the custom popup content
          var popupContent = document.createElement("div");
          popupContent.classList.add("custom-popup");

          const markerContent = document.createElement("div");
          markerContent.innerHTML = `
            <h2>Marker Details</h2>
            <p>Name: ${hospital.name}</p>
            <p>Email: ${hospital.email}</p>
            <p>Phone: ${hospital.phone}</p>
            <p>Latitude: ${hospital.latitude}</p>
            <p>Longitude: ${hospital.longitude}</p>
            <p>Regency: ${hospital.regency || 'N/A'}</p>
          `;

          popupContent.appendChild(markerContent);
          mark.bindPopup(popupContent);
          mark.on("click", function () {
            mark.openPopup();
          });
        } else {
          console.error("Invalid marker coordinates:", hospital);
        }
      nameInput.value = hospital.name
      emailInput.value = hospital.email
      phoneInput.value = hospital.phone
      document.getElementById('latitude').value = hospital.latitude
      document.getElementById('longitude').value = hospital.longitude
  }catch (error) {
    console.error("Error fetching marker data:", error);
  }

  
  var marker = L.marker([0, 0], {icon: myicon}).addTo(map);
  var popupContent = "<b>This is New Location marker</b>"
  
  map.on('click', function(e) {
    marker.setLatLng(e.latlng);
    marker.bindPopup(popupContent)
    marker.openPopup()
    document.getElementById('latitude').value = e.latlng.lat.toFixed(6);
    document.getElementById('longitude').value = e.latlng.lng.toFixed(6);
  });

  document.getElementById('updateHospitalForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const hospitalData = {};
    formData.forEach((value, key) => {
        hospitalData[key] = value;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const hospitalId = urlParams.get('id');

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found in local storage");
        }
        if (isTokenExpired(token)){
          throw new Error("Token is Expired")
        }

        const response = await axios.put(url + '/hospitals/'+ hospitalId, hospitalData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        console.log('Hospital updated successfully:', response.data);
        // Redirect or show success message
        alert("Data Updated Successfully")
        window.location.href = '/map'
    } catch (error) {
        console.error("Error updating hospital:", error);
        // Handle errors
    }
});




})