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
import mp4 from "./assets/demo.mp4";
import cover from "./assets/cover.jpg";

const tronWeb = window.tronLink?.tronWeb

function App() {
  const {account, chainId, connect, switchNetwork} = useContext(Web3Context)
  const correct = chainId === 1
  return (
      <div>
        <div className="main">
          <header>
            <div className='logo' />
            <div className="header-actions">
              <a className="link" href="https://twitter.com/HeartHunterDAO" target="_blank">Twitter</a>
              <a className="link-apenft" href="http://apenft.org/" target="_blank" title="apenft"></a>
              {
                  !tronWeb && <Button><a href="https://www.tronlink.org/" target="_blank">Install TronLink</a></Button>
              }

              {
                  !!tronWeb && (correct || !account) && <Button size="S" onClick={account ? () => {} : connect} >
                    {account ? truncateAddress(account) : 'CONNECT WALLET'}
                  </Button>
              }
              {
                  !!tronWeb && !correct && chainId && <Button size="S" onClick={switchNetwork} danger >
                    SWITCH NETWORK
                  </Button>
              }
            </div>
          </header>
          <Outlet/>
          <div className="partner">
                <h3>PARTNER</h3>
                <div className="partner-links">
                    <a className="link-tron" href="https://tron.network/" target="_blank" title="tron network"></a>
                    <a className="link-apenft" href="http://apenft.org/" target="_blank" title="apenft"></a>
                </div>
          </div>
        </div>
        <video className="video"
               autoPlay
               muted={true}
               poster={cover}
               src={mp4}
               loop
               preload="auto"
               playsInline
               controls={false}
        />
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
