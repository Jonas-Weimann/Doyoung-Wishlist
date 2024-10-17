const mainContainer = document.getElementById('main')

fetch('../../db/photocards.json')
.then(response => response.json())
.then(data => {
    data.forEach(photocard => {
        const card = document.createElement('div')
        const photo = document.createElement('div')
        const img = document.createElement('img')
        const description = document.createElement('p')
        const buttons = document.createElement('div')
        const buyButton = document.createElement('a')
        const editButton = document.createElement('button')
        const obtainedButton = document.createElement('button')
        const notObtainedButton = document.createElement('button')
        const price = document.createElement('span')
        card.className = `photocard ${photocard.era} not-obtained`
        card.id = `${photocard.era}-${photocard.version}`
        photo.className = 'photo-container'
        img.src = photocard.img
        img.classList = 'photocard-img'
        description.innerHTML = `<b>${photocard.era}</b><br> ${photocard.version} ver.`
        buttons.className = 'button-container'
        buyButton.innerText = 'BUY HERE'
        buyButton.href = photocard.link
        buyButton.target = '_blank'
        editButton.className = 'edit-button'
        editButton.innerText = '✎'
        price.innerText = `${photocard.price} USD`
        price.className = 'price'
        price.id = `${photocard.era}-${photocard.version}-price`
        notObtainedButton.className = 'not-obtained-button'
        notObtainedButton.innerText = '✘'
        obtainedButton.className = 'obtained-button'
        obtainedButton.innerText = '✔'
        obtainedButton.addEventListener('click', ()=>{
            card.classList.remove('not-obtained')
            card.classList.add('obtained')
            price.classList.add('disabled')
        })
        notObtainedButton.addEventListener('click',()=>{
            card.classList.remove('obtained')
            card.classList.add('not-obtained')
            price.classList.remove('disabled')
        })
        editButton.addEventListener('click',()=>{
             Swal.fire({
                input: "url",
                inputLabel: "New URL address",
                inputPlaceholder: "Enter the URL"
              }).then((result)=>{
                if (result.isConfirmed) {
                    buyButton.href = result.value
                    Swal.fire(`URL updated successfully!`);
                  }
              })

        })
        price.addEventListener('click', ()=>{
            Swal.fire({
                input: "number",
                inputLabel:"New Price",
                inputPlaceholder: "Enter the price",
                inputAttributes:{
                    min: 0.01
                },
                inputValue: 0.01
            }).then((result)=>{
                if(result.isConfirmed) {
                    price.innerText = `${result.value} USD`
                    Swal.fire('Price updated succesfully!')
                }
            })
        })
        photo.appendChild(img)
        photo.appendChild(description)
        buttons.appendChild(notObtainedButton)
        buttons.appendChild(obtainedButton)
        buttons.appendChild(editButton)
        photo.appendChild(price)
        card.append(photo)
        card.appendChild(buyButton)
        card.append(buttons)
        mainContainer.appendChild(card)
    });
})
