// postalLookup.js
export async function getCommunesParCodeOuNom(input) {
  const isCodePostal = /^\d{5}$/.test(input);
  const url = isCodePostal
    ? `https://geo.api.gouv.fr/communes?codePostal=${input}&fields=nom,centre,code&format=json`
    : `https://geo.api.gouv.fr/communes?nom=${input}&fields=nom,centre,code,codesPostaux&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.length) return [];

    // Standardisation du retour
    return data.map(commune => {
      const [lng, lat] = commune.centre.coordinates;
      return {
        nom: commune.nom,
        lat,
        lng,
        codePostal: isCodePostal ? input : commune.codesPostaux?.[0] || ''
      };
    });
  } catch (err) {
    console.error("Erreur API code/nom :", err);
    return [];
  }
}
