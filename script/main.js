import { getCommunesParCodeOuNom } from './postalLookup.js';
import { initMap, centerMap, loadData, displayMarkers } from './mapManager.js';

let communesCache = [];

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadData();

  // Champ de recherche (input)
  const searchInput = document.getElementById('searchInput');
  const resultsBox = document.getElementById('autocompleteResults');

  searchInput.addEventListener('input', async (e) => {
    const saisie = e.target.value.trim();

    if (saisie.length < 2) {
      resultsBox.style.display = 'none';
      return;
    }

    const communes = await getCommunesParCodeOuNom(saisie);
    communesCache = communes;
    resultsBox.innerHTML = '';

    if (!communes.length) {
      resultsBox.style.display = 'none';
      return;
    }

    communes.forEach((commune, index) => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.textContent = `${commune.codePostal} – ${commune.nom}`;
      div.dataset.index = index;
      resultsBox.appendChild(div);
    });

    resultsBox.style.display = 'block';
  });

  // Clic sur une suggestion
  resultsBox.addEventListener('click', (e) => {
    if (!e.target.dataset.index) return;

    const commune = communesCache[parseInt(e.target.dataset.index)];
    searchInput.value = `${commune.codePostal} – ${commune.nom}`;
    resultsBox.style.display = 'none';
    centerMap(commune.lat, commune.lng);
    loadData(commune.codePostal);
  });

  // Clique sur bouton recherche (fallback ou validateur)
  document.getElementById('btnRecherche').addEventListener('click', async () => {
    const input = searchInput.value.trim();
    if (!input) return;

    const communes = await getCommunesParCodeOuNom(input);
    if (communes.length === 1) {
      const { lat, lng, codePostal } = communes[0];
      centerMap(lat, lng);
      loadData(codePostal);
    } else {
      resultsBox.innerHTML = '';
      communes.forEach((commune, index) => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.textContent = `${commune.codePostal} – ${commune.nom}`;
        div.dataset.index = index;
        resultsBox.appendChild(div);
      });
      resultsBox.style.display = 'block';
    }
  });

  // Filtres santé
  document.querySelectorAll('#filters input').forEach(input => {
    input.addEventListener('change', () => {
      const lastCP = communesCache?.[0]?.codePostal;
      if (lastCP) {
        fetch('data/etabs_test.json')
          .then(res => res.json())
          .then(data => {
            const filtres = data.filter(e => e.codePostal === lastCP);
            displayMarkers(filtres);
          });
      }
    });
  });
});
