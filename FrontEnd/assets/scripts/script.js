// Récupère la valeur de "authToken" dans le localStorage du navigateur et la stocke dans la variable 'token'
let token = localStorage.getItem("authToken");

if (token) { // Vérifie si un token a été trouvé dans le localStorage
  // Si un token est présent, active le mode édition
  editMode();
  // console.log('Mode edition'); // affiche mode édition dans la console
} else { // Sinon active le mode classique
  classicMode();
  // console.log('Mode Classique'); // affiche mode classique dans la console
}
// Récupère les données depuis l'API
fetchData();
// =============================================================================
// ==== Fonction de récupération des travaux et des catégories depuis l'API ====
// =============================================================================

async function fetchData() {
  try {
    const reponseWorks = await fetch("http://localhost:5678/api/works"); // Récupération des travaux depuis l'API
    if (!reponseWorks.ok) {
      throw new Error('Erreur lors de la récupération des travaux.');
    }
    // Conversion de la réponse en JSON et stockage dans la variable listWorks
    const listWorks = await reponseWorks.json();
    const reponseCategory = await fetch("http://localhost:5678/api/categories"); // Récupération des catégories depuis l'API
    if (!reponseCategory.ok) {
      throw new Error('Erreur lors de la récupération des catégories.');
    }
    // Conversion de la réponse des catégories en JSON et stockage dans la variable listCategory
    const listCategory = await reponseCategory.json();
    // Appel des diférentes fonction nécessaires pour le fonctionnement du site et l'affichage des travaux, catégories ...
    genererWorks(listWorks);
    genererFilter(listCategory, listWorks);
    addListenerFilter(listWorks);
  } catch (error) {
    // En cas d'erreur dans le bloc try, affiche une alerte avec le message d'erreur
    alert(error.message);
    // Affiche l'erreur détaillée dans la console du navigateur
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// =============================================================================
// =========================== Fonction Mode Édition ===========================
// =============================================================================
// fonction du mode édition 
function editMode() {
  const divFiltreCategories = document.querySelector(".category-menu");
  if (divFiltreCategories) {
    divFiltreCategories.style.display = "none"; // cacher la partie des boutons de catégories
  }
  const loginButton = document.getElementById("btn-Login");
  if (loginButton) {
    loginButton.textContent = "logout"; // Modification du bouton 'login' en 'logout'
    loginButton.addEventListener("click", function () {
      localStorage.removeItem("authToken"); // supprésion des données utilisateur lors du Logout
      window.location.href = "login.html"; // redirige l'utilisateur sur la page de connexion
    })
  }
  // Cette partie ajoute les différents éléments qui sont ajouté au mode édition
  // Partie bannière 
  const editBanner = document.createElement("div"); // création de la div banner pour acceuillir la banière
  editBanner.classList.add("banner");
  const header = document.querySelector("header");
  const editIcon = document.createElement("i");
  editIcon.classList.add("far", "fa-pen-to-square");
  editIcon.style.marginRight = "10px";
  const iconText = document.createElement("span");
  iconText.textContent = "Mode édition"; // insertion du texte dans la balise 'span'

  editBanner.appendChild(editIcon);
  editBanner.appendChild(iconText);
  header.parentNode.insertBefore(editBanner, header); // insertion de la bannière avant le header

  // Partie du futur lien pour afficher la modale (à coté de mes Projets)
  const myProject = document.querySelector(".my-project");
  if (!myProject.querySelector(".js-modal")) {
    const linkIcon = document.createElement("a");
    const editIcon = document.createElement("i");
    const iconText = document.createElement("span");
    linkIcon.href = "#modal"; // lien pour afficher la modale
    linkIcon.classList.add("js-modal");
    iconText.classList.add("modify")
    editIcon.classList.add("fa-regular", "fa-pen-to-square", "edit-icon");
    iconText.textContent = "modifier";

    linkIcon.appendChild(editIcon);
    linkIcon.appendChild(iconText);
    myProject.appendChild(linkIcon);
    iconText.addEventListener("click", openModal); // ajout d'un évènement au clique qui déclenche l'ouverture de la modale
  }
}

// =============================================================================
// ========================== Fonction Mode Classique ==========================
// =============================================================================
// fonction du mode classique
function classicMode() {
  const divFiltreCategories = document.querySelector(".category-menu");
  if (divFiltreCategories) {
    divFiltreCategories.style.display = "block"; // Affichage des boutons de filtrage des catégories
  }

  const loginButton = document.querySelector(".login-button");
  if (loginButton) {
    loginButton.textContent = "Login"; // le bouton 'login' s'affiche en mode classique
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
    return; // retourne un message d'erreur si la galerie ne s'affiche pas
  }

  divGallery.innerHTML = ""; // Efface le contenu existant de divGallery
  for (let i = 0; i < listWorks.length; i++) { // Boucle à travers chaque élément dans listWorks
    const figure = listWorks[i]; // Récupère l'objet figure à l'index i
    // Création d'un nouvel élément <figure> pour chaque figure dans listWorks
    const worksElement = document.createElement('figure');
    // Création d'un paragraphe <p> pour afficher l'ID de l'image nécessaire pour l'ajout de photos
    const imageIdElement = document.createElement("p");
    imageIdElement.innerText = figure.id; // Affiche l'ID de l'image
    // Création d'un élément <img> pour afficher l'image avec la source imageUrl
    const imageElement = document.createElement('img');
    imageElement.src = figure.imageUrl;
    // Création d'un élément <figcaption> pour afficher le titre de l'image
    const titleElement = document.createElement('figcaption');
    titleElement.innerText = figure.title;
    // Création d'un paragraphe <p> pour afficher l'ID de la catégorie
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

  // Création d'un bouton "Tous" pour afficher toutes les catégories
  const buttonFilterAll = document.createElement('button');
  buttonFilterAll.setAttribute('class', 'btn-tous button');
  buttonFilterAll.textContent = "Tous";
  divFilterCategory.appendChild(buttonFilterAll);

  // Création d'un bouton pour chaque catégorie dans "listCategory" pour chaques catégories "dataset.id"
  for (let i = 0; i < listCategory.length; i++) {
    const buttonFilter = document.createElement('button');
    buttonFilter.dataset.id = listCategory[i].id;
    buttonFilter.setAttribute('class', 'btn-filter button');
    buttonFilter.innerText = listCategory[i].name;
    divFilterCategory.appendChild(buttonFilter);
  }
  // Ajout d'un écouteur d'événement au clic pour le bouton "Tous" qui va réinitialiser les filtres et afficher l'entièreté de la galerie
  buttonFilterAll.addEventListener('click', () => {
    genererWorks(listWorks); // Affiche toutes les photos quand "Tous" est cliqué
  });
}

function addListenerFilter(listWorks) {
  const listButton = document.querySelectorAll('.btn-filter');
  for (let i = 0; i < listButton.length; i++) { // La boucle "for" parcourt chaque bouton de "listButton"
    const currentButton = listButton[i];
    // Pour chaque bouton, un écouteur d’événement se déclenche lorsque le bouton est cliqué
    currentButton.addEventListener('click', (event) => {
      // Lorsque l’utilisateur clique sur un bouton de filtre, l’ID de la catégorie correspondante est extrait à partir de "event.target.dataset.id"
      const categoryId = parseInt(event.target.dataset.id);
      // "listWorks" récupère que les œuvres ayant "categoryId" égal à l’ID de la catégorie sélectionnée.
      const listWorksFilter = listWorks.filter(work => work.categoryId === categoryId);
      genererWorks(listWorksFilter); // Affiche les photos filtrées
    });
  }
}

//=============================================================================
// -------------------------------- Partie modale ----------------------------- 
// ============================================================================

// Ce code gère l’ouverture de la modale lorsque le bouton "modifier" est cliqué, et prépare l’affichage du contenu de la modal et initialise certaines fonctionnalités supplémentaires. 

// Sélection du bouton qui ouvre la modal au clic sur "modifier"
const modifyButton = document.querySelector(".modify");
if (modifyButton) {
  modifyButton.addEventListener("click", openModal);
}
// ===================================================================
// ================= Fonction pour ouvrir la modale ==================

function openModal() {
  const modal = document.querySelector("#modal");
  const modal2 = modal.querySelector('.modal2');

  if (modal) { // Si la modale s'ouvre alors elle s'affiche au centre et la modale 2 est caché 
    modal.style.display = null; // Pour que la modale soit centré sur la page
    modal2.style.display = 'none';
  }

  modalClose(modal); // Appelle la fonction pour fermer la modal en cliquant à l'extérieur ou sur le bouton "close"
  Modal1(); // Appelle la fonction pour dupliquer la galerie dans la modal
}

// ===================================================================
// ===================== Fonction de la modale 1 =====================

// La fonction Modal1 permet de gérer l’affichage et la gestion de la modal qui affiche une galerie de travaux, permettant également la suppression des éléments de cette galerie. 

function Modal1() {
  // Sélectionne les éléments HTML pour la galerie principale et la galerie dans la modal
  const mainGallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".galleryModal");

  if (mainGallery && modalGallery) {
    // Copie le contenu de la galerie principale dans la galerie de la modal
    modalGallery.innerHTML = mainGallery.innerHTML;

    // Sélectionne toutes les figures dans la modal
    const figuresInModal = modalGallery.querySelectorAll('figure');

    // Pour chaque figure dans la modal
    figuresInModal.forEach(figure => {
      // Ajoute une classe 'modal-figure' à la figure
      figure.classList.add('modal-figure');

      // Sélectionne le figcaption de la figure
      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        // Cache le figcaption
        figcaption.style.display = 'none';
      }

      // Création d'une icône de suppression
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');

      // Ajoute un écouteur d'événement de clic à l'icône de suppression
      deleteIcon.addEventListener('click', async () => {
        // Demande de confirmation pour la suppression
        const confirmation = confirm("Voulez-vous vraiment supprimer ce travail ?");
        if (confirmation) {
          // Récupère l'ID de la figure
          const figureId = figure.dataset.id;
          console.log(figureId);
          if (figureId) {
            try {
              // Récupère le token d'authentification depuis le localStorage
              const token = localStorage.getItem("authToken");
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

              // Vérifie la réponse de la requête
              if (response.ok) {
                // Supprime la figure de la modal si la suppression réussit
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

      // Ajoute l'icône de suppression à la figure
      figure.appendChild(deleteIcon);
    });
  }

  // Sélection du bouton pour ajouter une photo
  const addPhotoButton = document.querySelector('.js-ajout-photo');
  if (addPhotoButton) {
    // Ajoute un écouteur d'événement au bouton pour afficher la vue de la modal2
    addPhotoButton.addEventListener('click', function () {
      modal2();
    });
  }

  // Appelle la fonction pour récupérer les données après la modification
  fetchData();
}
// ===================================================================
// ==================== Affichage de la modale 2 =====================

// La fonction modal2 gère l’affichage d’une deuxième modal (modal2) tout en masquant la première modal (modal1). Elle ajuste également certains éléments de la modal pour s’adapter à ce changement de contexte, comme le titre de la modal et l’affichage des boutons.

// Fonction pour afficher modal2 et masquer modal1
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
    resetModal(); // Appelle la fonction pour réinitialiser la modal
  });
}
// =============================================================
// ======================== Partie POST ======================== 

// Ce bout de code permet de prévisualiser l'image sélectionnée par l’utilisateur dans un élément de conteneur sur la page web. 

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

      pictureContainer.appendChild(imgElement); // Affiche l'image dans le conteneur
    };
    reader.readAsDataURL(file); // Lit le fichier en tant qu'URL de données
  }
});

