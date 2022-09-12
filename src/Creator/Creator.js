import React from 'react';
import { Box, Button, Flex, Stack, Image, Link, SliderProvider, Spacer, Text, Input } from '@chakra-ui/react';
import { ethers, BigNumber } from "ethers";
import { useState } from "react";


import './Creator.css';

import FactoryABI from './../abi/FactoryABI.json'
const FactoryAddress = "0xD9675830c581B92bB7ED14fF6662016993E125Ad";

var Creator = ({accounts}) => {
    const isConnected = Boolean(accounts[0]);
    const [name, setName] = useState('Input Collection Name');
    const [shortName, setShortName] = useState('Input Short Name');
    const [maxSupply, setMaxSupply] = useState('Input Short Name');
    const [baseURI, set_BaseURI] = useState('Input base URI');

    async function createCollection(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log(accounts[0]);
            const contract = new ethers.Contract(
            FactoryAddress,
            FactoryABI,
            signer
            );
            console.log(name, shortName);
            try {
                let response = await contract.makeCollection(
                    name, shortName,
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
            console.log(accounts[0]);
            const contract = new ethers.Contract(
            FactoryAddress,
            FactoryABI,
            signer
            );
            try {
                let response = await contract.baseURI(name, baseURI);
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            }
        }    
    }

    function renderName(){
        const elem = document.getElementById('name');
        setName(elem.value)
        console.log(elem.value)
    }

    function renderMaxSupply(){
        const elem = document.getElementById('maxSupply');
        setMaxSupply(elem.value)
        console.log(elem.value);        
    }

    function renderShortName(){
        const elem = document.getElementById('shortName');
        setMaxSupply(elem.value)
        console.log(elem.value);
    }

    function renderBaseURI(){
        const elem = document.getElementById('shortName');
        set_BaseURI(elem.value)
        console.log(elem.value);
    }

    return(
        <div>
            <div>
            <Stack spacing={4} align='stretch'>
                <Input placeholder='Collection name' id="name" text="Collection name" type="string"
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
                <Input placeholder='Collection name' id="name" text="Collection name" type="string"
                 size="xs" width='auto' onChange={renderName} />
                <Input width='auto' placeholder='base URI' id="baseURI" text="maxSupply" type="string"
                onChange={renderMaxSupply}/>
                <Button onClick={renderBaseURI}>
                    Set base URI
                </Button>
            </Stack>
            
            </div>
        </div>
    )

}
export default Creator;
