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

function displayLabelCard(){
    document.getElementById("labelCard").classList.remove("is-hidden");
    document.getElementById('downloadButton').addEventListener('click', function() {
        swal("File Name:", {
            content: "input",
          })
          .then((value) => {
            downloadCanvas('myCanvas', value+".png");
          });
        
    }, false);
    
    makeLabel()
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
    document.getElementById("progressBar").value = 50

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
        console.log("Code: " + code)
        Quagga.stop()
        document.getElementById("barcodeCard").classList.add("is-hidden")
        swal("Success!", "Barcode Scanned.", "success");
        window.setTimeout(swal.close, 2000)
        axios.get('https://salty-harbor-91858.herokuapp.com/getCountry', {
                params: {
                    countryCode: code.substring(1, 4),
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
                        document.getElementById("progressBar").value = 100
                        displayMapCard(country.data.coords);
                        displayDataCard(parseInt(response.data.distance));
                        displayLabelCard()
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

function makeLabel(txtColour, bgColour){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 250, 75);   

    ctx.fillStyle = "#" + document.getElementById("bgField").value;
    ctx.fillRect(0, 0, 250, 75);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#" + document.getElementById("txtField").value;

    ctx.fillText("This product has:", 80, 25);
    ctx.fillText("Travelled: 1035 km", 80, 45);
    ctx.fillText("Emitted: 1.2 Tons Carbon", 80, 65);
    // var img = document.getElementById("logo");
    qrImg = new Image();
    qrImg.src = 'assets/QR.png';
    qrImg.onload = function(){
        ctx.drawImage(qrImg, 10, 10, 60, 60);
    }

    
}

function downloadCanvas(canvasId, filename) {
    link = document.createElement('a');
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
    document.body.appendChild(link);
    link.click()
}


