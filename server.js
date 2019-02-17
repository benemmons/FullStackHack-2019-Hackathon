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
          country = countryCode["Country"]
          googleMapsClient.geocode({
            address: req.param("destination")
          }, function (firstError, countryCoords) {
            console.log(firstError, countryCoords)
            if (!firstError) {
              destinationCoords = destinationResponse.json.results[0].geometry.location
        
              res.send({"name": countryCode["Country"], "coords": countryCoords});
            
            }})
        }
      }))
    })


});

app.get("/calculateDistance", (req, res) => {
  googleMapsClient.geocode({
    address: req.param("destination")
  }, function (firstError, destinationResponse) {
    if (!firstError) {
      destinationCoords = destinationResponse.json.results[0].geometry.location
      googleMapsClient.geocode({
        address: req.param("origin")
      }, function (secondError, originResponse) {
        if (!secondError) {
          originCoords = originResponse.json.results[0].geometry.location
          coords = {"destination": destinationCoords, "origin": originCoords}

          originPoint = new GeoPoint(coords.origin.lng, coords.origin.lat);
          destinationPoint = new GeoPoint(coords.destination.lng, coords.destination.lat);
          console.log(originPoint)
          console.log(destinationPoint)
          console.log(originPoint.distanceTo(destinationPoint, true))
          res.send({"distance": originPoint.distanceTo(destinationPoint, true)})
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