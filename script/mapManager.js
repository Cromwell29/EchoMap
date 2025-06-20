let map;
let allMarkers = [];

export function initMap() {
  map = L.map('map').setView([43.6047, 1.4442], 13); // Toulouse
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

export function centerMap(lat, lng) {
  map.setView([lat, lng], 13);
}

export async function loadData() {
  const response = await fetch('data/etabs.json');
  const data = await response.json();
  displayMarkers(data);
}


export function displayMarkers(data) {
  clearMarkers();

  const activeFilters = Array.from(document.querySelectorAll('#filters input:checked'))
    .map(input => input.value);

  data.forEach(etab => {
    if (!activeFilters.includes(etab.type)) return;

    const lat = etab.geoloc_4326_lat;
    const lng = etab.geoloc_4326_long;

    if (!lat || !lng) return;

    const nom = etab.et_rs || "Établissement inconnu";
    const adresse = etab.adresse || "Adresse non renseignée";
    const type = etab.type || "Type inconnu";

    const marker = L.marker([lat, lng]).addTo(map)
      .bindPopup(`<strong>${nom}</strong><br>${adresse}<br><em>${type}</em>`);

    allMarkers.push(marker);
  });
}


function clearMarkers() {
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];
}