// =============================================================
// ================= Validation du formulaire  =================

// Ce bout de code sert à valider un formulaire avant de permettre à l’utilisateur de soumettre ses données.

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
    const file = fileInput.files[0]; // Récupère le fichier sélectionné
    const title = titleInput.value; // Récupère la valeur saisie dans le champ de titre
    const categoryName = categorySelect.value; // Récupère la valeur sélectionnée dans le sélecteur de catégorie
    const categoryId = categoriesMap[categoryName]; // Obtient l'ID de la catégorie à partir de categoriesMap

    if (file && title && categoryId) { // Vérifie si tout les champs sont remplis
      submitButton.style.background = "#1d6154"; // Si tous les champs requis sont remplis, change la couleur de fond du bouton en vert
    } else {
      submitButton.style.background = ""; // Réinitialise la couleur grise du bouton si le formulaire n'est pas rempli
    }
  }
}

// Ce code gère l’ajout d’événements et la gestion de l’envoi de formulaire pour ajouter un nouveau travail via une requête POST à l'API

// Ajout des écouteurs d'événements pour les champs du formulaire
fileInput.addEventListener('change', validateForm); // Lorsque le fichier sélectionné change, appelle la fonction validateForm
titleInput.addEventListener('input', validateForm); // À chaque modification dans le champ de titre, appelle la fonction validateForm
categorySelect.addEventListener('change', validateForm); // Lorsque la sélection de catégorie change, appelle la fonction validateForm

