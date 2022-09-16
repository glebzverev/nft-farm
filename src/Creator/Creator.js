import React from 'react';
import { Box, Button, Flex, Stack, Image, Link, SliderProvider, Spacer, Text, Input } from '@chakra-ui/react';
import { ethers, BigNumber } from "ethers";
import { useState } from "react";


import './Creator.css';

import FactoryABI from './../abi/FactoryABI.json'
import NFTCollectionABI from './../abi/NFTCollectionABI.json'

const FactoryAddress = "0x605575b994a1617fBa104EC562948280D76A8113";

var Creator = ({accounts}) => {
    const isConnected = Boolean(accounts[0]);
    const [name1, setName1] = useState('Input Collection Name');
    const [name2, setName2] = useState('Input Collection Name');
    const [name3, setName3] = useState('Input Collection Name');
    const [name4, setName4] = useState('Input Collection Name');
    const [shortName, setShortName] = useState('Input Short Name');
    const [maxSupply, setMaxSupply] = useState('Input Short Name');
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
            console.log(name2);
            const contract = new ethers.Contract(
            FactoryAddress,
            FactoryABI,
            signer
            );
            console.log(signer);

            try {
                let response = await contract.baseURI(name2, baseURI);
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            }
        }    
    }

    function renderName(){
        var elem = document.getElementById('name1');
        setName1(elem.value)
        elem = document.getElementById('name2');
        setName2(elem.value)
        elem = document.getElementById('name3');
        setName3(elem.value)
        elem = document.getElementById('name4');
        setName4(elem.value)

        console.log(name1, name2, name3, name4);
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
                let response = await contract.destroyCollection(name3);
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
            try {
                let response = await contract1.getCollection(name4);
                console.log(response);
                const contract2 = new ethers.Contract(
                    response,
                    NFTCollectionABI,
                    signer
                    );
                try {
                    let response = await contract2.mintNFT(1, "0x3604226674A32B125444189D21A51377ab0173d1");
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
            <div>
            <Stack spacing={4} align='stretch'>
                <Input placeholder='Collection name' id="name1" text="Collection name" type="string"
                 size="xs" width='auto' onChange={renderName} />
                <Input width='auto' placeholder='Collection short-name' id="shortName" text="Short name" type="string" 
                onChange={renderShortName}/>
                <Input width='auto' placeholder='Max NFT supply' id="maxSupply" text="maxSupply" type="number"
                onChange={renderMaxSupply}/>
                <Button onClick={createCollection}>
                    Create Collection
                </Button>
            </Stack>
            <Stack spacing={3} align='stretch'>
                <Input placeholder='Collection name' id="name2" text="Collection name" type="string"
                 size="xs" width='auto' onChange={renderName} />
                <Input width='auto' placeholder='base URI' id="baseURI" text="maxSupply" type="string"
                onChange={renderBaseURI}/>
                <Button onClick={setBaseURI}>
                    Set base URI
                </Button>
            </Stack>
            <p>MINT!</p>
            <Stack spacing={2} align='stretch'>
                <Input placeholder='Collection name' id="name4" text="Collection name" type="string"
                 size="xs" width='auto' onChange={renderName} />
                <Button onClick={mintNFT}>
                    MINT NFT
                </Button>
            </Stack>
            <p>Dangerous zone!!!</p>
            <Stack spacing={2} align='stretch'>
                <Input placeholder='Collection name' id="name3" text="Collection name" type="string"
                 size="xs" width='auto' onChange={renderName} />
                <Button onClick={destroyCollection}>
                    DESTROY COLLECTION
                </Button>
            </Stack>

            </div>
        </div>
    )

}
export default Creator;
