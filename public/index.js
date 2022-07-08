
var isLocked = false;



var html5QrcodeScanner = new Html5QrcodeScanner( 
    "barcode-reader", 
    { 
        fps: 10, 
        qrbox: { width: 300, height: 60 }
    } 
);
html5QrcodeScanner.render( onScanSuccess );

// var html5QrCode = new Html5Qrcode("barcode-reader");

// startScanner();

// function startScanner() {
//     const config = {
//         fps: 100,
//         qrbox: 200,
//         aspectRatio: 1,
//         formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
//     };

//     html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess);

//     setTimeout(function () {
//         html5QrCode.applyVideoConstraints({
//         focusMode: "continuous",
//         advanced: [{ zoom: 2.0 }],
//         });
//     }, 2000);
// }





function onScanSuccess(decodedText, decodedResult) {

    if(!isLocked){
        isLocked = true;
        console.log(`Code scanned = ${decodedText}`, decodedResult);

        //  Try API grab
        getMetadataFromISBN(decodedResult.result.text);
    }
}

function getMetadataFromISBN(isbn) {
    console.log("Request for ISBN: " + isbn);
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        console.log("Booooooo");
      return false;
    }
    httpRequest.onreadystatechange = parseResponse;
    httpRequest.open('GET', '/isbn/' + isbn);
    httpRequest.send();
}

function parseResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        metadata = JSON.parse(httpRequest.responseText)
        setPreviewPane(metadata);
        isLocked = false;
      } else {
        console.log('There was a problem with the request.');
      }
    }
  }


function setPreviewPane(resp){
    console.log(resp);
    document.getElementById("title-replace").innerHTML = resp.title;
    document.getElementById("author-replace").innerHTML = resp.author;
    document.getElementById("year-replace").innerHTML = resp.year;
}