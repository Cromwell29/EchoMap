export async function getVilleEtCoordonnees(codePostal) {
  const url = `https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom,centre&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.length === 0) return null;

    const { nom: ville, centre } = data[0];
    const [lng, lat] = centre.coordinates;

    return { ville, lat, lng };
  } catch (err) {
    console.error("Erreur API code postal :", err);
    return null;
  }
}
