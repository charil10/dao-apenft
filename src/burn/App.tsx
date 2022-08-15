import {Web3Context, Web3ContextProvider} from '../share/context/web3-context'
import './App.css'
import './index.css'
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import Home from "./pages/home";
import Button from "./components/button"
import {useContext} from "react";
import { truncateAddress } from "./utils";

function App() {
  const {account, chainId, connect, switchNetwork} = useContext(Web3Context)
  const correct = chainId === 1
  return (
    <div>
      <div className="main">
        <header>
          <div className="header-main">
            <div className='logo' />
            <div className="header-actions">
              <a className="link" href="https://twitter.com/HeartHunterDAO" target="_blank">Twitter</a>
              <a className="link" href="https://opensea.io/collection/love-loves-to-love-love" target="_blank">Opensea</a>
              {
                  (correct || !account) && <Button size="S" onClick={account ? () => {} : connect} >
                    {account ? truncateAddress(account) : 'CONNECT WALLET'}
                  </Button>
              }
              {
                  !correct && chainId && <Button size="S" onClick={switchNetwork} danger >
                    SWITCH NETWORK
                  </Button>
              }
            </div>
          </div>
        </header>
        <div className="container">
          <Outlet/>
        </div>
        <footer>
        </footer>
      </div>
    </div>
  )
}

export function Main() {
  return (
    <Web3ContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </Web3ContextProvider>
  )
}

export default App
