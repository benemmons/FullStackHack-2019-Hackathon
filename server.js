const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors()); 
const port = process.env.PORT || 5000;
const csv=require('csvtojson')
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCSN28i2Gqi9OXVDSrrtVoxOQupSuitPsM'
});
const GeoPoint = require('geopoint')

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
  
  googleMapsClient.geocode({
    address: req.param("destination")
  }, function(err, response) {
    if (!err) {
      console.log(response.json.results.geometry.location.lat);
      console.log(response.json.results.geometry.location.long)
    }
  });


})

//Start server
app.listen(port, (req, res) => {

  console.log(`server listening on port: ${port}`)

});