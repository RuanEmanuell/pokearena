import './App.css';
import { useState } from 'react';
import specialMoveImage from './public/specialmove.png';
import physicalMoveImage from './public/physicalmove.png';
import pokemonBackgroundImage from './public/background.png';

let pokemon = [];
let currentPokemon = 0;
let enemyCurrentPokemon = 3;

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
    console.log(pokemon[currentPokemon][1][0][1]);
    pokemon[enemyCurrentPokemon][6] = (pokemon[enemyCurrentPokemon][6] - pokemon[currentPokemon][1][0][1]);
  }

  const [playerImage, setPlayerImage] = useState(props.pokemon[currentPokemon][3]);
  const [enemyImage, setEnemyImage] = useState(props.pokemon[3][2]);

  const changePlayerPokemon = (newPokemonIndex) => {
    setPlayerImage(props.pokemon[newPokemonIndex][3]);
    currentPokemon = newPokemonIndex;
  };

  let SquareBoxStyle = {
    backgroundImage: `url(${pokemonBackgroundImage})`
  }


  return (
    <div>
      <ChooseBox pokemon={props.pokemon} changePlayerPokemon={changePlayerPokemon} />
      <div className="SquareContainer">
        <div className="SquareBox" style={SquareBoxStyle}>
          <div>
            <PokemonStatsBox pokemon={props.pokemon} />
            <EnemyPokemonStatsBox pokemon={props.pokemon} />
            <img src={enemyImage} className="EnemyPokemonImg"></img>
            <img src={playerImage} className="PlayerPokemonImg"></img>
          </div>
          <AttackBox isAttacking={isAttacking} ToggleAttackLineView={toggleAttackLineView} />
        </div>
      </div>
    </div>
  );
}

function PokemonStatsBox(props) {
  let pokemonName = props.pokemon[currentPokemon][0];
  let pokemonHp = props.pokemon[currentPokemon][6];
  let pokemonType = props.pokemon[currentPokemon][7];
  let pokemonType2 = "";

  if (props.pokemon[currentPokemon].length === 9) {
    pokemonType2 = props.pokemon[currentPokemon][8];
  }


  let hpStyle = {
    width: `${pokemonHp}px`
  }

  let typeStyle = {
    color: colorSelection(pokemonType),
    textShadow: '1px 1px 1px black'
  }

  let type2Style = {
    color: colorSelection(pokemonType2),
    textShadow: '1px 1px 1px black'
  }

  pokemonType = pokemonType.toUpperCase();
  pokemonType2 = pokemonType2.toUpperCase();

  return (
    <div className="StatsBox">
      <div className="NameTypeBox">
        <p>{pokemonName}</p>
        <p style={typeStyle}>{pokemonType}</p>
        {props.pokemon[currentPokemon].length === 9 ? (
          <>
            <p>/</p>
            <p style={type2Style}>{pokemonType2}</p>
          </>
        ) : (
          <p></p>
        )}
      </div>
      <div className="HpBarContainer">
        <p>HP:</p>
        <div className="HpBar" style={hpStyle}>{pokemonHp}</div>
      </div>
    </div>
  )
}

function EnemyPokemonStatsBox(props) {
  let pokemonName = props.pokemon[enemyCurrentPokemon][0];
  let pokemonHp = props.pokemon[enemyCurrentPokemon][6];
  let pokemonType = props.pokemon[enemyCurrentPokemon][7];
  let pokemonType2 = "";

  if (props.pokemon[enemyCurrentPokemon].length === 9) {
    pokemonType2 = props.pokemon[enemyCurrentPokemon][8];
  }

  let hpStyle = {
    width: `${pokemonHp}px`
  }

  let typeStyle = {
    color: colorSelection(pokemonType),
    textShadow: '1px 1px 1px black'
  }

  let type2Style = {
    color: colorSelection(pokemonType2),
    textShadow: '1px 1px 1px black'
  }

  pokemonType = pokemonType.toUpperCase();
  pokemonType2 = pokemonType2.toUpperCase();

  return (
    <div className="StatsBox EnemyStatsBox">
      <div className="NameTypeBox">
        <p>{pokemonName}</p>
        <p style={typeStyle}>{pokemonType}</p>
        {props.pokemon[enemyCurrentPokemon].length === 9 ? (
          <>
            <p>/</p>
            <p style={type2Style}>{pokemonType2}</p>
          </>
        ) : (
          <p></p>
        )}
      </div>
      <div className="HpBarContainer">
        <p>HP:</p>
        <div className="HpBar" style={hpStyle}>{pokemonHp}</div>
      </div>
    </div>
  )
}

