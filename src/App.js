import './App.css';
import { useState, useEffect } from 'react';
import backgroundImage from './public/background.png';
import physicalMoveImage from './public/physicalmove.png';
import specialMoveImage from './public/specialmove.png';

function App() {
  const [opacity, setOpacity] = useState('1');
  const [display, setDisplay] = useState('block');
  const [backgroundDisplay, setBackgroundDisplay] = useState('none');
  const [playerPokemonName, setPlayerName] = useState("");
  const [playerPokemonSprite, setPlayerSprite] = useState("");
  const [playerPokemonMoves, setPlayerMoves] = useState([]);
  const [enemyPokemonSprite, setEnemySprite] = useState("");
  const [EnemyPokemonMoves, setEnemyMoves] = useState([]);
  const [playerPokemonHp, setPlayerHp] = useState(100);

  let allPokemon = [];
  let allEnemyPokemon = [];

  const changeOpacityState = () => {
    if (opacity === '1') {
      setOpacity('0');
    } else {
      setOpacity('1');
    }
    setTimeout(async function () {
      if (opacity == '0') {
        setDisplay('block');
        setBackgroundDisplay('none');
      } else {
        setDisplay('none');
        setBackgroundDisplay('block');

        allPokemon.push(await createNewPokemon());
        setPlayerName(allPokemon[0][0]['name'])
        setPlayerMoves(allPokemon[0][0]['moves']);
        setPlayerSprite(allPokemon[0][0]['backSprite']);
        setPlayerHp(allPokemon[0][0]['currentHp']);

        allEnemyPokemon.push(await createNewPokemon());
        setEnemyMoves(allEnemyPokemon[0][0]['moves']);
        setEnemySprite(allEnemyPokemon[0][0]['frontSprite']);
        console.log(allPokemon);
      }
    }, 150);


  }

  let currentPokemon = 0;

  let ScreenController = {
    opacity: opacity,
    display: display
  }

  let backgroundController = {
    display: backgroundDisplay,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover'
  }

  return (
    <div className="MainContainer">
      <div className="Console">
        <div className="Screen">
          <div className="OffScreen" style={ScreenController}>
          </div>
          <div className="OnScreen" style={backgroundController}>
            <div className="GameSprites">
              <div className="HpBar">
                <div className="PokemonInfo">
                    <h4>{playerPokemonName}</h4>
                  </div>
                <div className="Hp">
                  <h4>HP:</h4>
                  <div className="CurrentHp"></div>
                </div>
              </div>
              <img src={playerPokemonSprite} className="PlayerPokemon"></img>
              <img src={enemyPokemonSprite} className="EnemyPokemon"></img>
            </div>
            <div className="AttackBox">
              {playerPokemonMoves.map((item, index) => (
                <AttackSelector attackName = {item[0]} attackColor = {colorSelection(item[2])} attackType = {item[2]} attackDmg = {item[1]} attackClass = {item[3]}/>
              ))}
            </div>
          </div>
        </div>
        <div className="ButtonsContainer" onClick={changeOpacityState}>
          <div className="OnButton"></div>
          <div className="DPad">
            <div className="Horizontal"></div>
            <div className="Vertical"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AttackSelector(props){
  let attackStyle = {
    backgroundColor: props.attackColor
  }
  let attackClassImg = physicalMoveImage;
  if(props.attackClass == 'special'){
    attackClassImg = specialMoveImage;
  }
  return (
      <div key={props.attackName} className="AttackSelector" style={attackStyle}>
        <h3 className="AttackName">{props.attackName}</h3>
        <img src={attackClassImg} className="AttackClassImg"></img>
        <h3 className="AttackDmg">DMG:{props.attackDmg}</h3>
      </div>
  )
}

async function createNewPokemon() {
  let pokemonId = Math.floor(Math.random() * 151);

  if(pokemonId == 0 || pokemonId == 132){
    pokemonId = 1;
  }

  let pokemonInformation = await fetchPokemon(pokemonId);

  let pokemon = [
    {
      name: "",
      backSprite: "",
      frontSprite: "",
      type1: "",
      type2: "",
      moves: [],
      attackPower: 0,
      healthPower: 0,
      currentHp: 100
    }
  ]

  pokemon[0]['name'] = pokemonInformation['name'];
  pokemon[0]['backSprite'] = pokemonInformation['sprites']['back_default'];
  pokemon[0]['frontSprite'] = pokemonInformation['sprites']['front_default'];
  pokemon[0]['type1'] = pokemonInformation['types'][0];

  if(pokemonInformation['types'].length > 1){
    pokemon[0]['type2'] = pokemonInformation['types'][1];
  }

  pokemon[0]['attackPower'] = pokemonInformation['stats'][1]['base_stat'] + pokemonInformation['stats'][3]['base_stat'];
  pokemon[0]['healthPower'] = pokemonInformation['stats'][0]['base_stat'] + pokemonInformation['stats'][2]['base_stat'] + pokemonInformation['stats'][4]['base_stat'];

  for (var i = 0; i < 4; i++) {
    let currentPokemonMoves = [];

    let randomMove = Math.floor(Math.random() * pokemonInformation['moves'].length + 1);

    while(randomMove == 0){
      randomMove = Math.floor(Math.random() * pokemonInformation['moves'].length + 1);
    }

    let moveInformation = await fetchMoves(randomMove);

    while(moveInformation['power'] == null || currentPokemonMoves.includes(moveInformation['name'])){
      randomMove = Math.floor(Math.random() * pokemonInformation['moves'].length + 1);
      moveInformation = await fetchMoves(randomMove);
    }

    currentPokemonMoves.push(moveInformation['name']);

    pokemon[0]['moves'].push([moveInformation['name'], moveInformation['power'], moveInformation['type']['name'], moveInformation['damage_class']['name']]);
  }
  
  return pokemon;
}

async function fetchPokemon(pokemonId) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  response = await response.json();
  return response;
}

async function fetchMoves(moveId) {
  let response = await fetch(`https://pokeapi.co/api/v2/move/${moveId}/`);
  response = await response.json();
  return response;
}

function colorSelection(type) {
  let color = 'Gray';
  switch (type) {
    case 'normal':
      color = 'Tan';
      break;
    case 'fighting':
      color = 'FireBrick';
      break;
    case 'flying':
      color = 'DeepSkyBlue';
      break;
    case 'poison':
      color = 'DarkSlateBlue';
      break;
    case 'ground':
      color = 'Sienna';
      break;
    case 'rock':
      color = 'SlateGray';
      break;
    case 'bug':
      color = 'OliveDrab';
      break;
    case 'ghost':
      color = 'DarkSlateGray';
      break;
    case 'steel':
      color = 'DimGray';
      break;
    case 'fire':
      color = 'Tomato';
      break;
    case 'water':
      color = 'DodgerBlue';
      break;
    case 'grass':
      color = 'ForestGreen';
      break;
    case 'electric':
      color = 'Gold';
      break;
    case 'psychic':
      color = 'MediumPurple';
      break;
    case 'ice':
      color = 'LightSkyBlue';
      break;
    case 'dragon':
      color = 'DarkOrange';
      break;
    default:
      color = 'Gray';
      break;
  }
  return color;
}

export default App;
