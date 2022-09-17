import FactoryABI from '../abi/FactoryABI.json'
import NFTCollectionABI from '../abi/NFTCollectionABI.json'
import ValveABI from '../abi/ValveABI.json'

import { ethers, BigNumber } from "ethers";
const FactoryAddress = "0x605575b994a1617fBa104EC562948280D76A8113";
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

export async function getCollectionOwners(collectionAddr){
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
        collectionAddr,
        NFTCollectionABI,
        signer
        );  
        try {
            var index = 0;
            var list = {};
            let totalSupply = await contract.totalSupply();
            while (index < totalSupply){
                let owner = await contract.ownerOf(index);
                if (owner in list)
                    list[owner]++;
                else
                    list[owner] = 1;
                index+=1;
            }
            return [list, index];
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
