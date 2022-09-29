import React from 'react';
import { Button, Stack, Input } from '@chakra-ui/react';
import { useState } from "react";
import { ethers, BigNumber } from "ethers";

import {collectionExist, collectionInfo, getImg} from "../Utils/InfoGette";

import './Creator.css';

import FactoryABI from './../abi/FactoryABI.json'
import NFTCollectionABI from './../abi/NFTCollectionABI.json'

const FactoryAddress = "0x219569e857A2728aDede8E4154a977A9B800e8bF";

var Creator = ({accounts}) => {
    const isConnected = Boolean(accounts[0]);
    const [name1, setName1] = useState('Input Collection Name');
    const [shortName, setShortName] = useState('Input Short Name');
    const [maxSupply, setMaxSupply] = useState('Input Short Name');
    const [Info, setInfo] = useState("");
    const [baseURI, set_BaseURI] = useState('Input base URI');

    async function createCollection(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log(signer);
            const contract = new ethers.Contract(
            FactoryAddress,
            FactoryABI,
            signer
            );
            console.log(name1, shortName);
            try {
                let response = await contract.makeCollection(
                    name1, shortName,
                    maxSupply, 0);
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            }
        }    
    }

    async function setBaseURI(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log(name1);
            const contract = new ethers.Contract(
            FactoryAddress,
            FactoryABI,
            signer
            );
            console.log(signer);

            try {
                let response = await contract.baseURI(name1, baseURI);
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            }
        }    
    }

    async function renderName(){
        var elem = document.getElementById('name1');
        setName1(elem.value);
        let collectionAddr = await collectionExist(elem.value);
        if (collectionAddr != "0x0000000000000000000000000000000000000000"){
            let data = await collectionInfo(collectionAddr);
            setInfo(
                <div>
                <p>Exist</p>
                <p> TotalSupply: {data[2]}  ||   balanceOf: {data[0]} </p>
                <p> baseURI: {data[3]} </p>
                </div>
            );
            if (data[0] > 0){
                let index = await getImg(collectionAddr);
                console.log(index);
            }
        }
        else
        {
            setInfo(<p>Doesn't exist</p>);
        }
        console.log(elem.value);
    }

    function renderMaxSupply(){
        const elem = document.getElementById('maxSupply');
        setMaxSupply(elem.value)
        console.log(elem.value);        
    }

    function renderShortName(){
        const elem = document.getElementById('shortName');
        setShortName(elem.value)
        console.log(elem.value);
    }

    function renderBaseURI(){
        const elem = document.getElementById('baseURI');
        set_BaseURI(elem.value)
        console.log(elem.value);
    }

    async function destroyCollection(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log(signer);
            const contract = new ethers.Contract(
            FactoryAddress,
            FactoryABI,
            signer
            );
            try {
                let response = await contract.destroyCollection(name1);
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            }
        }    
    }

    async function mintNFT(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log(signer);
            const contract1 = new ethers.Contract(
            FactoryAddress,
            FactoryABI,
            signer
            );
            const amount = document.getElementById('amount').value;
            const refAddress = document.getElementById('refAddress').value;
            try {
                let response = await contract1.getCollection(name1);
                console.log(response);
                const contract2 = new ethers.Contract(
                    response,
                    NFTCollectionABI,
                    signer
                    );
                try {
                    let response = await contract2.mintNFT(amount, refAddress);
                    console.log(response);
                } catch (err) {
                    console.log("error: ", err);
                }
            } catch (err) {
                console.log("error: ", err);
            }  
        }
    }

    return(
        <div>
            <Input placeholder='Collection name' id="name1" text="Collection name" type="string"
                 size="xs" width='auto' onChange={renderName} />
            <p>
                Collection: {name1}
                {Info}

            </p>
            <div>
            <Stack spacing={4} align='stretch'>
                <Input width='auto' placeholder='Collection short-name' id="shortName" text="Short name" type="string" 
                onChange={renderShortName}/>
                <Input width='auto' placeholder='Max NFT supply' id="maxSupply" text="maxSupply" type="number"
                onChange={renderMaxSupply}/>
                <Button onClick={createCollection}>
                    Create Collection
                </Button>
                </Stack>
            <Stack spacing={3} align='stretch'>
                <Input width='auto' placeholder='base URI' id="baseURI" text="maxSupply" type="string"
                onChange={renderBaseURI}/>
                <Button onClick={setBaseURI}>
                    Set base URI
                </Button>
            </Stack>
            <p>MINT!</p>
            <Stack spacing={2} align='stretch'>
                <Input width='auto' placeholder='Amount to mint' id="amount" text="Amount to mint" type="number"/>
                <Input width='auto' placeholder='Referal address' id="refAddress" text="refAddress" type="address"/>
                <Button onClick={mintNFT}>
                    MINT NFT
                </Button>
            </Stack>
            <p>Dangerous zone!!!</p>
            <Stack spacing={2} align='stretch'>
                <Button onClick={destroyCollection}>
                    DESTROY COLLECTION
                </Button>
            </Stack>
            </div>
        </div>
    )

}
export default Creator;
