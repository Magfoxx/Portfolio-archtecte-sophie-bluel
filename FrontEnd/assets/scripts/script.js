// console.log('test');
// Récupération des travaux
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
// console.log(reponse);

// fonction qui permet de récupérer les travaux depuis l'API
function genererWorks(works) {
  // boucle listant les projets
  for (let i = 0; i < works.length; i++) {
    // console.log(i);
    const figure = works[i];
    // console.log(figure);

    // Récupération des éléments du DOM
    const divGallery = document.querySelector('.gallery');
    // Création d'une balise figure pour acceuillir chaques projets
    const worksElement = document.createElement('figure');

    // Création des balises
    const imageElement = document.createElement('img');
    imageElement.src = figure.imageUrl
    const titleElement = document.createElement('figcaption');
    titleElement.innerText = figure.title;

    // Rattacher la balise 'figure' avec la div 'gallery'
    divGallery.appendChild(worksElement);
    // Rattacher l'image et le titre à la balise figure
    worksElement.appendChild(imageElement);
    worksElement.appendChild(titleElement);

  }
}
// Appel de la fonction
genererWorks(works);
