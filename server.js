const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors()); 
const port = process.env.PORT || 5000;
const csv=require('csvtojson')

const distance = require('google-distance');
distance.apiKey = 'AIzaSyCSN28i2Gqi9OXVDSrrtVoxOQupSuitPsM'
//Route setup
app.get('/getCountry', (req, res) => {
  const csvFilePath='data/countryCodes.csv'
  inputCode = req.param("countryCode")
  csv()
  .fromFile(csvFilePath)
  .then((countryCodes)=>{
      countryCodes.forEach((countryCode => {
        if (parseInt(countryCode["Code"]) == parseInt(inputCode)){
          res.send(countryCode["Country"]);
        }
      }))
  })

  
});

app.get("/calculateDistance", (req, res) => {
  distance.get({
      origin: req.param("origin"),
      destination: req.param("destination")
    },
    function (err, data) {
      if (err) return console.log(err);
      res.send(data);
    });
})

//Start server
app.listen(port, (req, res) => {

  console.log(`server listening on port: ${port}`)

});