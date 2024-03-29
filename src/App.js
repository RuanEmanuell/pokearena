import './App.css';
import { useState, useEffect } from 'react';
import backgroundImage from './public/background.png';
import physicalMoveImage from './public/physicalmove.png';
import specialMoveImage from './public/specialmove.png';
import consoleButton from './public/button.png';

let allPokemon = [];
let allEnemyPokemon = [];

function App() {
  //State manegement
  const [opacity, setOpacity] = useState('1');
  const [display, setDisplay] = useState('block');
  const [backgroundDisplay, setBackgroundDisplay] = useState('none');
  const [attackSelectorDisplay, setAttackSelectorDisplay] = useState('grid');
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentMessage2, setCurrentMessage2] = useState('');
  const [currentMessage3, setCurrentMessage3] = useState('');

  const [playerPokemonName, setPlayerName] = useState("");
  const [playerPokemonSprite, setPlayerSprite] = useState("");
  const [playerPokemonMoves, setPlayerMoves] = useState([]);
  const [playerPokemonHp, setPlayerHp] = useState(100);
  const [playerPokemonType1, setPlayerType1] = useState("");
  const [playerPokemonType2, setPlayerType2] = useState("");
  const [playerPokemonHpColor, setPlayerHpColor] = useState('green');
  const [currentPlayerPokemon, setPlayerCurrentPokemon] = useState(-1);
  const [playerVisible, setPlayerVisible] = useState('visible');
  const [playerOpacity, setPlayerOpacity] = useState('1');
  const [playerPokemonBox, setPlayerPokemonBox] = useState([]);

  const [enemyPokemonName, setEnemyName] = useState("");
  const [enemyPokemonHp, setEnemyHp] = useState(100);
  const [enemyPokemonSprite, setEnemySprite] = useState("");
  const [enemyPokemonMoves, setEnemyMoves] = useState([]);
  const [enemyPokemonType1, setEnemyType1] = useState("");
  const [enemyPokemonType2, setEnemyType2] = useState("");
  const [enemyPokemonHpColor, setEnemyHpColor] = useState('green');
  const [currentEnemyPokemon, setEnemyCurrentPokemon] = useState(-1);
  const [enemyVisible, setEnemyVisible] = useState('visible');
  const [enemyOpacity, setEnemyOpacity] = useState('1');
  const [enemyPokemonBox, setEnemyPokemonBox] = useState([]);


  const TurnOnOff = () => {
    if (opacity === '1') {
      setOpacity('0');
      allPokemon = [];
      allEnemyPokemon = [];
      setCurrentMessage('');
      setCurrentMessage2('');
      setCurrentMessage3('');
      setEnemyCurrentPokemon(-1);
      setPlayerCurrentPokemon(-1);
      setPlayerHp(100);
      setEnemyHp(100);
      setPlayerHpColor('green');
      setEnemyHpColor('green');
      setPlayerPokemonBox([]);
      setEnemyPokemonBox([]);
    } else {
      setOpacity('1');
      setAttackSelectorDisplay('grid');
    }
    setTimeout(async function () {
      if (opacity == '0') {
        setDisplay('block');
        setBackgroundDisplay('none');
      } else {
        setDisplay('none');
        setBackgroundDisplay('block');
        await generateNewPokemon(true, true);
        await generateNewPokemon(false, true);
      }
    }, 150);
  }


  const attackClick = (attackName, attackType, attackDmg) => {
    let isGameOver = false;
    let subtractionDmg = calculateAttackDmg(attackType, attackDmg, allEnemyPokemon[currentEnemyPokemon]['type1'], allEnemyPokemon[currentEnemyPokemon]['type2'], allEnemyPokemon[currentEnemyPokemon]['attackPower']);

    setEnemyVisible('hidden');

    setTimeout(() => {
      setEnemyVisible('visible');
    }, 200);

    allEnemyPokemon[currentEnemyPokemon]['currentHp'] = allEnemyPokemon[currentEnemyPokemon]['currentHp'] - subtractionDmg;

    let screenMessage = `${playerPokemonName} uses ${attackName}!`
    let screenMessage2 = 'Now its your rival turn!'
    let screenMessage3 = '';
    if (subtractionDmg > 50) {
      if (allEnemyPokemon[currentEnemyPokemon]['currentHp'] > 0) {
        screenMessage3 = screenMessage2;
      }
      screenMessage2 = 'Its super effective!'
    } else if (subtractionDmg < 20) {
      if (allEnemyPokemon[currentEnemyPokemon]['currentHp'] > 0) {
        screenMessage3 = screenMessage2;
      }
      screenMessage2 = 'Its not very effective!'
    }
    setCurrentMessage3(screenMessage3);

    if (allEnemyPokemon[currentEnemyPokemon]['currentHp'] <= 0) {
      allEnemyPokemon[currentEnemyPokemon]['currentHp'] = 0;
      if (screenMessage3 == '') {
        screenMessage2 = `${enemyPokemonName} fainted!`
      } else {
        screenMessage3 = `${enemyPokemonName} fainted!`;
      }
    }

    let newEnemyHp = allEnemyPokemon[currentEnemyPokemon]['currentHp'];

    let newEnemyHpColor = 'red'

    if (newEnemyHp > 50) {
      newEnemyHpColor = 'green';
    } else if (newEnemyHp > 20) {
      newEnemyHpColor = 'yellow';
    }

    setAttackSelectorDisplay('none');
    setCurrentMessage(screenMessage);
    setCurrentMessage2(screenMessage2);
    setEnemyHp(newEnemyHp);
    setEnemyHpColor(newEnemyHpColor);

    if (allEnemyPokemon[currentEnemyPokemon]['currentHp'] > 0) {
      setTimeout(() => {
        let enemyAttackDmg = calculateAttackDmg(attackType, enemyAttack()[0], enemyAttack[2], allPokemon[currentPlayerPokemon]['type1'], allEnemyPokemon[currentEnemyPokemon]['type2'], allPokemon[currentPlayerPokemon]['attackPower']);
        let enemyAttackName = enemyAttack()[1];

        setPlayerVisible('hidden');

        setTimeout(() => {
          setPlayerVisible('visible');
        }, 500);

        allPokemon[currentPlayerPokemon]['currentHp'] = allPokemon[currentPlayerPokemon]['currentHp'] - enemyAttackDmg;

        screenMessage2 = 'What are you doing next?'
        let screenMessage3 = '';
        if (subtractionDmg > 50) {
          if (allPokemon[currentPlayerPokemon]['currentHp'] > 0) {
            screenMessage3 = screenMessage2;
          }
          screenMessage2 = 'Its super effective!'
        } else if (subtractionDmg < 20) {
          if (allPokemon[currentPlayerPokemon]['currentHp'] > 0) {
            screenMessage3 = screenMessage2;
          }
          screenMessage2 = 'Its not very effective!'
        }
        setCurrentMessage3(screenMessage3);

        if (allPokemon[currentPlayerPokemon]['currentHp'] <= 0) {
          allPokemon[currentPlayerPokemon]['currentHp'] = 0;
          if (screenMessage3 == '') {
            screenMessage2 = `${playerPokemonName} fainted!`
          } else {
            screenMessage3 = `${playerPokemonName} fainted!`;
          }
        }

        let newPlayerHp = allPokemon[currentPlayerPokemon]['currentHp'];

        let newPlayerHpColor = 'red'

        if (newPlayerHp > 50) {
          newPlayerHpColor = 'green';
        } else if (newPlayerHp > 20) {
          newPlayerHpColor = 'yellow';
        }

        screenMessage = `${enemyPokemonName} uses ${enemyAttackName}!`
        setCurrentMessage(screenMessage);
        setCurrentMessage2(screenMessage2);
        setPlayerHp(newPlayerHp);
        setPlayerHpColor(newPlayerHpColor);
      }, 1000);
    }

    setTimeout(() => {

      if (allPokemon[currentPlayerPokemon]['currentHp'] == 0) {
        if (allPokemon.length < 3) {
          setPlayerOpacity('0');
          setTimeout(async () => {
            await generateNewPokemon(true);
            setPlayerOpacity('1');
            setTimeout(() => {
              screenMessage3 = `I choose you, ${allPokemon[currentPlayerPokemon + 1]['name']}!`;
              setCurrentMessage3(screenMessage3);
            }, 1000);
          }, 2000);
        } else {
          screenMessage3 = 'You lose! Restart the game to play again!';
          setCurrentMessage3(screenMessage3);
          isGameOver = true;
        }
      }
      if (allEnemyPokemon[currentEnemyPokemon]['currentHp'] == 0) {
        if (allEnemyPokemon.length < 3) {
          setEnemyOpacity('0');
          setTimeout(async () => {
            await generateNewPokemon(false);
            setEnemyOpacity('1');
            setTimeout(() => {
              screenMessage3 = `Your next opponent is ${allEnemyPokemon[currentEnemyPokemon + 1]['name']}!`;
              setCurrentMessage3(screenMessage3);
            }, 1000);
          }, 2000);
        } else {
          screenMessage3 = 'You won! Restart the game to play again!';
          setCurrentMessage3(screenMessage3);
          isGameOver = true;
        }
      }
    }, 2000);

    setTimeout(() => {
      if (!isGameOver) {
        setAttackSelectorDisplay('grid');
      } else {
        TurnOnOff();
      }
    }, 6000);
  }

  const enemyAttack = () => {
    let maxDmgAttack = 0;
    let selectedAttack = 0;
    let selectedAttackInformations = [];
    let attackType = '';
    for (var i = 0; i < allEnemyPokemon[currentEnemyPokemon]['moves'].length; i++) {
      if (allEnemyPokemon[currentEnemyPokemon]['moves'][i][1] > maxDmgAttack) {
        maxDmgAttack = allEnemyPokemon[currentEnemyPokemon]['moves'][i][1];
        selectedAttack = allEnemyPokemon[currentEnemyPokemon]['moves'][i][0];
        attackType = allEnemyPokemon[currentEnemyPokemon]['moves'][i][2];
      }
    }
    
    selectedAttackInformations.push(maxDmgAttack, selectedAttack, attackType);

    return selectedAttackInformations;
  }

  const generateNewPokemon = async (isPlayer) => {
    if (isPlayer) {
      allPokemon.push(await createNewPokemon());
      let newCurrentPokemon = currentPlayerPokemon + 1;
      let newPokemonBox = playerPokemonBox;
      if (newCurrentPokemon > 0 && allPokemon.length < 2) {
        newCurrentPokemon = 0;
        newPokemonBox = [];
      }
      newPokemonBox.push(allPokemon[newCurrentPokemon]['frontSprite']);
      setPlayerCurrentPokemon(newCurrentPokemon);
      setPlayerName(allPokemon[newCurrentPokemon]['name'])
      setPlayerMoves(allPokemon[newCurrentPokemon]['moves']);
      setPlayerSprite(allPokemon[newCurrentPokemon]['backSprite']);
      setPlayerHp(allPokemon[newCurrentPokemon]['currentHp']);
      setPlayerHpColor('green');
      setPlayerType1(allPokemon[newCurrentPokemon]['type1']);
      setPlayerType2(allPokemon[newCurrentPokemon]['type2']);
      setPlayerPokemonBox(newPokemonBox);
    } else {
      allEnemyPokemon.push(await createNewPokemon());
      let newCurrentEnemyPokemon = currentEnemyPokemon + 1;
      let newEnemyPokemonBox = enemyPokemonBox;
      if (newCurrentEnemyPokemon > 0 && allEnemyPokemon.length < 2) {
        newCurrentEnemyPokemon = 0;
        newEnemyPokemonBox = [];
      }
      newEnemyPokemonBox.push(allEnemyPokemon[newCurrentEnemyPokemon]['frontSprite']);
      setEnemyCurrentPokemon(newCurrentEnemyPokemon);
      setEnemyName(allEnemyPokemon[newCurrentEnemyPokemon]['name'])
      setEnemyMoves(allEnemyPokemon[newCurrentEnemyPokemon]['moves']);
      setEnemySprite(allEnemyPokemon[newCurrentEnemyPokemon]['frontSprite']);
      setEnemyHpColor('green');
      setEnemyHp(allEnemyPokemon[newCurrentEnemyPokemon]['currentHp']);
      setEnemyType1(allEnemyPokemon[newCurrentEnemyPokemon]['type1']);
      setEnemyType2(allEnemyPokemon[newCurrentEnemyPokemon]['type2']);
      setEnemyPokemonBox(newEnemyPokemonBox);
    }
  }

  let ScreenController = {
    opacity: opacity,
    display: display
  }

  let backgroundController = {
    display: backgroundDisplay,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover'
  }

  let PlayerImgController = {
    visibility: playerVisible,
    opacity: playerOpacity
  }

  let EnemyImgController = {
    visibility: enemyVisible,
    opacity: enemyOpacity
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
                <HpInfo pokemonHp={playerPokemonHp} hpColor={playerPokemonHpColor} />
                <div className="PokemonBoxContainer">
                  <div className="PokemonBox">
                    {playerPokemonBox.map((item, index) => (
                      <img key={index} src={item}></img>
                    ))}
                  </div>
                </div>
              </div>
              <div className="HpBar EnemyBar">
                <PokemonInfo pokemonName={enemyPokemonName} pokemonType1={enemyPokemonType1} pokemonType2={enemyPokemonType2} />
                <HpInfo pokemonHp={enemyPokemonHp} hpColor={enemyPokemonHpColor} />
                <div className="PokemonBoxContainer">
                  <div className="PokemonBox">
                    {enemyPokemonBox.map((item, index) => (
                      <img key={index} src={item}></img>
                    ))}
                  </div>
                </div>
              </div>
              <img src={playerPokemonSprite} className="PlayerPokemon" style={PlayerImgController}></img>
              <img src={enemyPokemonSprite} className="EnemyPokemon" style={EnemyImgController}></img>
            </div>
            <div className="AttackBox">
              {attackSelectorDisplay === 'grid' ?
                <>
                  {playerPokemonMoves.map((item, index) => (
                    <AttackSelector key={index}
                      attackName={item[0]} attackColor={colorSelection(item[2])}
                      attackType={item[2]} attackDmg={item[1]} attackClass={item[3]}
                      attackClick={attackClick} attackTitle={`
                      ${item[0]}
                      POWER: ${item[1]}
                      TYPE : ${item[2]}
                      CLASS: ${item[3]}
                      `.toUpperCase()} />
                  ))}
                </>
                : <div>
                  <h4 className="ScreenMessage">{currentMessage}</h4>
                  <h4 className="ScreenMessage">{currentMessage2}</h4>
                  <h4 className="ScreenMessage">{currentMessage3}</h4>
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
function AttackSelector({ attackName, attackColor, attackDmg, attackClass, attackType, attackClick, attackTitle }) {
  let attackStyle = {
    backgroundColor: attackColor
  }

  let attackClassImg = physicalMoveImage;

  if (attackClass == 'special') {
    attackClassImg = specialMoveImage;
  }

  return (
    <div className="AttackSelector" style={attackStyle} onClick={() => attackClick(attackName, attackType, attackDmg)} title={attackTitle}>
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

function HpInfo({ pokemonHp, hpColor }) {
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
    <div className="OnButton" onClick={TurnOnOff}>
      <img src={consoleButton} className="ConsoleButton"></img>
    </div>
    <div className="DPad">
      <div className="Horizontal"></div>
      <div className="Vertical"></div>
    </div>
  </div>);
}

//Game functions 
function calculateAttackDmg(attackType, attackDmg, type1, type2, pokemonPower) {
  if(pokemonPower/10 <= 0){
    attackDmg = attackDmg/2;
  }else{
    attackDmg = (pokemonPower / 10) + (attackDmg / 2);
  }

  if (checkTypeAdvantage(attackType, type1, type2) == 1) {
    attackDmg = attackDmg * 2;
  } else if (checkTypeAdvantage(attackType, type1, type2) == 2) {
    attackDmg = attackDmg * 4;
  }

  if(!attackDmg>0){
    attackDmg = (Math.random() * 99) + 1;
  }

  return attackDmg;
}

function checkTypeAdvantage(attackType, type1, type2) {
  let isTypeAdvantage = 0;

  let typesAdvantage = [
    { 'fairy': ['fight', 'dragon', 'dark'] },
    { 'fighting': ['normal', 'ice', 'rock', 'dark', 'steel'] },
    { 'flying': ['fighting', 'bug', 'grass'] },
    { 'poison': ['grass', 'fighting'] },
    { 'ground': ['fire', 'electric', 'poison', 'rock', 'steel'] },
    { 'rock': ['ice', 'flying', 'bug', 'fire'] },
    { 'bug': ['grass', 'psychic', 'dark'] },
    { 'ghost': ['ghost', 'psychic'] },
    { 'steel': ['ice', 'rock', 'fairy'] },
    { 'fire': ['grass', 'ice', 'bug', 'steel'] },
    { 'water': ['fire', 'rock', 'ground'] },
    { 'grass': ['water', 'ground', 'rock'] },
    { 'electric': ['water', 'flying'] },
    { 'psychic': ['fighting', 'poison'] },
    { 'ice': ['grass', 'ground', 'flying', 'dragon'] },
    { 'dragon': ['dragon'] },
    { 'dark': ['psychic', 'ghost'] }
  ];

  for (var i = 0; i < typesAdvantage.length; i++) {
    if (typesAdvantage[i][attackType] != undefined) {
      if (typesAdvantage[i][attackType].includes(type1)) {
        isTypeAdvantage = 1;
      }
      if (typesAdvantage[i][attackType].includes(type2) && type2 != '') {
        isTypeAdvantage = 2;
      }
    }
  }

  return isTypeAdvantage;
}

//Create Pokemon / Visual functions
async function createNewPokemon() {
  let pokemonId = Math.floor(Math.random() * 151);

  if (pokemonId == 0 || pokemonId == 132) {
    pokemonId = 1;
  }

  let pokemonInformation = await fetchPokemon(pokemonId);

  let pokemon =
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


  pokemon['name'] = pokemonInformation['name'];
  pokemon['backSprite'] = pokemonInformation['sprites']['back_default'];
  pokemon['frontSprite'] = pokemonInformation['sprites']['front_default'];
  pokemon['type1'] = pokemonInformation['types'][0]['type']['name'];

  if (pokemonInformation['types'].length > 1) {
    pokemon['type2'] = pokemonInformation['types'][1]['type']['name'];
  }

  pokemon['attackPower'] = pokemonInformation['stats'][1]['base_stat'] + pokemonInformation['stats'][3]['base_stat'];
  pokemon['healthPower'] = pokemonInformation['stats'][0]['base_stat'] + pokemonInformation['stats'][2]['base_stat'] + pokemonInformation['stats'][4]['base_stat'];

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

    pokemon['moves'].push([moveInformation['name'], moveInformation['power'], moveInformation['type']['name'], moveInformation['damage_class']['name']]);
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