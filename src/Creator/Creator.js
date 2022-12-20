import React from 'react';
import { Button, Stack, Input } from '@chakra-ui/react';
import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import axios from "axios";
// import { RestCreateCollection, RestCreateNFT } from './../Rest/creator';
// import {createCollection, createNFT} from "../Rest/create-items";
import {collectionExist, collectionInfo, getImg} from "../Utils/InfoGette";
import { createMetadata } from '../Utils/metadata-creator';
import './Creator.css';
import FactoryABI from './../abi/FactoryABI.json'
import NFTCollectionABI from './../abi/NFTCollectionABI.json'
// import { createFunctionTypeNode } from 'typescript';

const FactoryAddress = "0xc997070AC85Ccd6C2EBea759f2F90C1589286cDb";
const host = "http://legendsdao.art:4000";
// const ip_host = 
// const host = "http://localhost:4000";

var Creator = ({accounts}) => {
    const isConnected = Boolean(accounts[0]);
    const [name1, setName1] = useState('Input Collection Name');
    const [shortName, setShortName] = useState('Input Short Name');
    const [maxSupply, setMaxSupply] = useState('Input Short Name');
    const [properties, setProperties] = useState('Input Properties');
    const [Info, setInfo] = useState("");
    const [referalFee, setReferalFee] = useState(4);
    const [baseURI, set_BaseURI] = useState('Input base URI');
    const [file, setFile] = useState('');

    async function RestCreateNFT(name, props, values, num){
        // var query = `${host}/create-nft/${name}/id,${props}/${num},${values}`;
        var query = `${host}/create-nft/${name}/id,${props}/${num},${values}`;
        console.log(query)
        const response = 
        axios.get(query)
        .then((res,err) => {
            if (err){
                throw(err);
            } 
            console.log(res.statusText)// then print response status
        });
    }
    
    async function RestCreateCollection(name, props){
        // var query = `${host}/create-collection/${name}/${props}`;
        var query = `${host}/create-collection/${name}/${props},url`;
        console.log(query)
        const response = 
        axios.get(query)
        .then((res,err) => {
            if (err){
                throw(err);
            } 
            console.log(res.statusText)// then print response status
        });
        console.log(response.data);
    }

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
            let propertiesArr = properties.replaceAll(' ', '').split(',');
            console.log(name1, shortName, propertiesArr);
            try {
                RestCreateCollection(name1, properties.replaceAll(' ', ''));
                let response = await contract.makeCollection(
                    name1, shortName,
                    maxSupply, 0, propertiesArr, referalFee);
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
        console.log(collectionAddr);
        if (collectionAddr != "0x0000000000000000000000000000000000000000"){
            let data = await collectionInfo(collectionAddr);
            console.log(data[0]);
            setInfo(
                <div>
                <p> Exist </p>
                <p> TotalSupply: {data[1]}  ||   balanceOf: {data[0]} </p>
                <p> baseURI: {data[2]} </p>
                <p> properties: {data[3]}</p>
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

    function renderProperties(){
        const elem = document.getElementById('properties');
        setProperties(elem.value);
        console.log(elem.value);
    }

    function renderFee(){
        const elem = document.getElementById('Referal_fee');
        setReferalFee(elem.value);
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

    function sendImage (name, id) {
        const amount = document.getElementById('amount').value;
        
        if (!file){
            alert('download image');
            throw("need to download file");
        }
        else {
            for (var i = 0; i < amount; i++){
                try{
                    const data = new FormData()
                    data.append("file", file);
                    axios.post(`${host}/img/${name}/${Math.round(id) + i}`, data 
                    )
                    .then((res,err) => {
                        if (err){
                            throw(err);
                        } 
                        console.log(res.statusText)// then print response status
                    })
                } catch (error){
                    console.log("something went wrong");
                    throw(error);
                }    
            }
        }; 
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
            const nftProperties = document.getElementById('nftProperties').value;
            const nftPropertiesArr = nftProperties.replaceAll(' ','').split(',');
            let collectionProperties;
            try {
                let response = await contract1.getCollection(name1);
                console.log(response);
                const contract2 = new ethers.Contract(
                    response,
                    NFTCollectionABI,
                    signer
                    );
                try {
                    collectionProperties = await contract2.getProperties();
                    if (collectionProperties.length !== nftPropertiesArr.length){
                        throw "Wrong number of NFT properties";
                    }

                    let supply = await contract2.totalSupply();
                    // console.log((supply+1).toString());
                    const query = "'"+nftProperties.replaceAll(' ', '').replaceAll(',', "','")+"'"; 
                    var query_props = "";
                    for (var i = 0; i < collectionProperties.length; i++){
                        query_props+=collectionProperties[i];
                        if (i != collectionProperties.length -1)
                            query_props+=',';
                    }

                    console.log("METADATA: ", query_props,
                        query,
                        name1);
                    sendImage(name1, supply);
                    let resp = await contract2.mintNFT(amount, refAddress);    

                    console.log(resp);
                    for (var i = 0; i < amount; i++){
                        await RestCreateNFT(name1, query_props, query, Math.round(supply) + i);
                    }


                } catch (err) {
                    console.log("error: ", err);
                }
            } catch (err) {
                console.log("error: ", err);
            }  
        }
    }

    function onChangeHandler(e){
        console.log(e.target.files[0])
        console.log(e.target.files[0].toString('base64'));
        setFile(e.target.files[0]);
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
                <Input width='auto' placeholder='Collection properties' id="properties" text="properties" type="string"
                onChange={renderProperties}/>
                <Input width='auto' placeholder='Referal Fee %' id="Referal_Fee" text="Referal_Fee" type="number"
                onChange={renderFee}/>

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
                <Input width='auto' placeholder='NFT properties' id="nftProperties" text="nftProperties" type="string"/>
                <Input onChange = {onChangeHandler} width="auto" placeholder='Choose file' id='nftImage' text='nftImage' type='file' name='file' />
                <Button onClick={mintNFT}>
                    MINT NFT
                </Button>
            </Stack>
            </div>
        </div>
    )

}
export default Creator;
