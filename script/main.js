import { getCommunesParCodeOuNom } from './postalLookup.js';
import { initMap, centerMap, loadData, displayMarkers } from './mapManager.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadData();

  document.getElementById('btnRecherche').addEventListener('click', async () => {
    const saisie = document.getElementById('codePostal').value.trim();
    const communes = await getCommunesParCodeOuNom(saisie);

    const select = document.getElementById('communeSelect');
    select.innerHTML = '';

    if (communes.length === 0) {
      alert("Aucune commune trouvée.");
      return;
    }

    communes.forEach((commune, index) => {
      const opt = document.createElement('option');
      opt.value = index;
      opt.textContent = `${commune.codePostal} – ${commune.nom}`;
      select.appendChild(opt);
    });

    // Afficher la liste uniquement si plusieurs
    select.style.display = communes.length > 1 ? 'block' : 'none';

    // Centrage immédiat si 1 seul résultat
    if (communes.length === 1) {
      const { lat, lng } = communes[0];
      centerMap(lat, lng);
    }

    // Stockage temporaire
    window._communesTrouvees = communes;
  });

  document.getElementById('communeSelect').addEventListener('change', e => {
    const selected = window._communesTrouvees?.[e.target.value];
    if (selected) {
      centerMap(selected.lat, selected.lng);
    }
  });

  document.querySelectorAll('#filters input').forEach(input => {
    input.addEventListener('change', () => {
      fetch('data/etabs_test.json')
        .then(res => res.json())
        .then(displayMarkers);
    });
  });
});
