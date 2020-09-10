// const { desktopCapturer,  dialog } = require('electron');
const fs = require('fs');

const youtubedl = require('youtube-dl');

const helper = require('./helper.js')


let url;

// Buttons
const iframeWrapper = document.getElementById('frameWrapper');

const videoSelect = document.getElementById('videoSelect');
const select = videoSelect.querySelector('select');

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

        youtubedl.getInfo(url, function(err, info) {
          if (err) throw err;
         
          
          console.log('Total formats:', info.formats.length);
          info.formats.forEach(element => {
            console.log('Elements Quality => :', element.format);
            console.log('Elements Format => :', element.ext);
            console.log('Elements size => :', helper.formatFileSize(element.filesize) );
            renderOptions(element.format_id, element.format, element.ext, helper.formatFileSize(element.filesize));
          });
          console.log(info);
        })
    }
};

const progressBar = document.getElementById('progressBar');
progressBar.value = 0;

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  let selectedFormat = select.options[select.selectedIndex].value;
  if(!selectedFormat) {
    selectedFormat = 18;
  }
  
  const video = youtubedl(url,
  // Optional arguments passed to youtube-dl.
  [`--format=${selectedFormat}`],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });
  
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
setInterval(helper.checkTheConnection, 10000);






function renderOptions(format_id, quality, format, filesize) {  
  select.innerHTML += `<option value="${format_id}">${quality}, ${format} => ${filesize}</option>`;
  return ;
}