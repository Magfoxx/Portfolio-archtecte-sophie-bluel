document.querySelector("form").addEventListener("submit",
  async function (event) {
    //permet de ne pas envoyer le formulaire tout de suite  
    event.preventDefault();

    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const btnValidate = document.getElementById('btn-submit');

    function checkForm() {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      if (email && password) {
        btnValidate.classList.add('valid');
      } else {
        btnValidate.classList.remove('valid');
      }
    }

    // Attacher la fonction de vérification aux événements de saisie
    emailInput.addEventListener('change', checkForm);
    passwordInput.addEventListener('change', checkForm);

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      // Vérification des champs
      if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
        btnValidate.classList.remove('valid'); // Réinitialiser la couleur du bouton
        return;
      }

      try {
        const response = await fetch('http://localhost:5678/api/users/login', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Utilisateur non trouvé');
          } else if (response.status === 401) {
            throw new Error('Mot de passe incorrect');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la connexion.');
          }
        } else {
          const data = await response.json();
          const token = data.token;
          localStorage.setItem("authToken", token);
          window.location.href = "./index.html";
        }
      } catch (error) {
        errorMessage.textContent = error.message;
        btnValidate.classList.remove('valid'); // Réinitialiser la couleur du bouton en cas d'erreur
      }
    });
  });