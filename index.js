const express = require('express');
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');
const fs  = require("fs");
const path = require("path");
const File = require("File");
var format = require('util').format;

const isFileValid = (file) => {
  const type = file.type.split("/").pop();
  // const validTypes = ["jpg", "jpeg", "png", "pdf"];
  const validTypes = ["jpg", "jpeg", "png"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

const app = express();
const port = 4000;
const db = require('./queries');
const formidable = require('formidable');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(formidableMiddleware());

app.use("/images", express.static('images')); 

app.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: './images',
  multiples: true, // req.files to be arrays of files
}));

app.post('/img/:name/:id', function(request, response) {
  const uploadFolder = path.join(__dirname, "images", request.params.name);    
  
  if (!fs.existsSync(uploadFolder)){
    fs.mkdirSync(uploadFolder);
  }

  // console.log(request.files);
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; // 5MB
  form.uploadDir = uploadFolder;
  console.log("form\n\n\n", form);
  console.log(request.files);

  form.parse(request, async () => {
    try{
      console.log("fields\n\n\n", request.fields);
      console.log("files \n\n\n", request.files);  
    }
    catch (err) {
      console.log("Error parsing the files", err);
      return response.status(400).json({
        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
      });
    }
  });
  const file = request.files.file;

  // checks if the file is valid
  const isValid = isFileValid(file);

  // creates a valid name by removing spaces
  // const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

  // const type = file.type.split("/").pop();
  const type = 'png';
  const fileName = `${request.params.id}.${type}`

  if (!isValid) {
    // throes error if file isn't valid
    return response.status(400).json({
      status: "Fail",
      message: "The file type is not a valid type",
    });
  }
  try {
    // renames the file in the directory
    fs.renameSync(file.path, path.join(uploadFolder, fileName));
  } catch (error) {
    console.log(error);
  }

  try {
    // stores the fileName in the database
    let newFile = File.create({
      name: `images/${request.params.name}/${fileName}`,
    });
    return response.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
  } catch (error) {
    response.json({
      error,
    });
  }
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/collection/:name', db.getCollection);
app.get('/nft/:name/:id', db.getNFT);
app.get('/create-nft/:name/:props/:values', db.createNFT);
app.get('/create-collection/:name/:body', db.createCollection)

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
