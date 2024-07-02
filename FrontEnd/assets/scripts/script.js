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
    linkIcon.href = "#modal1";
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
// Fonction pour ouvrir la modale
function openModal() {
  const modal = document.querySelector("#modal1");
  if (modal) {
    modal.style.display = null;
  }

  // Fermer la modale quand on clique sur le bouton de fermeture
  const closeButton = modal.querySelector(".js-modal-close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Fermer la modale quand on clique en dehors de la modale
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Charger les données et générer la galerie modale
  GalleryModal();
}

// Fonction pour dupliquer la galerie dans la modale
async function GalleryModal() {
  const modalGallery = document.querySelector(".galleryPhotoModal");

  try {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des travaux depuis l\'API');
    }
    const data = await response.json();

    modalGallery.innerHTML = ''; // Efface le contenu existant

    data.forEach(work => {
      const figure = document.createElement('figure');
      figure.dataset.id = work.id; // Ajoute l'ID à l'attribut data-id

      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');
      deleteIcon.addEventListener('click', async () => {
        const confirmation = confirm("Voulez-vous vraiment supprimer ce travail ?");
        if (confirmation) {
          try {
            const token = localStorage.getItem("authToken");
            if (!token) {
              console.error('Token non trouvé.');
              return;
            }

            const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
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

      figure.appendChild(deleteIcon);
      figure.classList.add('modal-figure');
      modalGallery.appendChild(figure);
    });

  } catch (error) {
    console.error('Erreur lors du chargement des travaux :', error);
  }

  fetchData();
}

// Ouverture de la modal au click sur le span .modify
const modifyButton = document.querySelector(".modify");

if (modifyButton) {
  modifyButton.addEventListener("click", function () {
    openModal();
  });
}