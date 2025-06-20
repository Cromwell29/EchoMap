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
  const response = await fetch('data/etabs_test.json');
  const data = await response.json();
  displayMarkers(data);
}

export function displayMarkers(data) {
  clearMarkers();

  const activeFilters = Array.from(document.querySelectorAll('#filters input:checked'))
    .map(input => input.value);

  data.forEach(etab => {
    if (!activeFilters.includes(etab.type)) return;

    const marker = L.marker([etab.lat, etab.lng]).addTo(map)
      .bindPopup(`<strong>${etab.nom}</strong><br>${etab.adresse}<br><em>${etab.type}</em>`);

    allMarkers.push(marker);
  });
}

function clearMarkers() {
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];
}
