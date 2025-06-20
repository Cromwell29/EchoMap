import { getVilleEtCoordonnees } from './postalLookup.js';
import { initMap, centerMap, loadData, displayMarkers } from './mapManager.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadData();

  document.getElementById('btnRecherche').addEventListener('click', async () => {
    const cp = document.getElementById('codePostal').value.trim();
    const result = await getVilleEtCoordonnees(cp);

    if (result) {
      const { ville, lat, lng } = result;
      centerMap(lat, lng);
      console.log(`Centré sur : ${ville}`);
    } else {
      alert("Code postal introuvable.");
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
