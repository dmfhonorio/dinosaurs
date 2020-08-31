
    // Create Dino Constructor


    // Create Dino Objects


    // Create Human Object

    // Use IIFE to get human data from form

const human = (function () {
  const dinoForm = document.getElementById('dino-compare');
  const nameForm = dinoForm.querySelector('#name');
  const feetForm = dinoForm.querySelector('#feet');
  const inchesForm = dinoForm.querySelector('#inches');
  const weightForm = dinoForm.querySelector('#weight');
  const dietForm = dinoForm.querySelector('#diet');

  return {
    getInfo: () => (
      {
        name: nameForm.value,
        height: {
          feet: feetForm.value,
          inches: inchesForm.value
        },
        weight: parseInt(weightForm.value),
        diet: dietForm.value
      }
    )
  }
})();
    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 

    
    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.

    
    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.


    // Generate Tiles for each Dino in Array
  
        // Add tiles to DOM

    // Remove form from screen


// On button click, prepare and display infographic
