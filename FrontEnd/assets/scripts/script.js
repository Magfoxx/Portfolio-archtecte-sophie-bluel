token = localStorage.getItem("authToken");
if (token) {
  editMode();
  console.log('Mode edition');
} else {
  classicMode()
  console.log('Mode Classique');
}
fetchData();

// =============================================================================
// ==== Fonction de récupération des travaux et des catégories depuis l'API ====
// =============================================================================

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
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    })
  }

  const editBanner = document.createElement("div");
  editBanner.classList.add("banner");

  const existingBanner = document.querySelector(".banner");
  const header = document.querySelector("header");
  if (header && !existingBanner) {
    const editIcon = document.createElement("i");
    editIcon.classList.add("far", "fa-pen-to-square");
    editIcon.style.marginRight = "10px";
    const iconText = document.createElement("span");
    iconText.textContent = "Mode édition";

    editBanner.appendChild(editIcon);
    editBanner.appendChild(iconText);
    header.parentNode.insertBefore(editBanner, header);
  }

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

function genererWorks(listWorks) {
  const divGallery = document.querySelector('.gallery');
  if (!divGallery) {
    console.error("L'élément .gallery n'existe pas sur cette page.");
    return;
  }

  divGallery.innerHTML = "";
  for (let i = 0; i < listWorks.length; i++) {
    const figure = listWorks[i];
    const worksElement = document.createElement('figure');

    const imageElement = document.createElement('img');
    imageElement.src = figure.imageUrl;
    const titleElement = document.createElement('figcaption');
    titleElement.innerText = figure.title;
    const categoryIdElement = document.createElement("p");
    categoryIdElement.innerText = figure.categoryId;

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

  const buttonFilterAll = document.createElement('button');
  buttonFilterAll.setAttribute('class', 'btn-tous button');
  buttonFilterAll.textContent = "Tous";
  divFilterCategory.appendChild(buttonFilterAll);

  for (let i = 0; i < listCategory.length; i++) {
    const buttonFilter = document.createElement('button');
    buttonFilter.dataset.id = listCategory[i].id;
    buttonFilter.setAttribute('class', 'btn-filter button');
    buttonFilter.innerText = listCategory[i].name;
    divFilterCategory.appendChild(buttonFilter);
  }

  buttonFilterAll.addEventListener('click', () => {
    genererWorks(listWorks);
  });
}

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

//=============================================================================
// ----------------------------- Partie modale -------------------------  
// =============================================================================
// Sélectionne le bouton qui ouvre la modal au clic sur ".modify"
const modifyButton = document.querySelector(".modify");
if (modifyButton) {
  modifyButton.addEventListener("click", openModal);
}

// Fonction pour ouvrir la modale
function openModal() {
  const modal = document.querySelector("#modal");
  const modal2 = modal.querySelector('.modal2');

  if (modal) {
    modal.style.display = null;
    modal2.style.display = 'none';
  }

  modalClose(modal); // Appelle la fonction pour fermer la modal en cliquant à l'extérieur
  Modal1(); // Appelle la fonction pour dupliquer la galerie dans la modal
}

// Fonction pour dupliquer la galerie dans la modale
function Modal1() {
  const mainGallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".galleryModal");

  if (mainGallery && modalGallery) {
    modalGallery.innerHTML = mainGallery.innerHTML; // Copie le contenu de la galerie principale dans la galerie de la modal

    const figuresInModal = modalGallery.querySelectorAll('figure');
    figuresInModal.forEach(figure => {
      figure.classList.add('modal-figure'); // Ajoute une classe aux figures dans la modal

      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        figcaption.style.display = 'none';
      }

      // Ajoute une icône de suppression à chaque figure dans la modal
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');
      deleteIcon.addEventListener('click', async () => {
        const confirmation = confirm("Voulez-vous vraiment supprimer ce travail ?");
        if (confirmation) {
          const figureId = figure.dataset.id;
          if (figureId) {
            try {
              const token = localStorage.getItem("authToken");
              if (!token) {
                console.error('Token non trouvé.');
                return;
              }

              // Envoie une requête DELETE pour supprimer le travail
              const response = await fetch(`http://localhost:5678/api/works/${figureId}`, {
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              });

              if (response.ok) {
                figure.remove(); // Supprime la figure de la modal si la suppression réussit
                console.log('Suppression réussie !');
              } else {
                console.error('Erreur lors de la suppression du travail.');
              }
            } catch (error) {
              console.error('Erreur lors de la suppression du travail :', error);
            }
          } else {
            console.error("ID de la photo non défini");
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

  fetchData(); // Appelle la fonction pour récupérer les données après la modification
}

// Fonction pour afficher modal2 et masquer modal1
function modal2() {
  const modal = document.querySelector("#modal");
  const modal1 = modal.querySelector('.modal1');
  const modal2 = modal.querySelector('.modal2');
  const backButton = document.querySelector('.js-modal-back');
  const titleModal = document.querySelector('#titlemodal');
  const fileInput = document.querySelector('.file-input');
  const pictureContainer = document.querySelector('.photo-container');

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

  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        pictureContainer.innerHTML = ''; // Efface le contenu précédent du conteneur de photos pour afficher l'image selectionné
        const imgElement = document.createElement('img');
        imgElement.src = reader.result; // Charge l'image sélectionnée
        imgElement.style.maxWidth = '129px';
        imgElement.style.maxHeight = '169px';

        pictureContainer.appendChild(imgElement); // Affiche l'image dans le conteneur
      };
      reader.readAsDataURL(file); // Lit le fichier en tant qu'URL de données
    }
  });

  const submitButton = document.querySelector('.valider-photo'); // Sélectionne le bouton de validation
  if (submitButton) {
    submitButton.addEventListener('click', async function (event) {
      event.preventDefault();

      const form = document.getElementById('photoForm');
      const formData = new FormData(form);

      try {
        const token = localStorage.getItem("authToken"); // Récupère le token JWT depuis localStorage
        if (!token) {
          console.error('Token non trouvé.'); // Affiche une erreur si le token n'est pas trouvé
          return;
        }

        // Envoie une requête POST pour ajouter un travail avec le token JWT dans les headers
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}` // Ajoute le token JWT dans les headers
          },
          body: formData // Ajoute les données du formulaire dans le corps de la requête
        });

        if (response.ok) {
          console.log('Travail envoyé avec succès !'); // Affiche un message de succès si l'envoi réussit
          closeModal(); // Appelle la fonction pour fermer la modal
          fetchData(); // Appelle la fonction pour rafraîchir les données
        } else {
          console.error('Erreur lors de l\'envoi des travaux :', response.statusText); // Affiche l'erreur si l'envoi échoue
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi des travaux :', error); // Affiche l'erreur si l'envoi échoue
      }
    });
  }
}

// Fonction pour fermer la modale après l'envoi des travaux
function closeModal() {
  const modal = document.querySelector("#modal");
  modal.style.display = "none";
  resetModal(); // Appelle la fonction pour réinitialiser la modal
}

// Fonction pour fermer la modale
function modalClose(modal) {
  const closeButton = modal.querySelector(".js-modal-close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
      resetModal(); // Appelle la fonction pour réinitialiser la modal
    });
  }

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