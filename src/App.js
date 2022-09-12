import logo from './logo.svg';
import './App.css';
import Connecter from './Connecter/Connecter';
import Creator from './Creator/Creator';
import { useState } from "react";
function App() {
  const [accounts, setAccounts] = useState('');

  return (
    <div className="App">
        <Connecter
          accounts={accounts}
          setAccounts={setAccounts}
        />
      <header className="App-header">
        <p>
          NFT collection Factory
        </p>
        <p>
          For whitelist User
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
