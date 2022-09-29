import { Button, Input, Stack } from '@chakra-ui/react';
import {collectionExist, getCollectionOwners, SplitRevenue} from '../Utils/InfoGette'
import { ethers} from "ethers";

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
  return (
    <div>
        {/* <div>
            In Progress . . .
        </div> */}
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
        </div>
    </div>
  );
}

export default Valve;