// Écouteur d'événement sur le bouton submit du formulaire
submitButton.addEventListener('click', async function (event) {
  event.preventDefault();

  // Récupération des valeurs des champs du formulaire
  const file = fileInput.files[0]; // Premier fichier sélectionné dans le champ de fichier
  const title = document.getElementById('titre').value; // Valeur du champ de titre
  const categorySelect = document.getElementById('categorie'); // Sélection de l'élément de catégorie
  const categoryName = categorySelect.value; // Valeur sélectionnée dans la liste déroulante des catégories
  const categoryId = categoriesMap[categoryName]; // ID correspondant à la catégorie sélectionnée

  // Vérification si tous les champs requis sont remplis
  if (!file || !title || !categoryId) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }
  // Création de la requête du formulaire : 
  const formData = new FormData();
  formData.append("image", file); // image corespond à file
  formData.append("title", title);// title corespond à titre
  formData.append("category", categoryId);// category corespond à categoryId

  // Log des entrées de formData pour le débogage”
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const token = localStorage.getItem("authToken"); // Récupère le token depuis localStorage
    if (!token) {
      console.error('Token non trouvé.'); // Affiche une erreur si le token n'est pas trouvé
      return;
    }

    // Envoie une requête POST pour ajouter un travail avec le token dans les headers
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`, // Ajoute le token d'authentification dans les headers de la requête
      },
      body: formData // Ajoute les données du formulaire dans le corps de la requête
    });

    if (response.ok) {
      console.error('Ajout réussi avec succès !'); // Affiche un message de succès si l'envoi réussit
    } else {
      console.error('Erreur lors de l\'envoi des travaux :', response.statusText); // Affiche l'erreur si l'envoi échoue
    }
  } catch (error) {
    alert('Erreur lors de l\'envoi des travaux :', error); // Affiche l'erreur si l'envoi échoue
  }
});

// =============================================================
// ======== Fonction de fermeture et reset de la modale ========
// =============================================================

// Fonction pour fermer la modale après l'envoi des travaux
function closeModal() {
  const modal = document.querySelector("#modal");
  modal.style.display = "none";
  resetModal(); // Appelle la fonction pour réinitialiser la modal
}

// Fonction pour fermer la modale avec le bouton close
function modalClose(modal) {
  const closeButton = modal.querySelector(".js-modal-close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
      resetModal(); // Appelle la fonction pour réinitialiser la modal
    });
  }

  // pour fermer la modale en cliquant à l'exterieur
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      resetModal(); // Appelle la fonction pour réinitialiser la modal
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