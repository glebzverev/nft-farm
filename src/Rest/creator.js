const axios = require('axios');
const host = "http://legendsdao.art:4000";

export async function RestCreateNFT(name, props, values, num){
    var query = `${host}/create-nft/${name}/id,${props}/${num},${values}`;
    console.log(query)
    const response = 
    await axios.get(query);
    console.log(response.data)
}

export async function RestCreateCollection(name, props){
    var query = `${host}/create-collection/${name}/${props}`;
    console.log(query)

    const response = 
    await axios.get(query);
    console.log(response.data);

}
