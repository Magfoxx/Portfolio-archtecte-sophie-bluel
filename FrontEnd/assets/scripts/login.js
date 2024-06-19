// Récupérer les valeurs des champs du formulaire
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Envoyer les données à l'API via une requête POST
const reponseLogin = fetch('http://localhost:5678/api/users/login', {
  method: "POST",
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(email, password)
})
console.log(reponseLogin);

