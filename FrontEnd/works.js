

const reponse = await fetch(`http://localhost:5678/api/works`);
const pieces = await reponse.json();
const category = await fetch(`http://localhost:5678/api/categories`);
const categories = await category.json();
console.log(categories)
console.log(pieces)
ShowModifier()

function ShowModifier(){
    const userId = localStorage.getItem('userId');
    const isAuthentified = !!userId ;
    if (isAuthentified){
        document.querySelector('.js-modal').classList.add('show')
    }
}
function genererPieces(pieces){
    for (let i = 0; i < pieces.length; i++) {

        const figure = pieces[i];
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
     
    }
    document.querySelector(".gallery").innerHTML = "";
    genererPieces(pieces)

    function genererPiecesmodal(pieces){
        for (let i = 0; i < pieces.length; i++) {
    
            const figure = pieces[i];
            // Récupération de l'élément du DOM qui accueillera les fiches
            const sectionFiches = document.querySelector(".gallery-modal");
            // Création d’une balise dédiée à une figure d'images
            const pieceElement = document.createElement("figure");
            pieceElement.setAttribute('data-id', figure.id);
            // Création des balises 
            const imageElement = document.createElement("img");
            imageElement.src = figure.imageUrl;
            // creation de button supprimer 
            const imagedelete =document.createElement("button");
            imagedelete.setAttribute('class','js-modal-delete')
            imagedelete.setAttribute('data-id', figure.id);
            imagedelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>' 
            // On rattache la balise figure a la section Fiches
            sectionFiches.appendChild(pieceElement);
            pieceElement.appendChild(imageElement);
            pieceElement.appendChild(imagedelete)
        
         }
         
        }
        
        genererPiecesmodal(pieces);



    const boutonAll = document.querySelector(".btn-all");

    boutonAll.addEventListener("click", function () {
        const piecesFiltrees = pieces.filter(function (piece) {
            return piece.category.name  ;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererPieces(piecesFiltrees);
    });
    
    const boutonObjet = document.querySelector(".btn-object");

    boutonObjet.addEventListener("click", function () {
        const piecesFiltrees = pieces.filter(function (piece) {
            return piece.category.name === "Objets" ;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererPieces(piecesFiltrees);
    });
    
    const boutonAppart = document.querySelector(".btn-appartement");

    boutonAppart.addEventListener("click", function () {
        const piecesFiltrees = pieces.filter(function (piece) {
            return piece.category.name === "Appartements" ;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererPieces(piecesFiltrees);
    });
    
    const boutonHotels = document.querySelector(".btn-hotels");

    boutonHotels.addEventListener("click", function () {
        const piecesFiltrees = pieces.filter(function (piece) {
            return piece.category.name === "Hotels & restaurants" ;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererPieces(piecesFiltrees);
    });



    // modal bloc  
     

    const openModal = function (e) {
        let modal = null

        const closeModal = function(e){
            if ( modal === null) return
            e.preventDefault();
            modal.style.display = "none" 
            modal.setAttribute('aria-hidden' , 'true')
            modal.removeAttribute('aria-modal')
            modal.removeEventListener('click' , closeModal)
            modal.querySelector('.js-modal-close').removeEventListener('click' , closeModal)
            modal.querySelector('.js-modal-stop').removeEventListener('click' , stopPropagation)
            modal = null
    
        }
        e.preventDefault();
        const target = document.querySelector (e.target.getAttribute('href'))
        target.style.display = null 
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal','true')
        modal = target ;
        modal.addEventListener('click' , closeModal)
        modal.querySelectorAll('.js-modal-close').forEach(elt => elt.addEventListener('click' , closeModal))
        // modal.querySelector('#modal.js-modal-close').addEventListener('click' , closeModal)
        modal.querySelector('.js-modal-stop').addEventListener('click' , stopPropagation)
    }
    
    


    const stopPropagation = function (e){
        e.stopPropagation();
    }
    
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click' , openModal)
    })

    window.addEventListener('keydown' , function (e) {
        if (e.key === 'escape' || e.key === 'esc') {
            closeModal(e)
        }
    })


    document.querySelectorAll('.modal .js-modal-delete').forEach(selector => {
        selector.addEventListener('click' , async function (e) {
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
        
    });

function previewImage() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('input', (e) =>{
        e.preventDefault();
        const file = fileInput.files[0];
        const imagePreviewContainer = document.getElementById('previewImageContainer');
        
        if(file.type.match('image.*')){
            const reader = new FileReader();
          
            reader.addEventListener('load', function (event) {
                const imageUrl = event.target.result;
                const image = new Image();
                
                image.addEventListener('load', function() {
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

// bloc de code de l'ajout dimage 
    // const form = document.forms.namedItem("fileinfo");
    // form.addEventListener(
    //     "submit",
    //     (event) => {
    //         const formData = new FormData(form);
            
    //         formData.append("CustomField", "Des données supplémentaires");
            
    //         const request = new XMLHttpRequest();
    //         request.open("POST", "stash.php", true);
    //         request.onload = (progress) => {
    //             output.innerHTML =
    //             request.status === 200
    //             ? "Fichier téléversé !"
    //             : `Erreur ${request.status} lors de la tentative de téléversement du fichier.<br />`;
    //         };
            
    //         request.send(formData);
    //         event.preventDefault();
    //     },
    //     false,
    //     );
        
    document.querySelector('#modale2 form').addEventListener('submit' , async function (e) {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const formData = new FormData();
        
        formData.append("image", fileInput.files[0]);
        formData.append("title", 'test');
        formData.append("category", 1 );
        const url = 'http://localhost:5678/api/works/';
        const response = await fetch(url, {
            method: 'post', 
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData
        })
        document.querySelector(".gallery").innerHTML = "";
    genererPieces(pieces)
    })
    