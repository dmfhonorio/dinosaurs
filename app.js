
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

function generateTiles(dinos) {
  const generateTileNode = (name, imgName, description = null) => {
    let node = document.createElement('div');
    node.className = 'grid-item';
    let nodeName = document.createElement('h3');
    nodeName.appendChild(document.createTextNode(name));
    node.appendChild(nodeName);
    let nodeImg = document.createElement('img');
    nodeImg.src = `/images/${imgName}.png`;
    node.appendChild(nodeImg);
    if (description) {
      let nodeDescription = document.createElement('p');
      nodeDescription.appendChild(document.createTextNode(description));
      node.appendChild(nodeDescription);
    }
    return node;
  }
  const generateDinoTile = (dino) => {
    return generateTileNode(dino.species, dino.species.toLowerCase(), dino.fact);
  }
  const generateHumanTile = () => {
    const { name } = human.getInfo();
    return generateTileNode(name, 'human');
  }
  const dinoNodes = [];
  dinos.forEach(dino => {
    let dinoNode = generateDinoTile(dino);
    dinoNodes.push(dinoNode);
  });
  const middleIndex = Math.floor(dinos.length / 2);
  const humanNode = generateHumanTile();
    dinoNodes.splice(middleIndex, 0, humanNode)
  removeForm();
  let grid = document.getElementById('grid');
  dinoNodes.forEach(node => {
    grid.appendChild(node);
  })
}


// Remove form from screen
const removeForm = () => {
  let form = document.getElementById('dino-compare');
  form.style = "display:none;"
}


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



