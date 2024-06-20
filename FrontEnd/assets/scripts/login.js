const form = document.querySelector("form");
const submitButton = document.getElementById("btn-submit");

// Pour vérifier si mon bouton submit est valide au click
submitButton.addEventListener("click", function () {
  // console.log("Le bouton 'Se connecter' a été cliqué !");
});

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre pour démonstration
  // alert("Le formulaire a été soumis !");

  // Récupérer les valeurs des champs du formulaire
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById('erre-message')
  // console.log('Email:', email);
  // console.log('Password:', password);


  const reponseLogin = await fetch('http://localhost:5678/api/users/login', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  console.log('Connexion réussie', reponseLogin);

});