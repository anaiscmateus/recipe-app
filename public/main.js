var trash = document.getElementsByClassName("trash");
var pen = document.getElementsByClassName("pen");

let selectedRecipe = {
  email: '',
  recipeName: '',
  recipeDesc: '',
  ingredients: '',
  instructions: '',
  recipePrep: ''
};

// delete recipes
Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function() {
        // grab recipe data
        const email = this.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1].innerText
        const recipeName = this.parentNode.parentNode.parentNode.childNodes[1].innerText
        const recipeDesc = this.parentNode.parentNode.parentNode.childNodes[3].innerText
        const ingredients = this.parentNode.parentNode.parentNode.childNodes[7].innerText
        const instructions = this.parentNode.parentNode.parentNode.childNodes[11].innerText
        const recipePrep = this.parentNode.parentNode.parentNode.childNodes[13].childNodes[3].childNodes[1].innerText      

        // send recipe data to api for deletion
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

// update recipes
Array.from(pen).forEach(function(element) {
  element.addEventListener('click', function(event) {
    // Update the selectedRecipe object
    selectedRecipe.email = this.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1].innerText;
    selectedRecipe.recipeName = this.parentNode.parentNode.parentNode.childNodes[1].innerText;
    selectedRecipe.recipeDesc = this.parentNode.parentNode.parentNode.childNodes[3].innerText;
    selectedRecipe.ingredients = this.parentNode.parentNode.parentNode.childNodes[7].innerText;
    selectedRecipe.instructions = this.parentNode.parentNode.parentNode.childNodes[11].innerText;
    selectedRecipe.recipePrep = this.parentNode.parentNode.parentNode.childNodes[13].childNodes[3].childNodes[1].innerText;

    // Update the modal inputs
    const recipeNameInput = document.querySelector('#editRecipe input[name="recipeName"]');
    recipeNameInput.value = selectedRecipe.recipeName;
    const recipeDescInput = document.querySelector('#editRecipe input[name="recipeDesc"]');
    recipeDescInput.value = selectedRecipe.recipeDesc;
    const recipePrepInput = document.querySelector('#editRecipe input[name="recipePrep"]');
    recipePrepInput.value = selectedRecipe.recipePrep;
    const ingredientsInput = document.querySelector('#editRecipe textarea[name="ingredients"]');
    ingredientsInput.value = selectedRecipe.ingredients;
    const instructionsInput = document.querySelector('#editRecipe textarea[name="instructions"]');
    instructionsInput.value = selectedRecipe.instructions;
  });
});

// save updates
const saveButton = document.querySelector('#saveBtn');
    
saveButton.addEventListener('click', function() {
  // Get updated values from the modal inputs
  const email = document.querySelector('#addRecipe input[name="email"]').value;
  const updatedRecipeName = document.querySelector('#editRecipe input[name="recipeName"]').value;
  const updatedRecipeDesc = document.querySelector('#editRecipe input[name="recipeDesc"]').value;
  const updatedRecipePrep = document.querySelector('#editRecipe input[name="recipePrep"]').value;
  const updatedIngredients = document.querySelector('#editRecipe textarea[name="ingredients"]').value;
  const updatedInstructions = document.querySelector('#editRecipe textarea[name="instructions"]').value;

  // Send updated recipe data to the server for updates
  fetch('/profile', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'email': email,
      'oldRecipeName': selectedRecipe.recipeName,
      'oldRecipeDesc': selectedRecipe.recipeDesc,
      'oldRecipePrep': selectedRecipe.recipePrep,
      'oldIngredients': selectedRecipe.ingredients,
      'oldInstructions': selectedRecipe.instructions,
      'updatedRecipeName': updatedRecipeName,
      'updatedRecipeDesc': updatedRecipeDesc,
      'updatedRecipePrep': updatedRecipePrep,
      'updatedIngredients': updatedIngredients,
      'updatedInstructions': updatedInstructions,
    }),        
    }).then(function(response) {
      window.location.reload();
    });
  });