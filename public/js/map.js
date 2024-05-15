
document.addEventListener("DOMContentLoaded", async function () {
  
  // map koordinat
  let map = L.map("map").setView([-8.4095188, 115.188919], 11);
  // menambahkan tilelayer
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  

  function isTokenExpired(token) {
    if (!token) return true;
  
    const { exp } = jwt_decode(token);
    if (Date.now() >= exp * 1000) {
      return true;
    }
    return false;
  }
  
  // get data from api
  const url = "http://127.0.0.1:8000/api"
  async function getHospitals() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in local storage");
      }
      if (isTokenExpired(token)){
        window.location.href = '/login'
      }
      const res = await axios.get(url + "/hospitals", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  try {
    const hospitals = await getHospitals();
    if (hospitals && Array.isArray(hospitals)) {
      hospitals.forEach((hospital) => {
        if (hospital.latitude && hospital.longitude) {
          var myIcon = L.icon({
            iconUrl: "/assets/hospital.png",
            iconSize: [40, 40],
          })
          const mark = L.marker([parseFloat(hospital.latitude), parseFloat(hospital.longitude)], {icon:myIcon}).addTo(map);
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
      });
    } else {
      console.error("Invalid marker data received:", hospitals);
    }
  }catch (error) {
    console.error("Error fetching marker data:", error);
  }


  try {
    const hospitals = await getHospitals();
    console.log(hospitals)
    if (!hospitals) {
      return;
    }
  
    const tableBody = document.querySelector("#hospital-table tbody");
    hospitals.forEach((hospital, index) => {
      const row = document.createElement("tr");
      row.appendChild(createCell(index + 1)); // Row number
      row.appendChild(createCell(hospital.name));
      row.appendChild(createCell(hospital.email));
      row.appendChild(createCell(hospital.phone));
      row.appendChild(createCell(hospital.latitude));
      row.appendChild(createCell(hospital.longitude));
  
      const actionCell = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "edit-button"
      editButton.onclick = () => {
        const editUrl = `/edit-hospital?id=${hospital.id}`; 
        window.location.href = editUrl;
      };

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button"
      deleteButton.onclick = () => deleteHospital(hospital.id);

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);
  
      tableBody.appendChild(row);
    
    });
  } catch (error) {
    console.log(error)
  }

  function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
  }
  
  // Delete button functionality
  function deleteHospital(id) {
    const token = localStorage.getItem("token");
    axios.delete('http://127.0.0.1:8000/api/hospitals/' + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log(response)
      alert("Data Deleted Successfully")
      window.location.href = '/map'
    })
    // Add your delete functionality here
  }

  const buttonAddData = document.getElementById('create-data');

  buttonAddData.addEventListener('click', (e) => {
    window.location.href = '/create'
  })

  /// Call populateTable when the page loads
  // window.onload = populateTable;
  
})
