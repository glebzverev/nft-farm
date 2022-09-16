import './App.css';
import Connecter from './Connecter/Connecter';
import Creator from './Creator/Creator';
import { useState } from "react";
function App() {
  const [accounts, setAccounts] = useState('');
  const [isWhitelist, setWhitelist] = useState('');
  const [image, setImage] = useState('https://raw.githubusercontent.com/glebzverev/nft-farm/main/base_collections/punks/punk100.png');
  
  return (
    <div className="App">
      <img 
        align="right"
        src={image}
        flex= "1"
        width= "50"
        height= "50"
        resizeMode= 'contain' 
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
