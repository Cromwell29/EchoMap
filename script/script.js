let map;
let allMarkers = [];

// Initialisation de la carte sur Toulouse
function initMap() {
  map = L.map('map').setView([43.6047, 1.4442], 13); // Toulouse

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  loadData(); // charge les établissements
}

// Charger les données JSON locales
async function loadData() {
  const response = await fetch('data/etabs_test.json');
  const data = await response.json();
  displayMarkers(data);
}

// Afficher les marqueurs selon les filtres cochés
function displayMarkers(data) {
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

// Supprimer les anciens marqueurs
function clearMarkers() {
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];
}

// Centrage carte par code postal (via geo.api.gouv.fr)
async function rechercherCodePostal() {
  const cp = document.getElementById('codePostal').value.trim();
  if (!cp) return;

  const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${cp}&fields=centre`);
  const communes = await response.json();

  if (communes.length > 0) {
    const { coordinates } = communes[0].centre;
    map.setView([coordinates[1], coordinates[0]], 13);
  } else {
    alert("Code postal introuvable.");
  }
}

// Événements
document.getElementById('btnRecherche').addEventListener('click', rechercherCodePostal);
document.querySelectorAll('#filters input').forEach(input => {
  input.addEventListener('change', () => {
    fetch('data/etabs_test.json')
      .then(res => res.json())
      .then(displayMarkers);
  });
});

initMap();
