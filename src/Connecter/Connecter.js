import React from 'react';
import { useState } from "react";

import { Box, Button, Flex, Image, Link, SliderProvider, Spacer, Text } from '@chakra-ui/react';

import { ethers, BigNumber } from "ethers";
// import Token from "../../abi/Token.json";

import './Connecter.css';

var Connecter = ({accounts, setAccounts}) => {
    const isConnected = Boolean(accounts[0]);
    const binanceTestChainId = ['0x61', 97]


    async function updateData(){
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
        setAccounts(accounts);
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const chainId = window.ethereum.networkVersion;
        console.log(chainId);
        if(chainId == binanceTestChainId[1]){
            console.log("Bravo!, you are on the correct network");
        } else {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'BSC Testnet',
                    chainId: binanceTestChainId[0],
                    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/']
                  }
                ]
              });  

        console.log("oulalal, switch to the correct network")
        }
    }



    return(
        <div className = "Connecter">
            {isConnected ? (
                <div>
                <p>
                    {"0x" + accounts[0][2]+accounts[0][3]+"..."} is Connected
                </p>
                <Button onClick={updateData}>
                    UpdateData
                </Button>
                </div>
            ):(
                <Button onClick={updateData}>
                    Connect
                </Button>    
            )}
        </div>
    )

}
export default Connecter;
