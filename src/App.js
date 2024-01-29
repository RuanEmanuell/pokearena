import './App.css';
import { useState, useEffect } from 'react';
import backgroundImage from './public/background.png';
import physicalMoveImage from './public/physicalmove.png';
import specialMoveImage from './public/specialmove.png';

let allPokemon = [];
let allEnemyPokemon = [];

function App() {
  //State manegement
  const [opacity, setOpacity] = useState('1');
  const [display, setDisplay] = useState('block');
  const [backgroundDisplay, setBackgroundDisplay] = useState('none');
  const [attackSelectorDisplay, setAttackSelectorDisplay] = useState('grid');
  const [currentMessage, setCurrentMessage] = useState('');


  const [playerPokemonName, setPlayerName] = useState("");
  const [playerPokemonSprite, setPlayerSprite] = useState("");
  const [playerPokemonMoves, setPlayerMoves] = useState([]);
  const [playerPokemonHp, setPlayerHp] = useState(100);
  const [playerPokemonType1, setPlayerType1] = useState("");
  const [playerPokemonType2, setPlayerType2] = useState("");
  const [playerPokemonHpColor, setPlayerHpColor] = useState('green');

  const [enemyPokemonName, setEnemyName] = useState("");
  const [enemyPokemonHp, setEnemyHp] = useState(100);
  const [enemyPokemonSprite, setEnemySprite] = useState("");
  const [enemyPokemonMoves, setEnemyMoves] = useState([]);
  const [enemyPokemonType1, setEnemyType1] = useState("");
  const [enemyPokemonType2, setEnemyType2] = useState("");
  const [enemyPokemonHpColor, setEnemyHpColor] = useState('green');

  const TurnOnOff = () => {
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
        setPlayerType1(allPokemon[0][0]['type1']);
        setPlayerType2(allPokemon[0][0]['type2']);

        allEnemyPokemon.push(await createNewPokemon());
        setEnemyName(allEnemyPokemon[0][0]['name'])
        setEnemyMoves(allEnemyPokemon[0][0]['moves']);
        setEnemySprite(allEnemyPokemon[0][0]['frontSprite']);
        setEnemyHp(allEnemyPokemon[0][0]['currentHp']);
        setEnemyType1(allEnemyPokemon[0][0]['type1']);
        setEnemyType2(allEnemyPokemon[0][0]['type2']);
      }
    }, 150);
  }

  
  const attackClick = (attackName, attackType, attackDmg) => {
    let subtractionDmg = attackDmg;
    allEnemyPokemon[0][0]['currentHp'] = allEnemyPokemon[0][0]['currentHp'] - subtractionDmg;
    
    if (allEnemyPokemon[0][0]['currentHp'] < 0) {
      allEnemyPokemon[0][0]['currentHp']  = 0;
    }

    let newEnemyHp = allEnemyPokemon[0][0]['currentHp'];

    let newEnemyHpColor = 'red'

    if(newEnemyHp > 50){
      newEnemyHpColor = 'green';
    }else if (newEnemyHp > 20){
      newEnemyHpColor = 'yellow';
    }

    let screenMessage = `${playerPokemonName} uses ${attackName}!`

    setAttackSelectorDisplay('none');
    setCurrentMessage(screenMessage);
    setEnemyHp(newEnemyHp);
    setEnemyHpColor(newEnemyHpColor);

    setTimeout(() => {  
      let enemyAttackDmg = enemyAttack()[0];
      let enemyAttackName = enemyAttack()[1];

      allPokemon[0][0]['currentHp'] = allPokemon[0][0]['currentHp'] - enemyAttackDmg;

      if (allPokemon[0][0]['currentHp'] < 0) {
        allPokemon[0][0]['currentHp']  = 0;
      }

      let newPlayerHp = allPokemon[0][0]['currentHp'];

      let newPlayerHpColor = 'red'

      if(newPlayerHp > 50){
        newPlayerHpColor = 'green';
      }else if (newPlayerHp > 20){
        newPlayerHpColor = 'yellow';
      }

      screenMessage = `${enemyPokemonName} uses ${enemyAttackName}!`
      setCurrentMessage(screenMessage);
      setPlayerHp(newPlayerHp);
      setPlayerHpColor(newPlayerHpColor);
      enemyAttack();
    }, 1000);

    setTimeout(() => {
      setAttackSelectorDisplay('grid');
    }, 2000);
  }

  const enemyAttack = () =>{
    let maxDmgAttack = 0;
    let selectedAttack = 0;
    let selectedAttackInformations = [];
    for(var i=0; i<allEnemyPokemon[0][0]['moves'].length; i++){
      if(allEnemyPokemon[0][0]['moves'][i][1] > maxDmgAttack){
        maxDmgAttack = allEnemyPokemon[0][0]['moves'][i][1];
        selectedAttack = allEnemyPokemon[0][0]['moves'][i][0];
      } 
    }
    selectedAttackInformations.push(maxDmgAttack, selectedAttack);

    return selectedAttackInformations;
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
                <PokemonInfo pokemonName={playerPokemonName} pokemonType1={playerPokemonType1} pokemonType2={playerPokemonType2} />
                <HpInfo pokemonHp={playerPokemonHp} hpColor={playerPokemonHpColor}/>
              </div>
              <div className="HpBar EnemyBar">
                <PokemonInfo pokemonName={enemyPokemonName} pokemonType1={enemyPokemonType1} pokemonType2={enemyPokemonType2} />
                <HpInfo pokemonHp={enemyPokemonHp} hpColor={enemyPokemonHpColor}/>
              </div>
              <img src={playerPokemonSprite} className="PlayerPokemon"></img>
              <img src={enemyPokemonSprite} className="EnemyPokemon"></img>
            </div>
            <div className="AttackBox">
              {attackSelectorDisplay === 'grid' ?
              <>
              {playerPokemonMoves.map((item, index) => (
                <AttackSelector key = {index} 
                attackName={item[0]} attackColor={colorSelection(item[2])} 
                attackType={item[2]} attackDmg={item[1]} attackClass={item[3]} 
                attackClick = {attackClick}/>
              ))}
              </>
              : <div>
                <h4 className="ScreenMessage">{currentMessage}</h4>
                </div>}
            </div>
          </div>
        </div>
        <ConsoleButtons TurnOnOff={TurnOnOff} />
      </div>
    </div>
  )
}

