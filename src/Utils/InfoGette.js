import FactoryABI from '../abi/FactoryABI.json'
import NFTCollectionABI from '../abi/NFTCollectionABI.json'
import ValveABI from '../abi/ValveABI.json'

import { ethers, BigNumber } from "ethers";
const FactoryAddress = "0x6cc72EB326a697f85bB46d4Ad3c6873e98E8d7C8";
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
            // let maxNftSupply = await contract.maxNftSupply();
            let totalSupply = await contract.totalSupply();
            let baseURI = await contract.baseURI();
            let properties = await contract.getProperties();
            // console.log(balanceOf, maxNftSupply, totalSupply);
            console.log(properties);
            var props = "[" ;
            for (var i in properties){
                props += properties[i];
                if (i != properties.length-1)
                    props += ",";
            }
            props += "]";
            console.log(props);
            return [balanceOf.toString(), totalSupply.toString(), baseURI, props];
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
            let refPercent = await contract.referalFee() / contract.feeDecimals();
            var ownerPercent = 1 - refPercent;
            
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
