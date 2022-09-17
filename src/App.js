import './App.css';
import Connecter from './Connecter/Connecter';
import Creator from './Creator/Creator';
import Valve from './Valve/Valve';
import { useState } from "react";
function App() {
  const [accounts, setAccounts] = useState('');
  const [isWhitelist, setWhitelist] = useState('');
  const [mode, setMode] = useState('NFT');
  const isNFT = Boolean(mode == 'NFT');
  const isValve = Boolean(mode == 'Valve');
 
  function changeSelect() {
    setMode(document.getElementById('Mode').value);
  }

  return (
      <div className="App">
      <select id='Mode' value={mode} onChange={changeSelect}>
        <option>NFT</option>
        <option>Valve</option>
      </select>
        <Connecter
          accounts={accounts}
          setAccounts={setAccounts}
        />
        {
          isNFT &&
          <div className="App-body">
            <p>
              NFT collection Factory
            </p>
            <p>
              For whitelist users
            </p>
            <Creator accounts={accounts}/>
          </div>
        }
        {
          isValve &&
          <div className="App-body">
            <p>
              NFT Collection revenue mechanism for XLA token
            </p>
            <p>
                Just input collection name and sum to split revenue
            </p>
          <Valve />
          </div>
        }    
    </div>)
}

export default App;
