import './App.css';
import { useState, useEffect } from 'react';
import backgroundImage from './public/background.png';

function App() {
  const [opacity, setOpacity] = useState('1');
  const [display, setDisplay] = useState('block');
  const [backgroundDisplay, setBackgroundDisplay] = useState('none');
  const [playerPokemonSprite, setPlayerSprite] = useState("");
  const [playerPokemonMoves, setPlayerMoves] = useState([]);

  const changeOpacityState = () => {
    if (opacity === '1') {
      setOpacity('0');
      setTimeout(async function () {
        setDisplay('none');
        setBackgroundDisplay('block');
        let pokemonInformation = await fetchPokemon(pokemonId);

        pokemon[0]['name'] = pokemonInformation['name'];
        pokemon[0]['backSprite'] = pokemonInformation['sprites']['back_default'];

        for (var i = 0; i < 4; i++) {
          let randomMove = Math.floor(Math.random(1) * pokemonInformation['moves'].length);
          let moveInformation = await fetchMoves(randomMove);
          pokemon[0]['moves'].push([moveInformation['name'], moveInformation['power'], moveInformation['type']['name']]);
        }
        setPlayerMoves(pokemon[0]['moves']);
        setPlayerSprite(pokemon[0]['backSprite']);
      }, 150);
    } else {
      setOpacity('1');
      setTimeout(function () {
        setDisplay('block');
        setBackgroundDisplay('none');
      }, 150);
    }

  }

  let pokemonId = Math.floor(Math.random(1) * 151);

  let pokemon = [
    {
      name: "",
      backSprite: "",
      frontSprite: "",
      moves: [],
    }
  ]

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
              <img src={playerPokemonSprite} className="PlayerPokemon"></img>
            </div>
            <div className="AttackBox">
              {playerPokemonMoves.map((item, index) => (
                <div key={item} className="AttackSelector">
                  <h3>{item[0]}</h3>
                </div>
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

export default App;
