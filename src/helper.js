const checkInternetConnected = require('check-internet-connected');



exports.formatFileSize = function (bytes,decimalPoint) {
    if(typeof bytes !== 'number' || bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}






// Check Internet Connection online/offline

const config = {
    timeout: 5000, //timeout connecting to each server(A and AAAA), each try (default 5000)
    retries: 5,//number of retries to do before failing (default 5)
    domain: 'google.com'//the domain to check DNS record of
}

exports.checkTheConnection = function() {
  checkInternetConnected(config)
    .then((result) => {
      console.log(`Internet available: ${result}`);         
    })
    .catch((error) => {
      console.log(`No internet: ${error}`);
    });
}



