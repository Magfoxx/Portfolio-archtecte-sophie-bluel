// Récupère la valeur de "authToken" dans le localStorage du navigateur et la stocke dans la variable 'token'
let token = localStorage.getItem("authToken");

if (token) { // Vérifie si un token a été trouvé dans le localStorage
  editMode();
  // console.log('Mode edition');
} else {
  classicMode();
  // console.log('Mode Classique');
}
fetchData();
// =============================================================================
// ==== Fonction de récupération des travaux et des catégories depuis l'API ====
// =============================================================================
// Ce code définit une fonction asynchrone fetchData qui récupère des données depuis une API, les traite, et appelle des fonctions pour générer l’affichage des travaux et des catégories depuis l'API. 
async function fetchData() {
  try {
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    if (!reponseWorks.ok) {
      throw new Error('Erreur lors de la récupération des travaux.');
    }
    const listWorks = await reponseWorks.json();
    const reponseCategory = await fetch("http://localhost:5678/api/categories");
    if (!reponseCategory.ok) {
      throw new Error('Erreur lors de la récupération des catégories.');
    }
    const listCategory = await reponseCategory.json();
    // Appel des diférentes fonction nécessaires pour le fonctionnement du site et l'affichage des travaux, catégories ...
    genererWorks(listWorks);
    genererFilter(listCategory, listWorks);
    addListenerFilter(listWorks);
  } catch (error) {
    alert(error.message);
    console.error("Erreur lors de la récupération des données :", error);
  }
}
// =============================================================================
// =========================== Fonction Mode Édition ===========================
// =============================================================================
function editMode() {
  const divFiltreCategories = document.querySelector(".category-menu");
  if (divFiltreCategories) {
    divFiltreCategories.style.display = "none";
  }
  const loginButton = document.getElementById("btn-Login");
  if (loginButton) {
    loginButton.textContent = "logout";
    loginButton.addEventListener("click", function () {
      localStorage.removeItem("authToken"); // supprésion des données utilisateur lors du Logout
    })
  }
  // Cette partie ajoute les différents éléments qui sont ajouté au mode édition
  // ========== Partie bannière ==========
  const editBanner = document.createElement("div");
  editBanner.classList.add("banner");
  const header = document.querySelector("header");
  const editIcon = document.createElement("i");
  editIcon.classList.add("far", "fa-pen-to-square");
  editIcon.style.marginRight = "10px";
  const iconText = document.createElement("span");
  iconText.textContent = "Mode édition";

  editBanner.appendChild(editIcon);
  editBanner.appendChild(iconText);
  header.parentNode.insertBefore(editBanner, header); // insère un élément editBanner juste avant l’élément header dans le DOM

  // Partie du lien pour afficher la modale (à coté de mes Projets)
  const myProject = document.querySelector(".my-project");
  if (!myProject.querySelector(".js-modal")) {
    const linkIcon = document.createElement("a");
    const editIcon = document.createElement("i");
    const iconText = document.createElement("span");
    linkIcon.href = "#modal";
    linkIcon.classList.add("js-modal");
    iconText.classList.add("modify")
    editIcon.classList.add("fa-regular", "fa-pen-to-square", "edit-icon");
    iconText.textContent = "modifier";

    linkIcon.appendChild(editIcon);
    linkIcon.appendChild(iconText);
    myProject.appendChild(linkIcon);
    iconText.addEventListener("click", openModal);
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
// Fonction qui permet l'affichage de la galerie et l'intégralité des photos (travaux)
function genererWorks(listWorks) {
  const divGallery = document.querySelector('.gallery');
  if (!divGallery) {
    console.error("L'élément .gallery n'existe pas sur cette page.");
    return;
  }

  divGallery.innerHTML = "";
  for (let i = 0; i < listWorks.length; i++) { // Boucle à travers chaque élément dans listWorks
    const figure = listWorks[i];
    const worksElement = document.createElement('figure');
    const imageIdElement = document.createElement("p");
    imageIdElement.innerText = figure.id; // Affiche l'ID de l'image
    const imageElement = document.createElement('img');
    imageElement.src = figure.imageUrl;
    const titleElement = document.createElement('figcaption');
    titleElement.innerText = figure.title;
    const categoryIdElement = document.createElement("p");
    categoryIdElement.innerText = figure.categoryId;

    // Ajout de l'attribut data-id avec la valeur de l'ID de l'image à "worksElement"
    worksElement.dataset.id = figure.id;
    worksElement.appendChild(imageIdElement);
    worksElement.appendChild(imageElement);
    worksElement.appendChild(titleElement);
    worksElement.appendChild(categoryIdElement);
    divGallery.appendChild(worksElement);
  }
}
// =============================================================================
// ======================== Partie des boutons filtres =========================
// =============================================================================
function genererFilter(listCategory, listWorks) {
  const divFilterCategory = document.querySelector(".category-menu");
  divFilterCategory.innerHTML = "";

  // Création du bouton "TOUS"
  const buttonFilterAll = document.createElement('button');
  buttonFilterAll.setAttribute('class', 'btn-tous button');
  buttonFilterAll.textContent = "Tous";
  divFilterCategory.appendChild(buttonFilterAll);

  // Création d'un bouton pour chaque catégorie dans "listCategory" pour chaques catégories "dataset.id"
  for (let i = 0; i < listCategory.length; i++) {
    const buttonFilter = document.createElement('button');
    buttonFilter.dataset.id = listCategory[i].id; // Associe l'id de la catégorie au bouton
    buttonFilter.setAttribute('class', 'btn-filter button');
    buttonFilter.innerText = listCategory[i].name;
    divFilterCategory.appendChild(buttonFilter);
  }
  // Ajout d'un écouteur d'événement au clic pour le bouton "Tous" qui va réinitialiser les filtres et afficher l'entièreté de la galerie
  buttonFilterAll.addEventListener('click', () => {
    genererWorks(listWorks);
  });
}

function addListenerFilter(listWorks) {
  const listButton = document.querySelectorAll('.btn-filter');
  for (let i = 0; i < listButton.length; i++) { // La boucle "for" parcourt chaque bouton de "listButton"
    const currentButton = listButton[i];
    currentButton.addEventListener('click', (event) => {
      // Lorsque l’utilisateur clique sur un bouton de filtre, l’ID de la catégorie correspondante est extrait à partir de "event.target.dataset.id"
      const categoryId = parseInt(event.target.dataset.id);
      // "listWorks" récupère que les œuvres ayant "categoryId" égal à l’ID de la catégorie sélectionnée.
      const listWorksFilter = listWorks.filter(work => work.categoryId === categoryId);
      genererWorks(listWorksFilter);
    });
  }
}
//=============================================================================
// -------------------------------- Partie modale ----------------------------- 
// ============================================================================
// Ce code gère l’ouverture de la modale lorsque le bouton "modifier" est cliqué, et prépare l’affichage du contenu de la modal et initialise certaines fonctionnalités supplémentaires. 
const modifyButton = document.querySelector(".modify");
if (modifyButton) {
  modifyButton.addEventListener("click", openModal);
}
// ================= Fonction pour ouvrir la modale ==================
function openModal() {
  const modal = document.querySelector("#modal");
  const modal2 = modal.querySelector('.modal2');

  if (modal) {
    modal.style.display = null; // Pour centré la modale sur la page
    modal2.style.display = 'none';
  }

  modalClose(modal);
  Modal1();
}
// ===================== Fonction de la modale 1 =====================
// La fonction Modal1 permet de gérer l’affichage et la gestion de la modal qui affiche une galerie de travaux, permettant également la suppression des éléments de cette galerie. 

function Modal1() {
  const mainGallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".galleryModal");
  if (mainGallery && modalGallery) {
    // Copie le contenu de la galerie principale dans la galerie de la modal
    modalGallery.innerHTML = mainGallery.innerHTML;

    const figuresInModal = modalGallery.querySelectorAll('figure');
    figuresInModal.forEach(figure => {
      figure.classList.add('modal-figure');

      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        figcaption.style.display = 'none';
      }
      // Gestion des travaux: Elle permet aux utilisateurs de supprimer des travaux directement depuis la modal, avec une vérification de confirmation et une gestion des erreurs.
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');
      deleteIcon.addEventListener('click', async () => {
        const confirmation = confirm("Voulez-vous vraiment supprimer ce travail ?");
        if (confirmation) {
          const figureId = figure.dataset.id; // Récupèration de l'ID de la figure
          console.log(figureId);
          if (figureId) {
            try {
              const token = localStorage.getItem("authToken"); // Récupère le token d'authentification depuis le localStorage
              if (!token) {
                console.error('Token non trouvé.');
                return;
              }

              // Envoie une requête DELETE pour supprimer le travail correspondant à l'ID de la figure
              const response = await fetch(`http://localhost:5678/api/works/${figureId}`, {
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              });
              if (response.ok) {
                figure.remove();
                console.error('Suppression réussie !');
              } else {
                console.error('Erreur lors de la suppression du travail.');
              }
            } catch (error) {
              alert('Erreur lors de la suppression du travail :', error);
            }
          }
        }
      });
      figure.appendChild(deleteIcon); // Ajoute l'icône de suppression à la figure
    });
  }

  const addPhotoButton = document.querySelector('.js-ajout-photo');
  if (addPhotoButton) {
    addPhotoButton.addEventListener('click', function () {
      modal2();
    });
  }
  fetchData();
}
// ==================== Affichage de la modale 2 =====================
// La fonction modal2 gère l’affichage d’une deuxième modal (modal2) tout en masquant la première modal (modal1). Elle ajuste également certains éléments de la modal pour s’adapter à ce changement de contexte, comme le titre de la modal et l’affichage des boutons.
function modal2() {
  const modal = document.querySelector("#modal");
  const modal1 = modal.querySelector('.modal1');
  const modal2 = modal.querySelector('.modal2');
  const backButton = document.querySelector('.js-modal-back');
  const titleModal = document.querySelector('#titlemodal');
  const addPhotoButton = document.querySelector('.js-ajout-photo');

  if (modal1 && modal2 && titleModal && addPhotoButton)
    modal1.style.display = "none";
  modal2.style.display = "block";
  backButton.style.display = "block";
  addPhotoButton.style.display = "none";
  titleModal.textContent = "Ajout photo";

  backButton.addEventListener('click', function () {
    resetModal();
  });
}
// ======================== Partie POST ======================== 
// Ce code permet de prévisualiser l'image sélectionnée par l’utilisateur dans un élément de conteneur sur la page web. 
const fileInput = document.querySelector('.file-input');
const pictureContainer = document.getElementById('pictureContainer');

fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      pictureContainer.innerHTML = ''; // Efface le contenu précédent du conteneur de photos pour afficher l'image sélectionnée
      const imgElement = document.createElement('img');
      imgElement.src = reader.result; // Charge l'image sélectionnée
      imgElement.style.maxWidth = '129px';
      imgElement.style.maxHeight = '169px';

      pictureContainer.appendChild(imgElement);
    };
    reader.readAsDataURL(file); // Lit le fichier en tant qu'URL de données
  }
});
// ================= Validation du formulaire  =================
// Ce code sert à valider un formulaire avant de permettre à l’utilisateur de soumettre ses données.
const submitButton = document.querySelector('.valider-photo');
const titleInput = document.getElementById('titre');
const categorySelect = document.getElementById('categorie');
// Association des valeurs string avec l'id corespondant
const categoriesMap = {
  "Objets": 1,
  "Appartements": 2,
  "Hotels & restaurants": 3
};

if (submitButton) {
  function validateForm() { // Cette fonction est définie à l’intérieur du bloc if (submitButton), ce qui signifie qu’elle est attachée à l’événement de clic 
    const file = fileInput.files[0];
    const title = titleInput.value;
    const categoryName = categorySelect.value;
    const categoryId = categoriesMap[categoryName]; // Obtient l'ID de la catégorie à partir de categoriesMap

    if (file && title && categoryId) { // Vérifie si tout les champs sont remplis
      submitButton.style.background = "#1d6154";
    } else {
      submitButton.style.background = "";
    }
  }
}
// Ce code gère l’ajout d’événements et la gestion de l’envoi de formulaire pour ajouter un nouveau travail via une requête POST à l'API

