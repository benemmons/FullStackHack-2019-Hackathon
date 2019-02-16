const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const csv=require('csvtojson')

const distance = require('google-distance');
distance.apiKey = 'AIzaSyCSN28i2Gqi9OXVDSrrtVoxOQupSuitPsM'
//Route setup
app.get('/getCountry', (req, res) => {
  const csvFilePath='data/countryCodes.csv'
  req.param("origin")
  csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
      console.log(jsonObj);
  })

  res.send('root route');
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