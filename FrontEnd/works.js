const reponse = await fetch(`http://localhost:5678/api/works`);
const pieces = await reponse.json();
console.log(pieces)


const category = await fetch(`http://localhost:5678/api/categories`);
const categories = await category.json();
console.log(categories)

function ShowModifier() {
    const userId = localStorage.getItem('userId');
    const isAuthentified = !!userId;
    if (isAuthentified) {
        document.querySelector('.js-modal').classList.add('show')
    }
}
ShowModifier()


function GenererCategories(categories) {
    
    // Récupération de l'élément du DOM qui accueillera les categories
    const sectionCategorie = document.getElementById("categories");
    
    // Création d’une balise dédiée à une select
    const SelectElement = document.createElement("select");
    
    const optElement = document.createElement("optgroup");
    // Création des balises 
    for (let i=0; i < categories.length;i++){
        
        const option = categories[i];
        
        const optionElement = document.createElement("option");
        optionElement.setAttribute('data-id', option.id);
        optionElement.value = option.name;
        optionElement.innerText = option.name;
        // On rattache la balise select a la section categories
        sectionCategorie.appendChild(SelectElement);
        SelectElement.appendChild(optElement);
        optElement.appendChild(optionElement);
    }
    
}
document.getElementById("categories").innerHTML = "";
    GenererCategories(categories);


function GenererPieces(figure) {

    // Récupération de l'élément du DOM qui accueillera les fiches
     const sectionFiches = document.querySelector(".gallery");
     // Création d’une balise dédiée à une figure d'images
     const pieceElement = document.createElement("figure");
     pieceElement.setAttribute('data-id', figure.id);
     // Création des balises 
     const imageElement = document.createElement("img");
     imageElement.src = figure.imageUrl;
     const nomElement = document.createElement("figcaption");
     nomElement.innerText = figure.title;

     // On rattache la balise figure a la section Fiches
     sectionFiches.appendChild(pieceElement);
     pieceElement.appendChild(imageElement);
     pieceElement.appendChild(nomElement);
}

function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++) {

        const figure = pieces[i];
        GenererPieces(figure)

    }

}
document.querySelector(".gallery").innerHTML = "";
genererPieces(pieces)

function GenererPiecesmodal(figure) {

    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".gallery-modal");
    // Création d’une balise dédiée à une figure d'images
    const pieceElement = document.createElement("figure");
    pieceElement.setAttribute('data-id', figure.id);
    // Création des balises 
    const imageElement = document.createElement("img");
    imageElement.src = figure.imageUrl;
    // creation de button supprimer 
    const imagedelete = document.createElement("button");
    imagedelete.setAttribute('class', 'js-modal-delete')
    imagedelete.setAttribute('data-id', figure.id);
    imagedelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
    // On rattache la balise figure a la section Fiches
    sectionFiches.appendChild(pieceElement);
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(imagedelete)
}

function genererPiecesmodal(pieces) {
    for (let i = 0; i < pieces.length; i++) {

        const figure = pieces[i];
        GenererPiecesmodal(figure)
    }

}

genererPiecesmodal(pieces);



const boutonAll = document.querySelector(".btn-all");

boutonAll.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.category.name;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonObjet = document.querySelector(".btn-object");

boutonObjet.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.category.name === "Objets";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonAppart = document.querySelector(".btn-appartement");

boutonAppart.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.category.name === "Appartements";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonHotels = document.querySelector(".btn-hotels");

boutonHotels.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.category.name === "Hotels & restaurants";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererPieces(piecesFiltrees);
});



// modal bloc  


const openModal = function (e) {
    let modal = null

    const closeModal = function (e) {
        if (modal === null) return
        e.preventDefault();
        modal.style.display = "none"
        modal.setAttribute('aria-hidden', 'true')
        modal.removeAttribute('aria-modal')
        modal.removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
        modal = null

    }
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target;
    modal.addEventListener('click', closeModal)
    modal.querySelectorAll('.js-modal-close').forEach(elt => elt.addEventListener('click', closeModal))
    // modal.querySelector('#modal.js-modal-close').addEventListener('click' , closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}




const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
    if (e.key === 'escape' || e.key === 'esc') {
        closeModal(e)
    }
})


document.querySelectorAll('.modal .js-modal-delete').forEach(selector => {
    selector.addEventListener('click', async function (e) {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        const url = 'http://localhost:5678/api/works/' + id;
        const response = await fetch(url, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
        document.querySelectorAll(`figure[data-id="${id}"]`).forEach(elt => elt.remove());
        
    })
    document.querySelector(".gallery").innerHTML = "";
    genererPieces(pieces)
});

function previewImage() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('input', (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const imagePreviewContainer = document.getElementById('previewImageContainer');
        
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.addEventListener('load', function (event) {
                const imageUrl = event.target.result;
                const image = new Image();
                
                image.addEventListener('load', function () {
                    imagePreviewContainer.innerHTML = ''; // Vider le conteneur au cas où il y aurait déjà des images.
                    imagePreviewContainer.appendChild(image);
                });
                
                image.src = imageUrl;
                image.style.width = '100px'; // Indiquez les dimensions souhaitées ici.
                image.style.height = 'auto'; // Vous pouvez également utiliser "px" si vous voulez spécifier une hauteur.
            });
            
            reader.readAsDataURL(file);
        }
    })
}

previewImage()




document.querySelector('#modale2 form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const fileCategorie = document.getElementById('categories')
    const fileText = document.getElementById('text')
    
    
    const formData = new FormData();
    
    formData.append("image", fileInput.files[0]);
    
    if(!fileInput?.files[0]) {
        document.getElementById('monErreur').innerHtml = "Image non renseignée";
        return false;
    }
    
    formData.append("title", fileText.value);
    
    if(!fileText) {
         document.getElementById('monErreur').innerHtml = "Titre non renseignée";
         return false;
    }
        
    formData.append("category", 1);
    
    const url = 'http://localhost:5678/api/works';
    const response = await fetch(url, {
        method: 'post',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
    })
   
   
    const result = await response.json();
    GenererPieces(result)
    GenererPiecesmodal(result);
})


// bloc de fonctionnement du button submit 
const btn = document.getElementById('submitButton');
btn.disabled = true;
const Title = document.getElementById('text').value
function analyse(){
	if (Title.value === ''){
		btn.disabled = true;
		return;
	}
	btn.disabled = false;
	// la suite si le choix est cohérent
}
analyse()



