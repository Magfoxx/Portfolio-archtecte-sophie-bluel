// console.log('test');
// Récupération des travaux
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
// console.log(reponse);

// fonction qui permet de récupérer les travaux depuis l'API
function genererWorks(works) {
  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    // Récupération des éléments du DOM
    const divGallery = document.querySelector('.gallery');
    const worksElement = document.createElement('figure');

    // Création des balises
    const imageElement = document.createElement('img');
    imageElement.src = figure.imageUrl
    const titleElement = document.createElement('figcaption');
    titleElement.innerText = figure.title;
    const categoryIdElement = document.createElement("p");
    categoryIdElement.innerText = figure.categoryId;

    // Rattacher les balises
    divGallery.appendChild(worksElement);
    worksElement.appendChild(imageElement);
    worksElement.appendChild(titleElement);
    worksElement.appendChild(categoryIdElement);
  }
}
// Appel de la fonction
genererWorks(works);

// Récupération de l"élément du DOM 
const divFilterCategory = document.querySelector('.category-menu');
// console.log(divFilterCategory);

// Création du bouton 'Tous'
const btnAll = document.createElement('button');
btnAll.setAttribute("class", "btn");
btnAll.textContent = 'Tous';
// Rattacher le bouton 'Tous'
divFilterCategory.appendChild(btnAll);
// Ajout du listener pour trier 'tous' les travaux
btnAll.addEventListener('click', () => {
  const worksFilter = works.filter(function (works) {
    return works.categoryId;
  })
  // Effacement de l'écran et regénération de la page avec le filtrage effectué
  document.querySelector(".gallery").innerHTML = "";
  genererWorks(worksFilter);
});


// Création du bouton 'Objet'
const btnObject = document.createElement('button');
btnObject.setAttribute("class", "btn");
btnObject.textContent = 'Objets';
// Rattacher le bouton 'Objet'
divFilterCategory.appendChild(btnObject);
// Ajout du listener pour trier les travaux 'Objets'
btnObject.addEventListener('click', () => {
  const worksFilter = works.filter(function (works) {
    return works.categoryId === 1;
  })
  // Effacement de l'écran et regénération de la page avec le filtrage effectué
  document.querySelector(".gallery").innerHTML = "";
  genererWorks(worksFilter);
});

// Création du bouton 'appartement'
const btnApartment = document.createElement('button');
btnApartment.setAttribute("class", "btn");
btnApartment.textContent = 'Appartements';
// Rattacher le bouton "Appartement"
divFilterCategory.appendChild(btnApartment);
// Ajout du listener pour trier les travaux 'Appartement'
btnApartment.addEventListener('click', () => {
  const worksFilter = works.filter(function (works) {
    return works.categoryId === 2;
  })
  // Effacement de l'écran et regénération de la page avec le filtrage effectué
  document.querySelector(".gallery").innerHTML = "";
  genererWorks(worksFilter);
});

// Création du bouton 'Hotel & Restaurants'
const btnHotelsRestaurant = document.createElement('button');
btnHotelsRestaurant.setAttribute("class", "btn");
btnHotelsRestaurant.textContent = 'Hotels & restaurants';
// Rattacher le bouton 'Hotel & Restaurants'
divFilterCategory.appendChild(btnHotelsRestaurant);
// Ajout du listener pour trier les travaux 'Hotel & Restaurants'
btnHotelsRestaurant.addEventListener('click', () => {
  const worksFilter = works.filter(function (works) {
    return works.categoryId === 3;
  })
  // Effacement de l'écran et regénération de la page avec le filtrage effectué
  document.querySelector(".gallery").innerHTML = "";
  genererWorks(worksFilter);
});



