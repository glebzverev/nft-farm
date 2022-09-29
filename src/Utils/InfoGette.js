import FactoryABI from '../abi/FactoryABI.json'
import NFTCollectionABI from '../abi/NFTCollectionABI.json'
import ValveABI from '../abi/ValveABI.json'

import { ethers, BigNumber } from "ethers";
const FactoryAddress = "0x219569e857A2728aDede8E4154a977A9B800e8bF";
const ValveAddress = "0x222482C6aC8D42D2cDcC75e94CdC2fd9820eF512";
export async function collectionExist(name){
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
            let response = await contract.getCollection(name);
            return response;
        } catch (err) {
            console.log("error: ", err);
        }
    }    
}

export async function collectionInfo(CollectionAddr){
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
        CollectionAddr,
        NFTCollectionABI,
        signer
        );
        try {
            let signAddr = await signer.getAddress(); 
            let balanceOf = await contract.balanceOf(signAddr);
            let maxNftSupply = await contract.maxNftSupply;
            let totalSupply = await contract.totalSupply();
            let baseURI = await contract.baseURI();
            // console.log(balanceOf, maxNftSupply, totalSupply);
            return [balanceOf.toString(), maxNftSupply, totalSupply.toString(), baseURI];
        } catch (err) {
            console.log("error: ", err);
        }
    }  
}

export async function getImg(collectionAddr){
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
        collectionAddr,
        NFTCollectionABI,
        signer
        );  
        try {
            let signAddr = await signer.getAddress(); 
            var index = 0;
            let currAddr = await contract.ownerOf(index);
            while (signAddr != currAddr){
                index+=1;
                currAddr = await contract.ownerOf(index);
            }
            return index;
        } catch (err) {
            console.log("error: ", err);
        }
    }  
}

export async function getCollectionOwners(collectionAddr, indexes){
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
        collectionAddr,
        NFTCollectionABI,
        signer
        );  
        try {
            var totalPercentPerAddress = {};
            var ownerPercent = 0.96;
            var refPercent = 0.04;
            
            for (var i of indexes) {
                let owner = await contract.ownerOf(i);
                let ref = await contract.referals(i);
                if (owner in totalPercentPerAddress)
                    totalPercentPerAddress[owner] += ownerPercent;
                else
                    totalPercentPerAddress[owner] = ownerPercent;
                if (ref in totalPercentPerAddress)
                    totalPercentPerAddress[ref] += refPercent;
                else
                    totalPercentPerAddress[ref] = refPercent;
            }
            return [totalPercentPerAddress, indexes.length];
        } catch (err) {
            console.log("error: ", err);
        }
    }  
}



export async function SplitRevenue(token, brooks, amount){
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
        ValveAddress,
        ValveABI,
        signer
        );  
        console.log(token, brooks, amount);

        try {
            let response = contract.distribute(token, brooks, amount)
            return response;
        } catch (err) {
            console.log("error: ", err);
        }
    }  
}