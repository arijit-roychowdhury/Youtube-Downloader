const { desktopCapturer,  dialog } = require('electron');
const fs = require('fs');

const youtubedl = require('youtube-dl');
const checkInternetConnected = require('check-internet-connected');


let url;

// Buttons
const iframeWrapper = document.getElementById('frameWrapper');


const searchUrl = document.getElementById('searchUrl');
searchUrl.onclick = e => {
    e.preventDefault();
    let inputUrl = document.getElementById('inputUrl');    
    let urlvalidation = "https://www.youtube.com/watch?v";
    let urlEmbadedPart = "https://www.youtube.com/embed/";    

    if(inputUrl.value && inputUrl.value.startsWith(urlvalidation)) {
        let str = inputUrl.value;
        let res = str.replace('&', '=').split("=");
        console.log(res);
        let embeddedUrl = urlEmbadedPart + res[1];
        url =  urlvalidation + "=" + res[1];
        iframeWrapper.innerHTML = "<iframe  id='frame' name='frame' src='" + embeddedUrl + "' width='480'  height='252'   allowfullscreen></iframe>";
    }
};

const progressBar = document.getElementById('progressBar');
progressBar.value = 0;

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {

    const video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname })
    
    // Will be called when the download starts.
    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
        video.pipe(fs.createWriteStream(info._filename));
        
    });


    // Progress
    let size = 0;
    video.on('info', (info) => {
    size = info.size;
    });

    let pos = 0;
    let progress = 0;
    video.on('data', (chunk) => {
    pos += chunk.length;
        if (size) {
            progress = (pos / size * 100).toFixed(2);
            progressBar.value = progress;
            console.log(progress);
        }
    });
       
    

    // youtubedl.getInfo(url, function(err, info) {
    //     if (err) throw err;
       
    //     console.log('Obj:', info);
    // });
};



// Check Internet Connection online/offline

const config = {
    timeout: 5000, //timeout connecting to each server(A and AAAA), each try (default 5000)
    retries: 5,//number of retries to do before failing (default 5)
    domain: 'google.com'//the domain to check DNS record of
  }
function checkTheConnection() {
  checkInternetConnected(config)
    .then((result) => {
      console.log(`Internet available: ${result}`);         
    })
    .catch((error) => {
      console.log(`No internet: ${error}`);
    });
}

setInterval(checkTheConnection, 10000);