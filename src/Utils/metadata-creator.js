// const { fs } = require('fs');


export async function createMetadata(collectionProperties, nftPropertiesArr, name1){
    let metadata = {};
    for (let i = 0; i < collectionProperties.length; i++){
            metadata[collectionProperties[i]] = nftPropertiesArr[i];
    }
    // Здесь по идее должна быть запись в файл, но у меня по какой-то причине не выходит
    // fs.mkdirSync("../../buildNFT");
    // fs.mkdirSync(`../../buildNFT/${name1}`);
    // fs.mkdirSync(`../../buildNFT/${name1}/image`);
    // fs.mkdirSync(`../../buildNFT/${name1}/json`);
}