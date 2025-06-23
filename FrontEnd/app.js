let allPhotos = [];
let categories = [];

const gallery = document.querySelector('.gallery');


async function getPhotos() {
    try {
        let response = await fetch('http://localhost:5678/api/works');
        allPhotos = await response.json();
        console.log("Toutes les photos récupérées :", allPhotos);

        createGallery(allPhotos);
        getCategories();
        addCategoryEventListeners();
    } catch (error) {
        console.error("Erreur lors de la récupération des photos :", error);

    }
}

getPhotos();


function createGallery(photosToDisplay) {
    gallery.innerHTML = '';

    if (photosToDisplay.length === 0) {
        const noPhotosMessage = document.createElement('p');
        noPhotosMessage.textContent = "Aucune œuvre ne correspond à cette catégorie.";
        gallery.appendChild(noPhotosMessage);
        return;
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


function getCategories() {
    const uniqueCategoryNames = new Set();
    uniqueCategoryNames.add('Tous');


    allPhotos.forEach(photo => {
        if (photo.category && typeof photo.category.name === 'string') {
            uniqueCategoryNames.add(photo.category.name);
        }
    });

    categories = Array.from(uniqueCategoryNames);

    let filterContainer = document.querySelector('.filter');
    categories.forEach(categoryName => {
        let categoryButton = document.createElement('p');
        categoryButton.textContent = categoryName;

        categoryButton.setAttribute('class', 'filter-button');
        if (categoryName === 'Tous') {
            categoryButton.classList.add('active');
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
            console.log(userId)
            createGallery(photosToDisplay); // Met à jour la galerie avec les photos filtrées
        });
    });
}

/* login */

let loginBtn = document.querySelector('#login-btn');
let main = document.querySelector('main');

