import './App.css';
import Connecter from './Connecter/Connecter';
import Creator from './Creator/Creator';
import { useState } from "react";
function App() {
  const [accounts, setAccounts] = useState('');
  const [isWhitelist, setWhitelist] = useState('');

  return (
    <div className="App">
           <img 
      src="https://raw.githubusercontent.com/glebzverev/nft-farm/main/base_collections/zombiepunks/zombiepunk0.png"
      // alt="new"
      />
        <Connecter
          accounts={accounts}
          setAccounts={setAccounts}
        />
      <header className="App-header">
        <p>
          NFT collection Factory
        </p>
        <p>
          For whitelist users
        </p>
      </header>
      <div className="App-body">
        <Creator 
          accounts={accounts}
        />
      </div>
    </div>
  );
}

export default App;
