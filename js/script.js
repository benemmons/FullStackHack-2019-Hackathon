function displayMapCard() {
    document.getElementById("mapCard").classList.remove("is-hidden");


}


function displayDataCard() {
    document.getElementById("dataCard").classList.remove("is-hidden");


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
    Quagga.onProcessed(function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {
                        x: 0,
                        y: 1
                    }, drawingCtx, {
                        color: "green",
                        lineWidth: 2
                    });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {
                    x: 0,
                    y: 1
                }, drawingCtx, {
                    color: "#00F",
                    lineWidth: 2
                });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {
                    x: 'x',
                    y: 'y'
                }, drawingCtx, {
                    color: 'red',
                    lineWidth: 3
                });
            }
        }
    });

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
                            destination: country
                        }
                    })
                    .then(function (response) {
                        console.log(response);
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

        displayMapCard();
        displayDataCard();
    })

};