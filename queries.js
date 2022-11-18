const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: '80.78.244.110',
  database: 'collections',
  password: 'password',
  port: 5432,
});

const host_img = "http://80.78.244.110:4000/images";

const getCollection = (request, response) => {
  const name = request.params.name;
  pool.query(`SELECT * FROM ${name} ORDER BY id ASC`, (error, results) => {
    if (error) {
      response.status(200).json(error);
    }
    else
      response.status(200).json(results.rows);
  });
};

const getNFT = (request, response) => {
  const id = parseInt(request.params.id);
  const name = request.params.name;
  pool.query(`SELECT * FROM ${name} WHERE id = ${id}`, (error, results) => {
    if (error) {
      response.status(200).json(error);
    }
    else
      response.status(200).json(results.rows[0]);
  });
};

const createCollection = (request, response) => {
  const name = request.params.name;
  const props = request.params.body;
  var query = `CREATE TABLE ${name} (id SERIAL PRIMARY KEY` 
  var propses = props.split(',');
  for (var i in propses){
    query += `, ${propses[i]} VARCHAR`;
  }
  query+=');'
  console.log(query);
  try{
    pool.query(
      query,
      (error, results) => {
        if (error) {
          response.status(200).send(`error: ', ${error}`);
        }
        else
          response.status(201).send(`collection created: ${results}`);
      }
    );  
  } catch (error) {}
};

const createNFT = (request, response) => {
  const name = request.params.name;
  const props = request.params.props;
  const values = request.params.values;
  const num = values.split(',')[0];
  var query = `INSERT INTO ${name} (${props},url) VALUES (${values},'${host_img}/${name}/${num}.png')`; 
  console.log(query);
    pool.query(
    query,
    (error, results) => {
      if (error) {
        response.status(200).send(`error: ', ${error}, ${props} `);
      }
      else
        response.status(201).send(`nft added with ID: ${results}`);
    }
  );  
};

module.exports = {
  getCollection,
  getNFT,
  createNFT,
  createCollection
};