function AttackBox(props) {
  return (
    !props.isAttacking ? (
      <>
        <div className="AttackBox">
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={pokemon[currentPokemon][1][0]} />
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={pokemon[currentPokemon][1][1]} />
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={pokemon[currentPokemon][1][2]} />
          <AttackSelection toggleAttackLineView={props.ToggleAttackLineView} attacks={pokemon[currentPokemon][1][3]} />
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

  let typeColor = colorSelection(attackType);

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
  }

  let hintText = `
    ${attackName}
    Power: ${attackPower},
    Type: ${attackType},
    Class: ${attackClass}
    `


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
  const adjacentPokemonIndices = [1, 2, 0];

  const pokemon1 = props.pokemon[currentPokemon][2];
  const pokemon2 = props.pokemon[adjacentPokemonIndices[currentPokemon]][2];
  const pokemon3 = props.pokemon[adjacentPokemonIndices[adjacentPokemonIndices[currentPokemon]]][2];

  const changePokemon = (newIndex) => {
    props.changePlayerPokemon(newIndex);
  };

  return (
    <div className="ChooseContainer">
      <div className="ChooseBox">
        <div className="PokemonChoose">
          <img src={pokemon1} className="ChoosePokemonImg" onClick={() => changePokemon(currentPokemon)}></img>
        </div>
        <div className="PokemonChoose">
          <img src={pokemon2} className="ChoosePokemonImg" onClick={() => changePokemon(adjacentPokemonIndices[currentPokemon])}></img>
        </div>
        <div className="PokemonChoose">
          <img src={pokemon3} className="ChoosePokemonImg" onClick={() => changePokemon(adjacentPokemonIndices[adjacentPokemonIndices[currentPokemon]])}></img>
        </div>
      </div>
    </div>
  );
}



async function fetchPokemon() {
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * 151);

    while (random == 0 || random == 132) {
      random = Math.floor(Math.random() * 151);
    }

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
    let pokemonResponse = (await response.json());

    let move = [];

    for (let j = 0; j < 4; j++) {
      let randomAttack = Math.floor(Math.random() * pokemonResponse['moves'].length);
      let newMove = await fetchMove(pokemonResponse['moves'][randomAttack]['move']['url']);

      while (newMove[4] == 'status' || newMove[1] == null) {
        randomAttack = Math.floor(Math.random() * pokemonResponse['moves'].length);
        newMove = await fetchMove(pokemonResponse['moves'][randomAttack]['move']['url']);
      }

      move.push(newMove);
    }

    if (pokemonResponse['types'].length == 1) {
      pokemon.push([pokemonResponse['name'].toUpperCase(), move, pokemonResponse['sprites']['front_default'], pokemonResponse['sprites']['back_default'], pokemonResponse['stats'], pokemonResponse['moves'], 100, pokemonResponse['types'][0]['type']['name']]);
    } else {
      pokemon.push([pokemonResponse['name'].toUpperCase(), move, pokemonResponse['sprites']['front_default'], pokemonResponse['sprites']['back_default'], pokemonResponse['stats'], pokemonResponse['moves'], 100, pokemonResponse['types'][0]['type']['name'], pokemonResponse['types'][1]['type']['name']]);
    }

    console.log(pokemon);
  }
}

async function fetchMove(url) {
  let response = await fetch(url);
  let moveResponse = (await response.json());
  return [moveResponse['name'], moveResponse['power'], moveResponse['type']['name'], moveResponse['damage_class']['name']];
}

function colorSelection(type) {
  let color = 'grey';
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
