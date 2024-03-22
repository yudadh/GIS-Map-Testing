document.addEventListener("DOMContentLoaded", function () {
  // popup box html
  //   const popupBox = (lat, long, index) => {
  //     return ` <div class="text-slate-900 dark:text-white">
  //               <table>
  //                 <tr>
  //                   <td>Latitude</td><td>:</td><td>${lat}</td>
  //                 </tr>
  //                 <tr>
  //                   <td>Latitude</td><td>:</td><td>${long}</td>
  //                 </tr>
  //                 <tr>
  //                   <td>MarkerNum</td><td>:</td><td>${index + 1}</td>
  //                 </tr>

  //               </table>
  //               </div>
  //               `;
  //   };
  // map koordinat
  let map = L.map("map").setView([-8.4095188, 115.188919], 11);
  // menambahkan tilelayer
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const myIcon = L.icon({
    iconUrl: "/assets/location-pin.png",
    iconSize: [40, 40],
  });
  // marker
  // let marker = L.marker([-8.4095188, 115.188919], {
  //   icon: myIcon,
  // }).addTo(map);
  // circle
  let circle = L.circle([-8.654956, 115.205618], {
    color: "red",
    fillcolor: "#00000",
    fillopacity: 0.5,
    radius: 1000,
  }).addTo(map);
  let markers = [];
  let markerClusters = L.markerClusterGroup().addTo(map);
  addMarker = function (latlng, index) {
    // menambahkan marker
    let myMarker = L.marker(latlng, {
      icon: myIcon,
      draggable: true,
    }).addTo(map);

    let thisPopup = L.popup();
    myMarker.bindPopup(thisPopup);

    myMarker.on("click", function () {
      thisPopup.setLatLng(myMarker.getLatLng());
      thisPopup.setContent(`
      <table>
        <tr>
          <td>Latitude</td><td>:</td><td>${myMarker.getLatLng().lat}</td>
        </tr>
        <tr>
          <td>Latitude</td><td>:</td><td>${myMarker.getLatLng().lng}</td>
        </tr>
        <tr>
          <td>MarkerNum</td><td>:</td><td>${index + 1}</td>
        </tr>
      </table>
      `);
      //   thisPopup.setContent(
      //     popupBox(myMarker.getLatLng().lat, myMarker.getLatLng().lng, index)
      //   );
      thisPopup.addTo(map);
    });
    // delete marker
    myMarker.on("contextmenu", function (e) {
      markers.forEach((marker, index) => {
        if (myMarker == marker) {
          myMarker.removeFrom(map);
          markers.splice(index, 1);
        }
      });
    });
    // console.log(markers);
    return myMarker;
  };
  // add marker
  map.on("click", function (e) {
    // console.log(e);
    let newMarker = addMarker(e.latlng, markers.length);
    markers.push(newMarker);
    markerClusters.addLayer(L.layerGroup(markers));
  });
  var btnKirim = document.getElementById("btnKirim");
  btnKirim.addEventListener("click", function () {
    // Ambil koordinat masing-masing marker dan simpan ke dalam array koordinat
    var koordinat = markers.map(function (marker) {
      return [marker.getLatLng().lat, marker.getLatLng().lng];
    });
    // console.log(JSON.stringify(koordinat));
    // Kirim data ke server dalam format JSON menggunakan method fetch()
    fetch("/simpan", {
      method: "POST",
      body: JSON.stringify(koordinat),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response;
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  fetch("/baca")
    .then(function (response) {
      // return response.text();
      return response.json();
    })
    .then(function (data) {
      var latlangs = [];
      data.forEach(function (c, i) {
        let latlng = L.latLng(c[0], c[1]);
        latlangs.push(latlng);
        var newMarker = addMarker(latlng, markers.length);
        markers.push(newMarker);
      });

      // Tambahkan ke markercluster
      markerClusters.addLayer(L.layerGroup(markers));
    })
    .catch(function (error) {
      console.log(error);
    });

  const btnHapus = document.getElementById("btnHapus");
  btnHapus.addEventListener("click", function () {
    fetch("/hapus", {
      method: "DELETE",
    })
      .then(function (res) {
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
