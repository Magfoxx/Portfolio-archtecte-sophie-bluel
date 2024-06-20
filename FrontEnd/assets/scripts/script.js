
// console.log('test');
async function fetchData() {
  // Récupération des travaux depuis l'API
  const reponseWorks = await fetch("http://localhost:5678/api/works");// reponse remplacé par reponseWorks
  const listWorks = await reponseWorks.json();// works remlpacé par listWorks
  // console.log(reponseWorks);
  // Récupération des catégories depuis l'API
  const reponseCategory = await fetch("http://localhost:5678/api/categories");
  const listCategory = await reponseCategory.json();// category remplacé par listCategory
  // console.log(reponseCategory);

  genererWorks(listWorks);
  genererFilter(listCategory, listWorks)
  addListenerFilter(listWorks);
}

// fonction qui permet de récupérer les travaux depuis l'API
function genererWorks(listWorks) {
  // Récupération des éléments du DOM
  const divGallery = document.querySelector('.gallery');
  if (!divGallery) {
    console.error("L'élément .gallery n'existe pas sur cette page.");
    return;
  }
  //Effacement de l'écran et regénération de la page  
  divGallery.innerHTML = "";
  // Boucle qui va permettre de lister les projets
  for (let i = 0; i < listWorks.length; i++) {
    const figure = listWorks[i];
    // Création de la balise figure qui acceuillera chaque projet
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
// ----------- gestion des boutons filtres -----------  

function genererFilter(listCategory, listWorks) {

  //   // Récupération de l'élément du DOM
  const divFilterCategory = document.querySelector(".categorie-menu");
  divFilterCategory.innerHTML = "";
  // Création du bouton 'Tous' 
  const buttonFilterAll = document.createElement('button');
  buttonFilterAll.setAttribute('class', 'btn-tous');
  buttonFilterAll.textContent = "Tous";
  divFilterCategory.appendChild(buttonFilterAll);

  // Boucle pour afficher le nom de chaques catégorie de l'API
  for (let i = 0; i < listCategory.length; i++) {
    // console.log(listCategory.length);
    const buttonFilter = document.createElement('button');
    // Récupération de l'id du bouton pour l'event Listener
    buttonFilter.dataset.id = listCategory[i].id;
    // console.log(buttonFilter.dataset.id) // Cela m'affiche bien mes 3 id
    buttonFilter.setAttribute('class', 'btn-filter');
    buttonFilter.innerText = listCategory[i].name
    divFilterCategory.appendChild(buttonFilter);
  }

  // ----------- Ajout de l'event listener sur les boutons -----------  

  // Pour le bouton 'Tous'
  buttonFilterAll.addEventListener('click', () => {
    genererWorks(listWorks);
  })
}
// fonction pour les autres boutons
function addListenerFilter(listWorks) {
  const listButton = document.querySelectorAll('.btn-filter');
  for (let i = 0; i < listButton.length; i++) {
    const currentButton = listButton[i];
    currentButton.addEventListener('click', (event) => {
      const categoryId = parseInt(event.target.dataset.id);
      const listWorksFilter = listWorks.filter(work => work.categoryId === categoryId);
      genererWorks(listWorksFilter);
    });
  }
}
// appel de la fonction fetchData() pour initialiser les travaux et les filtres
fetchData();
