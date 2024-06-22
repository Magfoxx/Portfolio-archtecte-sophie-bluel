document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  if (mode === 'edit') {
    activateEditMode();
  } else {
    const currentPath = window.location.pathname;
    if (!currentPath.endsWith('/index.html')) {
      window.location.href = "./index.html";
    }
  }
});

function activateEditMode() {
  // Votre code pour activer le mode édition
}

async function fetchData() {
  // Récupération des travaux depuis l'API
  const reponseWorks = await fetch("http://localhost:5678/api/works");
  const listWorks = await reponseWorks.json();
  // console.log(reponseWorks);
  // Récupération des catégories depuis l'API
  const reponseCategory = await fetch("http://localhost:5678/api/categories");
  const listCategory = await reponseCategory.json();
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

// Fonction qui permet l'activation du mode édition
function activateEditMode() {

  // ====== Création des Eléments du bandeau ====== 

  document.body.classList.add('edit-mode');

  // Ajout du bandeau du mode édition
  const editBanner = document.createElement('div');
  editBanner.classList.add("banner");

  const bannerContent = document.createElement('div');
  bannerContent.classList.add('banner-content');
  // Ajout de l'icon
  const iconBanner = document.createElement('div');
  iconBanner.classList.add("icon");
  iconBanner.innerHTML = '<i class="far fa-pen-to-square"></i>';
  // Ajout du texte
  const editMode = document.createElement('p');
  editMode.textContent = 'Mode édition';
  // Insertion de 'editBanner' comme premier enfant du parent 'body'
  const header = document.querySelector('header');
  header.parentNode.insertBefore(editBanner, header);
  // Rattacher les balises
  editBanner.appendChild(bannerContent);
  bannerContent.appendChild(iconBanner);
  bannerContent.appendChild(editMode);

  // Création de l'élément "modifier" à coté de Projets
  const projectContainer = document.createElement('div');
  projectContainer.classList.add('project-container');

  const myProject = document.querySelector('#portfolio h2');

  // Déplace le h2 dans le nouveau conteneur
  myProject.parentNode.insertBefore(projectContainer, myProject);
  projectContainer.appendChild(myProject);

  // Contient l'icône et le texte
  const editContainer = document.createElement('div');
  editContainer.classList.add('edit-container');

  const iconProject = document.createElement('span');
  iconProject.classList.add('icon');
  iconProject.innerHTML = '<i class="far fa-pen-to-square"></i>';

  const edit = document.createElement('span');
  edit.textContent = 'modifier';

  // Rattacher les balises
  editContainer.appendChild(iconProject);
  editContainer.appendChild(edit);
  projectContainer.appendChild(editContainer);

}
// Appel de la fonction fetchData() pour initialiser les travaux et les filtres
fetchData();
