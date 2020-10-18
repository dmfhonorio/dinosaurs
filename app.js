const CARNIVOR_TYPE = 'carnivor';
const OMNIVOR_TYPE = 'omnivor';
const HERBAVOR_TYPE = 'herbavor';
const PIGEON_TYPE = 'Pigeon';

const Utils = {
  convertKgsToPounds: (kgs) => {
    return kgs * 2.2046;
  },
  convertCmsToFeet: (cms) => {
    return cms * 0.032808;
  },
  shuffleList: (list) => {
    let newList = [...list];
    for (var i = newList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = newList[i];
      newList[i] = newList[j];
      newList[j] = temp;
    }
    return newList;
  }
}

// Dino

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

Dino.prototype.compareWeight = function (weight) {
  if (this.weight > weight) {
    return (this.weight / weight).toFixed(2) + 'x heavier';
  } else {
    return (weight / this.weight).toFixed(2) + 'x lighter';
  }
}

Dino.prototype.compareHeight = function (height) {
  if (this.height > height) {
    return (this.height / height).toFixed(2) + 'x higher';
  } else {
    return (height / this.height).toFixed(2) + 'x smaller';
  }
}

Dino.prototype.compareDiet = function (diet) {
  if (this.diet === CARNIVOR_TYPE) {
    if (diet === CARNIVOR_TYPE || diet === OMNIVOR_TYPE) {
      return "Hunt it fast or it will eat you";
    } else {
      return "Run for your life";
    }
  } else if (this.diet === HERBAVOR_TYPE) {
    if (diet === CARNIVOR_TYPE) {
      return "No need to worry, it will not eat you";
    } else {
      return "Share a meal with it";
    }
  } else if (this.diet === OMNIVOR_TYPE) {
    if (diet === OMNIVOR_TYPE) {
      return "Share a meal with it";
    } else if (diet === HERBAVOR_TYPE) {
      return "It is best if you stay away";
    } else {
      return "Hunt it or tease it with a delicious fruit";
    }
  }
}

let dinosList;
fetch('dino.json')
  .then(res => res.json())
  .then(json => {
    const { Dinos } = json;
    dinosList = Dinos.map(dino => (new Dino(dino)));
  });


// Create Human Object IIFE

const human = (function () {
  const dinoForm = document.getElementById('dino-compare');
  const nameForm = dinoForm.querySelector('#name');
  const feetForm = dinoForm.querySelector('#feet');
  const inchesForm = dinoForm.querySelector('#inches');
  const heightMetricForm = dinoForm.querySelector('#height-metric');
  const weightForm = dinoForm.querySelector('#weight');
  const weightMetricForm = dinoForm.querySelector('#weight-metric');
  const dietForm = dinoForm.querySelector('#diet');
  const measurementSystem = dinoForm.querySelector('#measurement-system');

  return {
    getInfo: () => {
      let name = nameForm.value;
      let diet = dietForm.value.toLowerCase();
      let height;
      let weight;
      if (measurementSystem.value === 'imperial') {
        height = parseInt(feetForm.value) + parseInt(inchesForm.value) * 0.083333;
        weight = parseInt(weightForm.value);
      } else {
        height = Utils.convertCmsToFeet(heightMetricForm.value);
        weight = parseInt(Utils.convertKgsToPounds(weightMetricForm.value));
      }

      return { name, height, weight, diet }
    }
  }
})();

(function addListeners() {

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
      const randomIndex = parseInt(Math.random() * dino.facts.length);
      return generateTileNode(dino.species, dino.species.toLowerCase(), dino.facts[randomIndex]);
    }
    const generateHumanTile = () => {
      const { name } = human.getInfo();
      return generateTileNode(name, 'human');
    }
    let dinoNodes = [];
    dinos.forEach(dino => {
      let dinoNode = generateDinoTile(dino);
      dinoNodes.push(dinoNode);
    });
    dinoNodes = Utils.shuffleList(dinoNodes);
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
  const dinoForm = document.getElementById('dino-compare');
  dinoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const humanInfo = human.getInfo();
    let dinos = dinosList.map(dino => {
      const newDino = {
        ...dino,
        facts: [dino.fact]
      }
      if (dino.species != PIGEON_TYPE) {
        newDino.facts = newDino.facts.concat([
          dino.compareWeight(humanInfo.weight),
          dino.compareHeight(humanInfo.height),
          dino.compareDiet(humanInfo.diet)
        ])
      }
      return newDino;
    })
    generateTiles(dinos);
  });

  // Add Measurement System Change
  const measurementSystemSelector = document.getElementById('measurement-system');
  measurementSystemSelector.addEventListener('change', function (event) {
    const { value } = event.target;
    const imperialSystem = document.getElementById('imperial-system');
    const metricSystem = document.getElementById('metric-system');
    imperialSystem.style.display = value == 'imperial' ? 'block' : 'none';
    metricSystem.style.display = value == 'metric' ? 'block' : 'none';
    const feetInpt = imperialSystem.querySelector("#feet");
    const inchesInpt = imperialSystem.querySelector("#inches");
    const weightInpt = imperialSystem.querySelector("#weight");
    const heightMetricInpt = metricSystem.querySelector("#height-metric");
    const weightMetricInpt = metricSystem.querySelector("#weight-metric");
    feetInpt.required = value == 'imperial';
    inchesInpt.required = value == 'imperial';
    weightInpt.required = value == 'imperial';
    heightMetricInpt.required = value == 'metric';
    weightMetricInpt.required = value == 'metric';
  });
})();
