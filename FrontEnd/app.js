let allPhotos = []; // On utilise ce tableau pour stocker TOUTES les photos reçues de l'API
let categories = []; // Pour stocker les noms des catégories uniques

// Sélectionne la galerie HTML une seule fois
const gallery = document.querySelector('.gallery');

// Fonction asynchrone pour récupérer les photos
async function getPhotos() {
    try {
        let response = await fetch('http://localhost:5678/api/works');
        allPhotos = await response.json(); // Stocke toutes les photos ici
        console.log("Toutes les photos récupérées :", allPhotos);

        createGallery(allPhotos); // Affiche toutes les photos au chargement
        getCategories(); // Récupère et affiche les boutons de catégorie
        addCategoryEventListeners(); // Ajoute les écouteurs aux boutons
    } catch (error) {
        console.error("Erreur lors de la récupération des photos :", error);
        // Tu peux ajouter un message d'erreur à l'utilisateur ici
    }
}

// Lance la récupération et l'affichage des photos au démarrage
getPhotos();

// Fonction pour créer et afficher la galerie
// Elle prend un tableau de photos à afficher en paramètre
function createGallery(photosToDisplay) {
    gallery.innerHTML = ''; // Vide l'intégralité de la galerie avant d'ajouter de nouvelles photos

    if (photosToDisplay.length === 0) {
        const noPhotosMessage = document.createElement('p');
        noPhotosMessage.textContent = "Aucune œuvre ne correspond à cette catégorie.";
        gallery.appendChild(noPhotosMessage);
        return; // Sort de la fonction si le tableau est vide
    }

    photosToDisplay.forEach((photo) => {
        const galleryItem = document.createElement('figure');
        galleryItem.innerHTML = `
            <img src="${photo.imageUrl}" alt="${photo.title}">
            <figcaption>${photo.title}</figcaption>
        `;
        gallery.appendChild(galleryItem);
    });
}

// Fonction pour récupérer les catégories uniques et créer les boutons
function getCategories() {
    const uniqueCategoryNames = new Set();
    uniqueCategoryNames.add('Tous'); // Ajoute 'Tous' en premier

    // Parcours toutes les photos pour extraire les noms de catégorie
    allPhotos.forEach(photo => {
        if (photo.category && typeof photo.category.name === 'string') {
            uniqueCategoryNames.add(photo.category.name);
        }
    });

    categories = Array.from(uniqueCategoryNames); // Convertit le Set en tableau

    let filterContainer = document.querySelector('.filter'); // L'élément HTML où les filtres seront ajoutés
    categories.forEach(categoryName => {
        let categoryButton = document.createElement('p');
        categoryButton.textContent = categoryName;
        // On donne une classe spécifique pour les boutons de filtre
        categoryButton.setAttribute('class', 'filter-button');
        if (categoryName === 'Tous') {
            categoryButton.classList.add('active'); // Ajoute une classe 'active' par défaut au bouton "Tous"
        }
        filterContainer.appendChild(categoryButton);
    });
}

// Fonction pour ajouter les écouteurs d'événements aux boutons de catégorie
function addCategoryEventListeners() {
    let filterButtons = document.querySelectorAll('.filter-button'); // Sélectionne tous les boutons de filtre

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedCategoryText = e.target.textContent; // Récupère le texte du bouton cliqué
            console.log("Catégorie sélectionnée :", selectedCategoryText);

            // Gère la classe 'active' pour le style des boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            let photosToDisplay = []; // Tableau qui contiendra les photos à afficher

            if (selectedCategoryText === 'Tous') {
                photosToDisplay = allPhotos; // Si "Tous", on affiche toutes les photos originales
            } else {
                // Sinon, on filtre 'allPhotos' pour obtenir les photos de la catégorie sélectionnée
                photosToDisplay = allPhotos.filter(photo => {
                    return photo.category && photo.category.name === selectedCategoryText;
                });
            }

            console.log("Photos à afficher :", photosToDisplay);
            createGallery(photosToDisplay); // Met à jour la galerie avec les photos filtrées
        });
    });
}

/* login */

let loginBtn = document.querySelector('#login-btn');
let main = document.querySelector('main');

function login() {
    let loginConteneur = document.createElement('div')
    let login = document.createElement('form');
    let labelEmail = document.createElement('label');
    let emailplaceHolder = document.createElement('input');
    let labelPassword = document.createElement('label');
    let password = document.createElement('input');
    password.setAttribute('type', 'password');
    labelEmail.innerText = "E-mail";
    labelPassword.innerText = "Mot de passe";
    login.appendChild(labelEmail);
    login.appendChild(emailplaceHolder);
    login.appendChild(labelPassword);
    login.appendChild(password);
    loginConteneur.classList.add('login');
    loginConteneur.classList.add('loginConteneur');
    loginConteneur.appendChild(login);
    loginBtn.addEventListener('click', (e) => {
        loginConteneur.classList.toggle('login-active')
        loginConteneur.classList.toggle('login');
        main.appendChild(loginConteneur)
    })
}

login()