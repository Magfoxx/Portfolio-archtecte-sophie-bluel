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
    // Ajout de la categoryID
    const categoryIdElement = document.createElement("p");
    categoryIdElement.innerText = figure.categoryId;
    // console.log(categoryIdElement);

    // Rattacher la balise 'figure' avec la div 'gallery'
    divGallery.appendChild(worksElement);
    // Rattacher l'image et le titre à la balise 'figure'
    worksElement.appendChild(imageElement);
    worksElement.appendChild(titleElement);
    // Rattacher la categoryID à la balise 'figure'
    worksElement.appendChild(categoryIdElement);
  }
}
// Appel de la fonction
genererWorks(works);

// ------ PARTIE FILTRES ------ //

// Création des boutons
// Récupération de l"élément du DOM 
const divFilterCategory = document.querySelector('.category-menu');
// console.log(FilterCategory);

// Création des boutons
// Création du bouton 'TOUS'
const btnAll = document.createElement('button');
btnAll.setAttribute("class", "btn-all");
btnAll.textContent = 'Tous';
// Création du bouton 'Objet'
const btnObject = document.createElement('button');
btnObject.setAttribute("class", "btn-objects");
btnObject.textContent = 'Objets';
// Création du bouton 'Appartements'
const btnApartment = document.createElement('button');
btnApartment.setAttribute("class", "btn-Apartment");
btnApartment.textContent = 'Appartements';
// Création du bouton 'Hotel & Restaurants'
const btnHotelsRestaurant = document.createElement('button');
btnHotelsRestaurant.setAttribute("class", "btn-hotels-and-restaurants");
btnHotelsRestaurant.textContent = 'Hotels & restaurants';

// Rattacher les boutons
divFilterCategory.appendChild(btnAll);
divFilterCategory.appendChild(btnObject);
divFilterCategory.appendChild(btnApartment);
divFilterCategory.appendChild(btnHotelsRestaurant);

