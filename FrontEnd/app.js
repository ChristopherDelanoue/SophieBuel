let allPhotos = [];
let categories = [];
let userId = localStorage.userId;
let userToken = localStorage.userToken;

const gallery = document.querySelector('.gallery');
const login_Text = document.querySelector('#login-text');

async function getPhotos() {
    try {
        let response = await fetch('http://localhost:5678/api/works');
        allPhotos = await response.json();
        console.log("Toutes les photos récupérées :", allPhotos);

        createGallery(allPhotos);
        getCategories();
        addCategoryEventListeners();
        loginText(userId)
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
            console.log(userToken)
            createGallery(photosToDisplay); // Met à jour la galerie avec les photos filtrées
        });
    });
}

/* login */

let loginBtn = document.querySelector('#login-btn');
let loginLink = document.querySelector('#login-text');
let loginClass = document.querySelectorAll('.login-class');
let editionBanner = document.querySelectorAll('#mode-edition');

function loginText(userid) {
    if (userid && userToken) {
        loginLink.innerText = "Logout"
        loginLink.setAttribute('href', 'index.html');
        //loginClass.forEach(btn => btn.classList.remove('login-class'));
    } else {
        loginClass.forEach((btn) => {
            btn.style.display = 'none';
        });
    }
}

loginBtn.addEventListener('click', (e)=> {
    if (login_Text.innerText === 'Logout') {
        if (localStorage.userId !== null) {
            window.location.reload();
            localStorage.userId = '';
            localStorage.userToken = '';
        } else {
            window.location.href = 'login.html';

        }
    }
});

/* modal */
let modal = null

let aside = document.createElement('aside');
aside.classList.add('modal');
aside.setAttribute('id', 'modal1');
aside.setAttribute('aria-hidden', 'true');
aside.setAttribute('role', 'dialog');
aside.style.display = 'none';
let modalWrapper = document.createElement('div');
modalWrapper.classList.add('js-modal-stop');
let modalContent = document.createElement('div');
modalContent.classList.add('content');
modalContent.innerHTML = `<h2>Galerie photo</h2>`

modalWrapper.appendChild(modalContent);
let btnCLoseModal = document.createElement('button');
btnCLoseModal.innerText = 'X';
btnCLoseModal.setAttribute('class', 'js-modal-close')
modalWrapper.appendChild(btnCLoseModal);
modalWrapper.classList.add('modal-wrapper');

aside.appendChild(modalWrapper);
document.body.appendChild(aside);

let btnModal = document.querySelector('.js-modal')

btnModal.addEventListener('click', (e) => {
    openModal(e)
})

function openModal(event) {
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute('href'));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

function closeModal(event) {
    if (modal === null) return;
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null;
}

function stopPropagation(e) {
    e.stopPropagation()
}

window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal(e);
    }
});

function modalPhoto(photos) {
    let photoModalContainer = document.createElement('div');
    photoModalContainer.style.display = 'grid';
    photoModalContainer.style.gridTemplate = 'none repeat(5, 1fr)';
    photos.forEach(photo => {
        photoModalContainer.appendChild(photo.imageUrl);
    })
}