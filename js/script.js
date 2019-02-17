map = ""
function initMap(){
    navigator.geolocation.getCurrentPosition(function(position) {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude},
            zoom: 2
        });

        
    })
}

function displaySimilarCard(){
    document.getElementById("similarCard").classList.remove("is-hidden");
}

function displayMapCard(destinationCoords) {
    document.getElementById("mapCard").classList.remove("is-hidden");
    
    navigator.geolocation.getCurrentPosition(function(currentCoords) {
        currentCoords = {"lat": currentCoords.coords.latitude, "lng": currentCoords.coords.longitude}
        currentCoords = new google.maps.LatLng(currentCoords.lat, currentCoords.lng)
        destinationCoords = new google.maps.LatLng(destinationCoords.lat, destinationCoords.lng)
        console.log("Current:", currentCoords, "Destination:", destinationCoords)
        var currentMarker = new google.maps.Marker({
            position: currentCoords,
            map: map,
            title: 'Current'
          });
          var destinationMarker = new google.maps.Marker({
            position: destinationCoords,
            map: map,
            title: 'Destination'
          });
          var flightPath = new google.maps.Polyline({
            map: map,
            path: [currentCoords, destinationCoords],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
        
        
    })

}
    



function displayDataCard(distance) {
    document.getElementById("dataCard").classList.remove("is-hidden");
    document.getElementById("bottomColumns").classList.remove("is-hidden");

    document.getElementById("airkmVal").innerText = distance
    document.getElementById("carbonEmmisionsVal").innerText = distance / 8023
}


function displayBarcodeCard() {
    console.log("run")
    document.getElementById("barcodeCard").classList.remove("is-hidden")
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#barcodeCardContent') // Or '#yourElement' (optional)
        },
        decoder: {
            readers: ["upc_reader", "upc_e_reader"]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    }, );
    // Quagga.onProcessed(function (result) {
    //     var drawingCtx = Quagga.canvas.ctx.overlay,
    //         drawingCanvas = Quagga.canvas.dom.overlay;

    //     if (result) {
    //         if (result.boxes) {
    //             drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
    //             result.boxes.filter(function (box) {
    //                 return box !== result.box;
    //             }).forEach(function (box) {
    //                 Quagga.ImageDebug.drawPath(box, {
    //                     x: 0,
    //                     y: 1
    //                 }, drawingCtx, {
    //                     color: "green",
    //                     lineWidth: 2
    //                 });
    //             });
    //         }

    //         if (result.box) {
    //             Quagga.ImageDebug.drawPath(result.box, {
    //                 x: 0,
    //                 y: 1
    //             }, drawingCtx, {
    //                 color: "#00F",
    //                 lineWidth: 2
    //             });
    //         }

    //         if (result.codeResult && result.codeResult.code) {
    //             Quagga.ImageDebug.drawPath(result.line, {
    //                 x: 'x',
    //                 y: 'y'
    //             }, drawingCtx, {
    //                 color: 'red',
    //                 lineWidth: 3
    //             });
    //         }
    //     }
    // });

    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        Quagga.stop()
        document.getElementById("barcodeCard").classList.add("is-hidden")
        axios.get('https://salty-harbor-91858.herokuapp.com/getCountry', {
                params: {
                    countryCode: code.substring(0, 3),
                }
            })
            .then(function (country) {
                axios.get('https://salty-harbor-91858.herokuapp.com/calculateDistance', {
                        params: {
                            origin: "england",
                            destination: country.data.name
                        }
                    })
                    .then(function (response) {
                        displayMapCard(country.data.coords);
                        displayDataCard(parseInt(response.data.distance));
                        displaySimilarCard()
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });

            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });

    })

};