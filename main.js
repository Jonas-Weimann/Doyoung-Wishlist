// const mainContainer = document.getElementById('main')

// fetch('../../db/photocards.json')
// .then(response => response.json())
// .then(data => {
//     data.forEach(photocard => {
//         const card = document.createElement('div')
//         const photo = document.createElement('div')
//         const img = document.createElement('img')
//         const description = document.createElement('p')
//         const buttons = document.createElement('div')
//         const buyButton = document.createElement('a')
//         const editButton = document.createElement('button')
//         const obtainedButton = document.createElement('button')
//         const notObtainedButton = document.createElement('button')
//         const price = document.createElement('span')
//         card.className = `photocard ${photocard.era} not-obtained`
//         card.id = `${photocard.era}-${photocard.version}`
//         photo.className = 'photo-container'
//         img.src = photocard.img
//         img.classList = 'photocard-img'
//         description.innerHTML = `<b>${photocard.era}</b><br> ${photocard.version} ver.`
//         buttons.className = 'button-container'
//         buyButton.innerText = 'BUY HERE'
//         buyButton.href = photocard.link
//         buyButton.target = '_blank'
//         editButton.className = 'edit-button'
//         editButton.innerText = '✎'
//         price.innerText = `${photocard.price} USD`
//         price.className = 'price'
//         price.id = `${photocard.era}-${photocard.version}-price`
//         notObtainedButton.className = 'not-obtained-button'
//         notObtainedButton.innerText = '✘'
//         obtainedButton.className = 'obtained-button'
//         obtainedButton.innerText = '✔'
//         obtainedButton.addEventListener('click', ()=>{
//             card.classList.remove('not-obtained')
//             card.classList.add('obtained')
//             price.classList.add('disabled')
//         })
//         notObtainedButton.addEventListener('click',()=>{
//             card.classList.remove('obtained')
//             card.classList.add('not-obtained')
//             price.classList.remove('disabled')
//         })
//         editButton.addEventListener('click',()=>{
//              Swal.fire({
//                 input: "url",
//                 inputLabel: "New URL address",
//                 inputPlaceholder: "Enter the URL"
//               }).then((result)=>{
//                 if (result.isConfirmed) {
//                     buyButton.href = result.value
//                     Swal.fire(`URL updated successfully!`);
//                   }
//               })

//         })
//         price.addEventListener('click', ()=>{
//             Swal.fire({
//                 input: "number",
//                 inputLabel:"New Price",
//                 inputPlaceholder: "Enter the price",
//                 inputAttributes:{
//                     min: 0.01,
//                     step:0.01
//                 },
//                 inputValue: 0.01
//             }).then((result)=>{
//                 if(result.isConfirmed) {
//                     price.innerText = `${result.value} USD`
//                     Swal.fire('Price updated succesfully!')
//                 }
//             })
//         })
//         photo.appendChild(img)
//         photo.appendChild(description)
//         buttons.appendChild(notObtainedButton)
//         buttons.appendChild(obtainedButton)
//         buttons.appendChild(editButton)
//         photo.appendChild(price)
//         card.append(photo)
//         card.appendChild(buyButton)
//         card.append(buttons)
//         mainContainer.appendChild(card)
//     });
// })
// console.log('Pagina cargada correctamente')

//USANDO DATABASE IndexedDB


async function cargarDatosDesdeJSON() {
    try {
        const respuesta = await fetch('./db/photocards.json');

        if (!respuesta.ok){
            throw new Error('No se pudo cargar el archivo JSON');
        }

        const datos = await respuesta.json();
        return datos;

    } catch (error){
        console.error('Hubo un error mal ahí', error);
    }
}

function cargarDatosAIndexedDB(json){

    const request = indexedDB.open('PhotocardsDB', 2);

    request.onupgradeneeded = (event) =>{
        const db = event.target.result;
        if (!db.objectStoreNames.contains('Stock')) {
            const objectStore = db.createObjectStore('Stock', {keyPath: 'id'});
            console.log("Object store 'Stock' creado.");
        }    
    };
    
    request.onsuccess = (event) =>{
        const db = event.target.result;
        const transaction = db.transaction('Stock', 'readonly');
        const store = transaction.objectStore('Stock');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess= ()=>{
            // Si la base de datos ya tiene datos, no los cargues
            if (getAllRequest.result.length === 0) {
                console.log('Base de datos vacía, cargando datos...');
                // Si no hay datos, agregar los datos del JSON
                const transactionWrite = db.transaction('Stock', 'readwrite');
                const storeWrite = transactionWrite.objectStore('Stock');
                
                json.forEach((item)=>{
                    store.put(item)
                })

                transactionWrite.oncomplete = () => {
                    console.log('Datos cargados exitosamente a IndexedDB');
                };
                transactionWrite.onerror = (event) => {
                    console.error('Error al cargar los datos:', event.target.error);
                };
            } else {
                console.log('Datos ya existen en la base de datos, no es necesario cargarlos nuevamente.');
            }
        }
        getAllRequest.onerror = (event) => {
            console.error('Error al obtener los datos de la base de datos:', event.target.error);
        };
    }

    request.onerror = (event)=>{
        console.error('ERROR CARGANDO', event.target.error)
    }
}

