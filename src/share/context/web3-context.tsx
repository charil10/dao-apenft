import React, {useEffect, useState, useRef, PropsWithChildren} from 'react';
import { isString } from 'lodash-es';
import {JsonRpcProvider} from "@ethersproject/providers/src.ts/json-rpc-provider";
import {toHex} from "../../burn/utils";
import {config} from "../../burn/config";
import nftABI from "../../burn/abis/nft.json";

export interface Web3ContextValue {
  chainId?: number,
  account?: string | null,
  hex?: string | null,
  provider: JsonRpcProvider,
  connect: () => void,
  switchNetwork: () => void,
  nft?: any,
  // auction: Contract,
  updateContext?: (key: keyof Web3ContextValue | Partial<Web3ContextValue>, data?: any) => void
}

const provider = window.tronLink;
const tronLink = window.tronLink
const tronWeb = window.tronLink?.tronWeb

const switchNetwork = async (chainId?: number) => {
  if(chainId != 1) {
    await tronLink.request('wallet_switchEthereumChain', [{ chainId: toHex(1) }]);
  }
}

const connect = async () => {
  await tronLink.request({method: 'tron_requestAccounts'})
}

// const nft = new tronWeb.contract(nftABI, config.NFT)
// const auction = new ethers.Contract(config.AUCTION, auctionABI, provider)

function getInitialValue() {
  return {
    provider,
    connect,
    switchNetwork,
    // nft,
    // auction,
  };
}

export const Web3Context = React.createContext<Web3ContextValue>(getInitialValue());


export const Web3ContextProvider = (props: PropsWithChildren) => {

  const rerender = useState<{}>()[1]

  const updateContext = (key: keyof Web3ContextValue | Partial<Web3ContextValue>, data?: any) => {
    context.current = {
      ...context.current,
      ...(isString(key) ? { [key as keyof Web3ContextValue]: data } : key as Partial<Web3ContextValue>)
    }
    rerender({});
  }

  const context = useRef<Web3ContextValue>(Object.assign(getInitialValue(), {
    updateContext,
  }))

  const load= async () => {
    console.log('load');
    try {

      const account = tronWeb?.defaultAddress?.base58
      const hex = tronWeb?.defaultAddress?.hex

      console.log('account' , account);

      const nft = await tronWeb?.contract(nftABI, config.NFT)

      const host = tronWeb?.fullNode?.host || '';
      console.log(host);
      const chainId = host.includes('shasta') || host.includes('nileex') ? 9999: 1
      if(account) {
        updateContext?.({
          account: account.toLowerCase(),
          hex: hex.toLowerCase(),
          nft,
          chainId,
          // auction,
        } as Partial<Web3ContextValue>)
      }
    }catch (e) {
      console.log(e, 'error!!!!!');
      updateContext?.({
        account: null,
      } as Partial<Web3ContextValue>)
    }
  }

  useEffect(() => {
    load()





    window.addEventListener('message', function (e) {
      const action = e.data.message?.action;
      if(!action || action === 'tabReply' || action === 'tunnel') {
        return
      }
      console.log(action);
      if (e.data.message && action) {
          console.log("setAccount event", e.data.message)
          load()
      }
      // if (e.data.message && e.data.message.action == "tabReply") {
      //   console.log("tabReply event", e.data.message)
      //   if (e.data.message.data.data.node.chain == '_'){
      //     console.log("tronLink currently selects the main chain")
      //   }else{
      //     console.log("tronLink currently selects the side chain")
      //   }
      // }
      //
      // if (e.data.message && e.data.message.action == "setAccount") {
      //   console.log("setAccount event", e.data.message)
      //   console.log("current address:", e.data.message.data.address)
      //   load()
      // }
      //
      // if (e.data.message && e.data.message.action == "setNode") {
      //   console.log("setNode event", e.data.message)
      //   if (e.data.message.data.node.chain == '_'){
      //     console.log("tronLink currently selects the main chain")
      //   }else{
      //     console.log("tronLink currently selects the side chain")
      //   }
      //
      //   // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "connect") {
      //     console.log("connect event", e.data.message.isTronLink)
      //   }
      //
      //   // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "disconnect") {
      //     console.log("disconnect event", e.data.message.isTronLink)
      //   }
      //
      //   // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "accountsChanged") {
      //     console.log("accountsChanged event", e.data.message)
      //     console.log("current address:", e.data.message.data.address)
      //   }
      //
      //   // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "connectWeb") {
      //     console.log("connectWeb event", e.data.message)
      //     console.log("current address:", e.data.message.data.address)
      //   }
      //
      //   // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "accountsChanged") {
      //     console.log("accountsChanged event", e.data.message)
      //   }
      //
      //   // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "acceptWeb") {
      //     console.log("acceptWeb event", e.data.message)
      //   }
      //   // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "disconnectWeb") {
      //     console.log("disconnectWeb event", e.data.message)
      //   }
      //
      //   // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
      //   if (e.data.message && e.data.message.action == "rejectWeb") {
      //     console.log("rejectWeb event", e.data.message)
      //   }
      // }
    })


  }, [])

  return <Web3Context.Provider value={context.current}>
    {props.children}
  </Web3Context.Provider>
}
