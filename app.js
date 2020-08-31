
// Create Dino Constructor

function Dino(dino) {
  const { species, weight, height, diet, where, when, fact } = dino;
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

// Create Dino Objects
let dinosList;
fetch('dino.json')
  .then(res => res.json())
  .then(json => {
    const { Dinos } = json;
    dinosList = Dinos.map(dino => (new Dino(dino)));
  });


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

Dino.prototype.compareWeight = function (weight) {
  if (this.weight > weight) {
    return (this.weight / weight).toFixed(2) + 'x heavier';
  } else {
    return (weight / this.weight).toFixed(2) + 'x lighter';
  }
}

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.


// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.


// Generate Tiles for each Dino in Array
// Add tiles to DOM

function generateTiles(dinosList) {
  console.log(dinosList);
  const generateDinoTile = (dino) => {
    let dinoNode = document.createElement('div');
    dinoNode.className = 'grid-item';
    let dinoSpecies = document.createElement('h3');
    dinoSpecies.appendChild(document.createTextNode(dino.species));
    let dinoImg = document.createElement('img');
    dinoImg.src = `/images/${dino.species.toLowerCase()}.png`;
    let dinoFact = document.createElement('p');
    dinoFact.appendChild(document.createTextNode(dino.fact));
    dinoNode.appendChild(dinoSpecies);
    dinoNode.appendChild(dinoImg);
    dinoNode.appendChild(dinoFact);
    return dinoNode;
  }

  let grid = document.getElementById('grid');
  dinosList.forEach(dino => {
    let dinoNode = generateDinoTile(dino);
    grid.appendChild(dinoNode);
  });
  let form = document.getElementById('dino-compare');
  form.style = "display:none;"
}


// Remove form from screen


// On button click, prepare and display infographic

const dinoCompare = (event) => {
  event.preventDefault();
  console.log(human.getInfo());
  const humanInfo = human.getInfo();
  let dinos = dinosList.map(dino => {
    return {
      ...dino,
      fact1: dino.compareWeight(humanInfo.weight)
    }
  })
  generateTiles(dinos);
}

const dinoForm = document.getElementById('dino-compare')
dinoForm.addEventListener('submit', dinoCompare);