async function cargarDatosDesdeIndexedDB(){
    return new Promise((resolve, reject)=>{
        const request = indexedDB.open('PhotocardsDB',2);

        request.onsuccess = (event)=>{
            const db = event.target.result;
            const transaction = db.transaction('Stock', 'readonly');
            const store = transaction.objectStore('Stock');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = ()=>{
                resolve(getAllRequest.result)
            }

            getAllRequest.onerror = (event) =>{
                reject('Errorrrr mal ahi: ' + event.target.error)
            }
        };
        
        request.onerror = (event)=>{
            reject('Errorrrrr mal ahi: ' + event.target.error)
        }
    })
}

function renderizarPhotocards(data){
    const mainContainer = document.getElementById('main')
    data.forEach(photocard =>{
        const card = document.createElement('div');
        const photo = document.createElement('div');
        const img = document.createElement('img');
        const description = document.createElement('p');
        const buttons = document.createElement('div');
        const buyButton = document.createElement('a');
        const editButton = document.createElement('button');
        const obtainedButton = document.createElement('button');
        const notObtainedButton = document.createElement('button');
        const price = document.createElement('span');


        // Asignando clases y contenido
        card.className = `photocard ${photocard.era} ${photocard.status}`;
        card.id = `${photocard.era}-${photocard.version}`;
        photo.className = 'photo-container';
        img.src = photocard.img;
        img.classList = 'photocard-img';
        description.innerHTML = `<b>${photocard.era}</b><br> ${photocard.version} ver.`;
        buttons.className = 'button-container';
        buyButton.innerText = 'BUY HERE';
        buyButton.href = photocard.link;
        buyButton.target = '_blank';
        editButton.className = 'edit-button';
        editButton.innerText = '✎';
        price.innerText = `${photocard.price} USD`;
        price.className = 'price';
        price.id = `${photocard.era}-${photocard.version}-price`;
        notObtainedButton.className = 'not-obtained-button';
        notObtainedButton.innerText = '✘';
        obtainedButton.className = 'obtained-button';
        obtainedButton.innerText = '✔';

        // Eventos de botones
        obtainedButton.addEventListener('click', () => {
            card.classList.remove('not-obtained');
            card.classList.add('obtained');
            price.classList.add('disabled');
            photocard.status = 'obtained';
            actualizarEnIndexedDB(photocard)
        });
        notObtainedButton.addEventListener('click', () => {
            card.classList.remove('obtained');
            card.classList.add('not-obtained');
            price.classList.remove('disabled');
            photocard.status = 'not-obtained';
            actualizarEnIndexedDB(photocard)
        });
        editButton.addEventListener('click', () => {
            Swal.fire({
                input: "url",
                inputLabel: "New URL address",
                inputPlaceholder: "Enter the URL"
            }).then((result) => {
                if (result.isConfirmed) {
                    buyButton.href = result.value;
                    photocard.link = result.value;
                    actualizarEnIndexedDB(photocard)
                    Swal.fire(`URL updated successfully!`);
                }
            });
        });

        // Evento para actualizar el precio
        price.addEventListener('click', () => {
            Swal.fire({
                input: "number",
                inputLabel: "New Price",
                inputPlaceholder: "Enter the price",
                inputAttributes: {
                    min: 0.01,
                    step: 0.01
                },
                inputValue: photocard.price || 0.01
            }).then((result) => {
                if (result.isConfirmed) {
                    price.innerText = `${result.value} USD`;
                    photocard.price = result.value;
                    actualizarEnIndexedDB(photocard);
                    Swal.fire('Price updated successfully!');
                }
            });
        });

        // Añadir los elementos a la card
        photo.appendChild(img);
        photo.appendChild(description);
        buttons.appendChild(notObtainedButton);
        buttons.appendChild(obtainedButton);
        buttons.appendChild(editButton);
        photo.appendChild(price);
        card.append(photo);
        card.appendChild(buyButton);
        card.appendChild(buttons);

        // Agregar la card al contenedor principal
        mainContainer.appendChild(card);
    })
}

function actualizarEnIndexedDB(photocard){
    const request = indexedDB.open('PhotocardsDB',2);

    request.onsuccess = (event)=>{
        const db = event.target.result;
        const transaction = db.transaction('Stock', 'readwrite');
        const store = transaction.objectStore('Stock');
        const updateRequest = store.put(photocard);
        updateRequest.onsuccess = () => {
            console.log('Photocard actualizada correctamente en IndexedDB');
        };

        // Manejo de error de la actualización
        updateRequest.onerror = (event) => {
            console.error('Error al actualizar la photocard:', event.target.error);
        };

        // Manejo de errores en la transacción
        transaction.onerror = (event) => {
            console.error('Error en la transacción:', event.target.error);
        };
    }
    request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}

cargarDatosDesdeJSON().then((datos)=>{
    cargarDatosAIndexedDB(datos)
});

cargarDatosDesdeIndexedDB()
    .then((data) => {
        renderizarPhotocards(data); // Renderizar las cards basadas en los datos
    })
    .catch((error) => {
        console.error(error); // Mostrar error en caso de que algo falle
    });