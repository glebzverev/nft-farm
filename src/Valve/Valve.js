import { Button, Input, Stack } from '@chakra-ui/react';
import {collectionExist, getCollectionOwners, SplitRevenue} from '../Utils/InfoGette'
import { ethers} from "ethers";
import {useState} from "react";
import IERC20ABI from "../abi/IERC20ABI.json";

async function Split(){
    const amount = document.getElementById('amount').value;
    const collectionName = document.getElementById('name').value;
    const token = document.getElementById('token').value;

    let collectionAddress = await collectionExist(collectionName);
    let temp = document.getElementById('indexes').value;
    let indexes = temp.split(', ');
    console.log(collectionAddress, collectionName);
    if (collectionAddress == "0x0000000000000000000000000000000000000000"){
        alert("Collection doesn't exist!");
    }
    else {
        let data = await getCollectionOwners(collectionAddress, indexes);
        var list = []
        for (var i in data[0]){
            list.push([ethers.utils.parseEther((data[0][i] * amount / data[1]).toString()), i]);
        }
        console.log(list);
        SplitRevenue(token, list, ethers.utils.parseEther(amount.toString()));
    }
}

function Valve() {
    const [amountIn, setAmountIn] = useState('');
    const [address, setAddress] = useState('0x222482c6ac8d42d2cdcc75e94cdc2fd9820ef512');
    const [tokenAddress, setTokenAddress] = useState('');
 

        
    async function approve(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
            tokenAddress,
            IERC20ABI,
            signer
            );
            try {
                console.log("try Swap");
                const amount = ethers.utils.parseEther((amountIn).toString()); 
                let response = await contract.approve(address, amount);
            } catch (err) {
            console.log("error: ",err);
            }
        }
    }
  return (
    <div>
        <div>
            <Stack spacing={4} align='stretch'>
                <Input width='auto' placeholder='Collection name' id="name" text="Collection name" type="string" />
                <Input width='auto' placeholder='Token address to Split' id="token" text="Token to Split" type="address" />
                <Input width='auto' placeholder='Splitting amount' id="amount" text="Spliting amount" type="number" />
                <Input width='auto' placeholder='Index of NFTs' id="indexes" text="Indexes of NFTs" type="string" />
                <Button onClick={Split}>
                    Split revenue
                </Button>
            </Stack>
            <Stack spacing={4} align='stretch'>
                <Input width='auto' 
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)} 
                placeholder='Token address to Approve' 
                text="Token address to Approve" 
                type="address" />
                
                <Input width='auto' 
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)} 
                placeholder='Approve amount' 
                text="Approve amount" 
                type="number" />
                
                <Input width='auto' 
                value={address}
                onChange={(e) => setAddress(e.target.value)} 
                placeholder='Approve address'
                text="Approve address" 
                type="address" />
                <Button onClick={approve}>
                    Approve
                </Button>
            </Stack>
        </div>
    </div>
  );
}

export default Valve;
