
token = localStorage.getItem("authToken");
if (token) {
  //si le token est présent alors appel de la fonction qui modifie l'interface admin
  editMode();
  console.log('Mode edition'); // Pour verifier si je suis sur le mode 'édition'
} else {
  // Sinon l'interface classique s'affiche
  classicMode()
  console.log('Mode Classique'); // Pour verifier si je suis sur le mode 'classique'
}
fetchData();


// Fonction de récupération des données depuis l'API
async function fetchData() {
  try { // Récupération des travaux
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    if (!reponseWorks.ok) {
      throw new Error('Erreur lors de la récupération des travaux.');
    }
    const listWorks = await reponseWorks.json();

    //Récupération des catégories
    const reponseCategory = await fetch("http://localhost:5678/api/categories");
    if (!reponseCategory.ok) {
      throw new Error('Erreur lors de la récupération des catégories.');
    }
    const listCategory = await reponseCategory.json();

    //Génération des travaux et des filtres
    genererWorks(listWorks);
    genererFilter(listCategory, listWorks);
    addListenerFilter(listWorks);
  } catch (error) {
    alert(error.message);
    console.error("Erreur lors de la récupération des données :");
  }
}
// fonction qui permet de récupérer la liste des travaux depuis l'API
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
  const divFilterCategory = document.querySelector(".category-menu");
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

function editMode() {
  const divFiltreCategories = document.querySelector(".category-menu");
  if (divFiltreCategories) {
    divFiltreCategories.style.display = "none";// La section des filtres est caché
  }
  // Remplacement de 'login' par 'logout'
  const loginButton = document.getElementById("btn-Login");
  if (loginButton) {
    loginButton.textContent = "logout";
    // Ajout d'un ecouteur au bouton pour retourner sur la page login quand on se deconnecte
    loginButton.addEventListener("click", function () {
      localStorage.removeItem("authToken"); // suppression des donnée du 'localStorage'
      window.Location.href = "login.html"; // redirection vers login.html au click
    })
  }

  // ----------- Mode Édition & Classique ----------- 

  // Vérifier si la bannière existe déjà
  const editBanner = document.createElement("div");
  editBanner.classList.add("banner");

  // Vérification si la bannière existe déjà avant de la créer car je l'avais en double 
  const existingBanner = document.querySelector(".banner");
  // Recherche du header
  const header = document.querySelector("header");
  if (header) {
    const editIcon = document.createElement("i");
    editIcon.classList.add("far", "fa-pen-to-square");
    editIcon.style.marginRight = "10px";
    const iconText = document.createElement("span");
    iconText.textContent = "Mode édition";

    editBanner.appendChild(editIcon);
    editBanner.appendChild(iconText);
    // Insertion de la bannière avant le header
    header.parentNode.insertBefore(editBanner, header);
  }

  // Icone et texte
  const myProject = document.querySelector(".my-project");
  // j'ai du rajouter cette condition car 'linkIcon' était en double
  if (!myProject.querySelector(".js-modal")) {
    const linkIcon = document.createElement("a");
    const editIcon = document.createElement("i");
    const iconText = document.createElement("span");
    linkIcon.href = "#modal1";
    linkIcon.classList.add("js-modal");
    iconText.classList.add("modify")
    editIcon.classList.add("fa-regular", "fa-pen-to-square", "edit-icon");
    iconText.textContent = "modifier";

    linkIcon.appendChild(editIcon);
    linkIcon.appendChild(iconText);
    myProject.appendChild(linkIcon);

    openModal(linkIcon);
  }
}
function classicMode() {
  const divFiltreCategories = document.querySelector(".category-menu");
  console.log(divFiltreCategories);
  if (divFiltreCategories) {
    divFiltreCategories.style.display = "block";
  }

  const loginButton = document.querySelector(".login-button");
  if (loginButton) {
    loginButton.textContent = "Login";
  }
}
// ----------------------------- Partie modale -------------------------  

// Reste à faire une fonction pour les différentes vue de la modale, une première lors du click sur 'modifier' et une deuxième qui lors du click sur le bouton 'Ajouter une photo'

// Fonction d'ouverture de la modale
function openModal(linkIcon) {
  // selection du 'href'
  const modal = document.querySelector('#modal1');

  // Création du container qui contiendra la galerie
  const modalContentContainer = document.createElement('div');
  modalContentContainer.classList.add('modal-gallery');

  // Création et ajout du bouton dans la div buttonContent
  const buttonContent = document.createElement('div')
  buttonContent.classList.add('btnModalContainer');

  // Création du bouton 
  const addPicture = document.createElement('button');
  addPicture.textContent = 'Ajouter une photo';
  addPicture.classList.add('buttonModal');
  // Reste à ajouter un évenement au click qui renverra vers la seconde vue de la modale

  buttonContent.appendChild(addPicture);

  modal.querySelector('.modal-content').appendChild(modalContentContainer);
  modal.querySelector('.modal-content').appendChild(buttonContent);

  // Ajout d'un 'eventListener' au click
  linkIcon.addEventListener('click', function (e) {
    e.preventDefault();
    // Clonage de la galerie des travaux
    const divGallery = document.querySelector('.gallery')
    if (divGallery) {
      const galleryClone = divGallery.cloneNode(true);

      // Ajout de l'icone remove sur chaques figure clonée
      const figures = galleryClone.querySelectorAll('figure');
      figures.forEach(figure => {
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon', 'deletIcon');
        figure.appendChild(deleteIcon);
      });

      modalContentContainer.innerHTML = '';
      modalContentContainer.appendChild(galleryClone);
    }

    // Reste à ajouter une condition pour la suppression des travaux lorsque l'on clique sur le bouton remove

    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
  });
  // Fermeture de la modale avec le bouton 'close'
  modal.querySelector('.modal-close').addEventListener('click', function () {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
  });

  // Fermeture de la modale au click en dehors de celle-ci
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  });
}