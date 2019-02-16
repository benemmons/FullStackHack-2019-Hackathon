const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const distance = require('google-distance');

//Route setup
app.get('/getCountry', (req, res) => {



  res.send('root route');
});

app.get("/calculateDistance", (req, res) => {
  console.log(req.param("origin"), req.param("destination"))
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