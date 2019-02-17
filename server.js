const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
const csv = require('csvtojson')
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCSN28i2Gqi9OXVDSrrtVoxOQupSuitPsM'
});
const GeoPoint = require('geopoint')

//Route setup
app.get('/getCountry', (req, res) => {
  const csvFilePath = 'data/countryCodes.csv'
  inputCode = req.param("countryCode")
  csv()
    .fromFile(csvFilePath)
    .then((countryCodes) => {
      countryCodes.forEach((countryCode => {
        if (parseInt(countryCode["Code"]) == parseInt(inputCode)) {
          res.send(countryCode["Country"]);
        }
      }))
    })


});

app.get("/calculateDistance", (req, res) => {
  console.log(req.param("destination"))
  googleMapsClient.geocode({
    address: req.param("destination")
  }, function (firstError, destinationResponse) {
    if (!firstError) {
      destinationCoords = destinationResponse.json.results[0].geometry.location
      console.log(destinationCoords)
      googleMapsClient.geocode({
        address: req.param("origin")
      }, function (secondError, originResponse) {
        if (!secondError) {
          console.log(destinationCoords, originCoords)
          originCoords = originResponse.json.results[0].geometry.location
          res.send(destinationCoords, originCoords)
        }
        if (secondError) {
          console.log(secondError)
        }
      });

    }
    if (firstError) {
      console.log(firstError)
    }
  });


})

//Start server
app.listen(port, (req, res) => {

  console.log(`server listening on port: ${port}`)

});