//Components
function AttackSelector({attackName, attackColor, attackDmg, attackClass, attackType, attackClick}) {

  let attackStyle = {
    backgroundColor: attackColor
  }

  let attackClassImg = physicalMoveImage;

  if (attackClass == 'special') {
    attackClassImg = specialMoveImage;
  }

  return (
    <div className="AttackSelector" style={attackStyle} onClick = {() => attackClick(attackName, attackType, attackDmg)}>
      <h3 className="AttackName">{attackName}</h3>
      <img src={attackClassImg} className="AttackClassImg"></img>
      <h3 className="AttackDmg">DMG:{attackDmg}</h3>
    </div>
  )
}

function PokemonInfo({ pokemonName, pokemonType1, pokemonType2 }) {
  let typeStyle = {
    color: colorSelection(pokemonType1)
  }
  let typeStyle2 = {
    color: colorSelection(pokemonType2)
  }
  return (<div className="PokemonInfo">
    <h4 className="PokemonName">{pokemonName}</h4>
    <div className="TypeInfo">
      <h4 style={typeStyle}>{pokemonType1}</h4>
      {pokemonType2 != "" ? <>
        <h4>/</h4>
        <h4 style={typeStyle2}>{pokemonType2}</h4>
      </> : <div></div>}
    </div>
  </div>);
}

function HpInfo({pokemonHp, hpColor}) {
  let hpStyle = {
    width: `${pokemonHp}%`,
    backgroundColor: `${hpColor}`
  }
  return (<div className="Hp">
    <h4>HP:</h4>
    <div className="TotalHp">
      <div className="CurrentHp" style={hpStyle}></div>
    </div>
  </div>);
}

function ConsoleButtons({ TurnOnOff }) {
  return (<div className="ButtonsContainer">
    <div className="OnButton" onClick={TurnOnOff}></div>
    <div className="DPad">
      <div className="Horizontal"></div>
      <div className="Vertical"></div>
    </div>
  </div>);
}

//Game functions


//Create Pokemon / Visual functions
async function createNewPokemon() {
  let pokemonId = Math.floor(Math.random() * 151);

  if (pokemonId == 0 || pokemonId == 132) {
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
  pokemon[0]['type1'] = pokemonInformation['types'][0]['type']['name'];

  if (pokemonInformation['types'].length > 1) {
    pokemon[0]['type2'] = pokemonInformation['types'][1]['type']['name'];
  }

  pokemon[0]['attackPower'] = pokemonInformation['stats'][1]['base_stat'] + pokemonInformation['stats'][3]['base_stat'];
  pokemon[0]['healthPower'] = pokemonInformation['stats'][0]['base_stat'] + pokemonInformation['stats'][2]['base_stat'] + pokemonInformation['stats'][4]['base_stat'];

  let currentPokemonMoves = [];

  for (var i = 0; i < 4; i++) {

    let randomMove = Math.floor(Math.random() * pokemonInformation['moves'].length + 1);

    while (randomMove == 0) {
      randomMove = Math.floor(Math.random() * pokemonInformation['moves'].length + 1);
    }

    let moveInformation = await fetchMoves(randomMove);

    while (moveInformation['power'] == null || currentPokemonMoves.includes(moveInformation['name'])) {
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