fileInput.addEventListener('change', validateForm);
titleInput.addEventListener('input', validateForm);
categorySelect.addEventListener('change', validateForm);

// Écouteur d'événement sur le bouton submit du formulaire
submitButton.addEventListener('click', async function (event) {
  event.preventDefault();

  // Récupération des valeurs des champs du formulaire
  const file = fileInput.files[0];
  const title = document.getElementById('titre').value;
  const categorySelect = document.getElementById('categorie');
  const categoryName = categorySelect.value;
  const categoryId = categoriesMap[categoryName];

  if (!file || !title || !categoryId) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }
  // Création de la requête du formulaire : 
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", categoryId);

  // Log des entrées de formData pour le débogage”
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error('Token non trouvé.');
      return;
    }
    // Envoie une requête POST pour ajouter un travail avec le token dans les headers
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (response.ok) {
      console.error('Ajout réussi avec succès !');
    } else {
      console.error('Erreur lors de l\'envoi des travaux :', response.statusText);
    }
  } catch (error) {
    alert('Erreur lors de l\'envoi des travaux :', error);
  }
});
// =============================================================
// ======== Fonction de fermeture et reset de la modale ========
// =============================================================
function closeModal() {
  const modal = document.querySelector("#modal");
  modal.style.display = "none";
  resetModal();
}
// Fonction pour fermer la modale avec le bouton close
function modalClose(modal) {
  const closeButton = modal.querySelector(".js-modal-close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
      resetModal();
    });
  }
  // pour fermer la modale en cliquant à l'exterieur
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      resetModal();
    }
  });
}
// Fonction qui réinitialise la modal après une fermeture
function resetModal() {
  const modal = document.querySelector("#modal");
  const modal1 = modal.querySelector('.modal1');
  const modal2 = modal.querySelector('.modal2');
  const backButton = document.querySelector('.js-modal-back');
  const titleModal = document.querySelector('#titlemodal');
  const addPhotoButton = document.querySelector('.js-ajout-photo');

  modal1.style.display = 'grid';
  modal2.style.display = 'none';
  titleModal.textContent = 'Galerie photo';
  addPhotoButton.style.display = 'block';
  backButton.style.display = 'none';
}