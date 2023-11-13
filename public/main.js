var trash = document.getElementsByClassName("trash");

Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function() {
        const recipeName = this.parentNode.parentNode.childNodes[1].innerText
        const email = this.parentNode.parentNode.childNodes[13].childNodes[1].childNodes[3].childNodes[1].innerText
        const recipeDesc = this.parentNode.parentNode.childNodes[3].innerText
        const ingredients = this.parentNode.parentNode.childNodes[7].innerText
        const instructions = this.parentNode.parentNode.childNodes[11].innerText
        const recipePrep = this.parentNode.parentNode.childNodes[13].childNodes[3].childNodes[1].innerText

        fetch('profile', {
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'email': email,
              'recipeName': recipeName,
              'recipeDesc': recipeDesc,
              'ingredients': ingredients,
              'instructions': instructions,
              'recipePrep': recipePrep
            })
          }).then(function (response) {
            window.location.reload()
          })
    })
})
