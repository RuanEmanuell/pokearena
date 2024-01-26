import './App.css';
import { useState } from 'react';
import specialMoveImage from './public/specialmove.png';
import physicalMoveImage from './public/physicalmove.png';
import statusMoveImage from './public/statusmove.png';

let pokemon = [];
let move = [];

function App() {
  const [isMenuVisible, changeMenuVisibleState] = useState(true);

  const toggleStartMenu = async () => {
    await fetchPokemon();
    changeMenuVisibleState(current => !current);
  }

  return (
    <div className="App">
      {isMenuVisible ? <StartBattleMenu toggleStartMenu={toggleStartMenu} /> : <SquareBox pokemon={pokemon} />}
    </div>
  );
}

function StartBattleMenu(props) {
  return (
    <div className="TitleContainer">
      <h1>PokeBattle</h1>
      <button onClick={props.toggleStartMenu} className="StartButton">Iniciar</button>
    </div>
  )

}

function SquareBox(props) {
  const [isAttacking, changeAttackLine] = useState(false);

  const toggleAttackLineView = () => {
    changeAttackLine(current => !current);
  }


  return (
    <div className="SquareContainer">
      <div className="SquareBox">
        <div>
        <ChooseBox pokemon={props.pokemon}/>
        <img src={props.pokemon[1]['sprites']['front_default']} className="EnemyPokemonImg"></img>
        <img src={props.pokemon[0]['sprites']['back_default']} className="PlayerPokemonImg"></img>
        </div>
        <AttackBox isAttacking={isAttacking} ToggleAttackLineView={toggleAttackLineView} />
      </div>
    </div>
  );
}

function AttackBox(props) {
  return (
    !props.isAttacking ? (
      <>
        <div className="AttackBox">
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={move[0]} />
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={move[1]} />
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={move[2]} />
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={move[3]} />
          </div>
      </>
    ) : (
      <div></div>
    )

  );
}

function AttackSelection(props) {
  let attackName = props.attacks[0];
  let attackPower = props.attacks[1];
  let attackType = props.attacks[2];
  let attackClass = props.attacks[3];
  let typeColor;

  switch (attackType) {
    case 'normal':
      typeColor = 'Tan';
      break;
    case 'fighting':
      typeColor = 'FireBrick';
      break;
    case 'flying':
      typeColor = 'DeepSkyBlue';
      break;
    case 'poison':
      typeColor = 'DarkSlateBlue';
      break;
    case 'ground':
      typeColor = 'Sienna';
      break;
    case 'rock':
      typeColor = 'SlateGray';
      break;
    case 'bug':
      typeColor = 'OliveDrab';
      break;
    case 'ghost':
      typeColor = 'DarkSlateGray';
      break;
    case 'steel':
      typeColor = 'DimGray';
      break;
    case 'fire':
      typeColor = 'Tomato';
      break;
    case 'water':
      typeColor = 'DodgerBlue';
      break;
    case 'grass':
      typeColor = 'ForestGreen';
      break;
    case 'electric':
      typeColor = 'Gold';
      break;
    case 'psychic':
      typeColor = 'MediumPurple';
      break;
    case 'ice':
      typeColor = 'LightSkyBlue';
      break;
    case 'dragon':
      typeColor = 'DarkOrange';
      break;
    default:
      typeColor = 'Gray';
      break;
  }

  let typeStyle = {
    backgroundColor: typeColor
  }

  let attackClassImg;

  switch (attackClass) {
    case 'special':
      attackClassImg = specialMoveImage;
      break;
    case 'physical':
      attackClassImg = physicalMoveImage;
      break;
    case 'status':
      attackClassImg = statusMoveImage;
      break;
  }

  let hintText = "";

  if (attackClass != 'status') {
    hintText = `
    ${attackName}
    Power: ${attackPower},
    Type: ${attackType},
    Class: ${attackClass}
    `
  } else {
    hintText = `
    ${attackName}
    Type: ${attackType},
    Class: ${attackClass}
    `
  }

  hintText = hintText.toUpperCase();

  return (
    <div className="AttackSelector" style={typeStyle} onClick={props.toggleAttackLineView} title={hintText}>
      <p className="AttackName">{attackName}</p>
      <img src={attackClassImg} className='AttackClassImg'></img>
      <p className="AttackPower">{attackPower}</p>
    </div>
  )
}

function ChooseBox(props) {
  return (
    <div className="ChooseBox">
      <div className="PokemonChoose">
      <img src={props.pokemon[0]['sprites']['front_default']} className="ChoosePokemonImg"></img>
      </div>
      <div className="PokemonChoose">
      <img src={props.pokemon[3]['sprites']['front_default']} className="ChoosePokemonImg"></img>
      </div>
      <div className="PokemonChoose">
      <img src={props.pokemon[4]['sprites']['front_default']} className="ChoosePokemonImg"></img>
      </div>
    </div>
  )

}

async function fetchPokemon() {
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * 151);
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
    pokemon.push(await response.json());
    for (let j = 0; j < 4; j++) {
      let randomAttack = Math.floor(Math.random() * pokemon[i]['moves'].length)
      await fetchMove(pokemon[i]['moves'][randomAttack]['move']['url']);
    }
    console.log(pokemon[i]);
  }
}

async function fetchMove(url) {
  let response = await fetch(url);
  let moveResponse = (await response.json());
  move.push([moveResponse['name'], moveResponse['power'], moveResponse['type']['name'], moveResponse['damage_class']['name']]);
  //console.log(move)
}

export default App;
