
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

// =============================================================================
// ==== Fonction de récupération des travaux et des catégories depuis l'API ====
// =============================================================================

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
// =============================================================================
// =========================== Fonction Mode Édition ===========================
// =============================================================================

function editMode() {
  const divFiltreCategories = document.querySelector(".category-menu");
  if (divFiltreCategories) {
    divFiltreCategories.style.display = "none";// La section des boutons filtre est caché
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

// =============================================================================
// ========================== Fonction Mode Classique ==========================
// =============================================================================

function classicMode() {
  const divFiltreCategories = document.querySelector(".category-menu");
  if (divFiltreCategories) {
    divFiltreCategories.style.display = "block";
  }

  const loginButton = document.querySelector(".login-button");
  if (loginButton) {
    loginButton.textContent = "Login";
  }
}

// =============================================================================
// ==================== Fonction de génération des travaux =====================
// =============================================================================

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

// =============================================================================
// ======================== Partie des boutons filtres =========================
// =============================================================================

function genererFilter(listCategory, listWorks) {

  // Récupération de l'élément du DOM
  const divFilterCategory = document.querySelector(".category-menu");
  divFilterCategory.innerHTML = "";
  // Création du bouton 'Tous' 
  const buttonFilterAll = document.createElement('button');
  buttonFilterAll.setAttribute('class', 'btn-tous button');
  buttonFilterAll.textContent = "Tous";

  divFilterCategory.appendChild(buttonFilterAll);

  // Boucle pour afficher le nom de chaques catégorie de l'API
  for (let i = 0; i < listCategory.length; i++) {
    const buttonFilter = document.createElement('button');
    // Récupération de l'id du bouton pour l'event Listener
    buttonFilter.dataset.id = listCategory[i].id;
    // console.log(buttonFilter.dataset.id) // Cela m'affiche bien mes 3 id
    buttonFilter.setAttribute('class', 'btn-filter button');
    buttonFilter.innerText = listCategory[i].name

    divFilterCategory.appendChild(buttonFilter);
  }

  // ========== Bouton TOUS ==========

  // Pour le bouton 'Tous'
  buttonFilterAll.addEventListener('click', () => {
    genererWorks(listWorks);
  })
}
// ========== Les autres boutons ==========

function addListenerFilter(listWorks) {
  const listButton = document.querySelectorAll('.btn-filter',);
  for (let i = 0; i < listButton.length; i++) {
    const currentButton = listButton[i];
    currentButton.addEventListener('click', (event) => {
      const categoryId = parseInt(event.target.dataset.id);
      const listWorksFilter = listWorks.filter(work => work.categoryId === categoryId);
      genererWorks(listWorksFilter);
    });
  }
}

// =============================================================================
// ----------------------------- Partie modale -------------------------  
// =============================================================================
function openModal(linkIcon) {
  const modal = document.querySelector('#modal');
  const modalWrapper = modal.querySelector('.modal-wrapper');
  const modalContent = modal.querySelector('.modal-content');
  const modalTitle = document.getElementById('titlemodal');
  const divGallery = document.querySelector('.gallery');
  const addPictureBtn = document.querySelector('.js-ajout-photo');
  const modalFooter = document.querySelector('.modal-footer');
  const modalForm = document.querySelector('.modal2');
  const backButton = document.querySelector('.js-modal-back');
  const closeButton = modal.querySelector('.js-modal-close');
  const fileInput = modalForm.querySelector('#fileInput');


  function resetModal() {
    modalContent.innerHTML = '';
    modalForm.style.display = 'none';
    modalContent.style.display = 'block';
    modalTitle.textContent = 'Galerie photo';
    modalFooter.style.display = 'block';
    addPictureBtn.style.display = 'block';
    backButton.style.display = 'none';
  }

  function addDeleteIconsToGallery() {
    if (divGallery) {
      const galleryClone = divGallery.cloneNode(true);
      const figures = galleryClone.querySelectorAll('figure');
      figures.forEach(figure => {
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');
        figure.appendChild(deleteIcon);

        deleteIcon.addEventListener('click', async () => {
          const confirmation = confirm("Voulez-vous vraiment supprimer ce travail ?");
          if (confirmation) {
            try {
              const token = localStorage.getItem("authToken");
              if (!token) {
                console.error('Token non trouvé.');
                return;
              }

              const response = await fetch(`http://localhost:5678/api/works/1`, {
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              });

              if (response.ok) {
                figure.remove();
                console.log('Suppression réussie !');
              } else {
                console.error('Erreur lors de la suppression du travail.');
              }
            } catch (error) {
              console.error('Erreur lors de la suppression du travail :', error);
            }
          }
        });
      });

      modalContent.appendChild(galleryClone);
    }
  }

  linkIcon.addEventListener('click', function (e) {
    e.preventDefault();
    resetModal();
    addDeleteIconsToGallery();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
  });

  addPictureBtn.addEventListener('click', function () {
    modalContent.style.display = 'none';
    modalTitle.textContent = 'Ajout photo';
    addPictureBtn.style.display = 'none';
    modalForm.style.display = 'block';
    backButton.style.display = 'block';
    modalFooter.style.display = 'none';
    modalWrapper.appendChild(modalForm);
  });

  backButton.addEventListener('click', function () {
    modalContent.style.display = 'block';
    modalTitle.textContent = 'Galerie photo';
    modalFooter.style.display = 'block';
    addPictureBtn.style.display = 'block';
    modalForm.style.display = 'none';
    backButton.style.display = 'none';
  });

  closeButton.addEventListener('click', function () {
    resetModal();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      resetModal();
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  });

  const btnAddPhoto = modalForm.querySelector('.btn-ajout-fichier');
  btnAddPhoto.addEventListener('click', function () {
    const fileInput = modalForm.querySelector('#fileInput');
    fileInput.click();
  });

  const pictureContainer = document.querySelector('.photo-container');
  fileInput.addEventListener('change', function () {
    const selectedImage = document.querySelector('#selectedImage');
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        pictureContainer.innerHTML = '';
        pictureContainer.appendChild(selectedImage);
        selectedImage.src = reader.result;
        selectedImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
}