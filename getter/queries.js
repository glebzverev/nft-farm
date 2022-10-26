// const Pool = require('pg').Pool;

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'test-db',
//   password: 'password',
//   port: 5432,
// });

// const getCollection = (request, response) => {
//   const name = request.params.name;
//   pool.query(`SELECT * FROM ${name} ORDER BY id ASC`,  (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// const getNFT = (request, response) => {
//   const id = parseInt(request.params.id);
//   const name = request.params.name;
//   pool.query(`SELECT * FROM ${name} WHERE id = ${id}`, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// --------------------------
// const { query } = require("express");
const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: 'test-db',
    password: 'password',
    port: 5432
})

function generateTableQuery(name, _props){
    var query = `CREATE TABLE ${name} (id INT PRIMARY KEY`;
    for (var i = 0 ; i < _props.length; i++){
        query += ' , '+ _props[i] + ' VARCHAR ( 20 ) NOT NULL';
    }
    query += ')'
    return query
}

function generateNFTQuery(collection, _props){
  var query = `INSERT INTO ${collection} (`;
  var values = `VALUES (`;
  for (var i = 0 ; i < _props.length; i++){
    if (i != 0){
      values += ', ';
    }  
    values +='$'+(i+1).toString();  
  }
  columns = 'id, color, gender, metal'
  query += columns;
  query += ') '+values + ') RETURNING *';
  return query
}

const createCollection = (name, _props) => {  
    const query = generateTableQuery(name, _props);
    pool.query(query,
      (error, result) => {
        if (error) {
          throw error;
        }
       console.log(`NFT created with: ${result}`);
      }
    );
  };

const createNFT = (collection, _props) => {  
    const query = generateNFTQuery(collection, _props);
    console.log(query, _props)
    pool.query(
      query, _props,
      (error, result) => {
        if (error) {
          throw error;
        }
       console.log(`Collection created with: ${result}`);
      }
    );
  };

const uploadNFT = (request, response) => {  
  // console.log("upload")
  response.status(200).json({"ok": "ok"});
};


function getNFTs(collection){
    pool.query(`SELECT * FROM ${collection}`)
    .then((res, err) =>{
        if (err)
            console.log("error: ", err)
        else
            console.log(res.rows);
    })
}

function getProps(name){
}

// createNFT("nft1", ["2", "blue", "female", "still"]);
// getNFTs("nft1");
// getColumns('nft')

// pool.end();

// createCollection("nft1", ['color', 'gender', 'metal']);

module.exports = {
  createCollection,
  uploadNFT,
  createNFT 
};
