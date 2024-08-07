
const videoBtn = document.querySelector("#videoBtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");
const totalTimeElem = document.querySelector("#totalTime");
const currentTimeElem = document.querySelector("#currentTime");
const slider = document.querySelector("#slider");


let video = "";
let duration;
let  timerObj;
let currentPlayTime = 0;
let isPlaying = false;

const handleInput = function () {
    videoInput.click();
}
videoBtn.addEventListener("click", handleInput);

const acceptInputHandler = function(obj) {
    let selectedVideo;
    if(obj.type == "drop") {
        selectedVideo = obj.dataTransfer.files[0];
    } else {
        selectedVideo = obj.target.files[0];
    }
    const link = URL.createObjectURL(selectedVideo);
    const videoElement = document.createElement("video");
    videoElement.src = link;
    videoElement.setAttribute("class","video");
    //check if there are any video already present
    if (videoPlayer.children.length > 0) {

        //if present -> remove it
        videoPlayer.removeChild(videoPlayer.children[0]);
    }
    // now after the above check -> add the videoElement
    videoPlayer.appendChild(videoElement);
    video = videoElement;
    isPlaying = true;
    setPlayPause();
    videoElement.play();
    videoElement.volume = 0.3;
    videoElement.addEventListener("loadedmetadata", function () {
        //it gives in decimal value -> convert that into seconds
        duration = Math.round(videoElement.duration);
        //convert seconds into hrs:mins:secs
        let time = timeFormat(duration);
        totalTimeElem.innerText = time;
        slider.setAttribute("max", duration);
        startTimer();
    })
}
videoInput.addEventListener("change", acceptInputHandler);


/***************Volume and speed*********************/
//select the element
const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const toast = document.querySelector(".toast");

const speedUpHandler = function() {
    const videoElement = document.querySelector("video");
    if(videoElement == null) {
        return;
    }
    if(videoElement.playbackRate > 3) {
        return;
    }
    const increasedSpeed = videoElement.playbackRate + 0.5;
    videoElement.playbackRate = increasedSpeed;

    showToast(increasedSpeed + "X");
}


const speedDownHandler = function() {
    const videoElement = document.querySelector("video");
    if(videoElement == null) {
        return;
    }
    if(videoElement.playbackRate > 0) {
        const decreasedSpeed = videoElement.playbackRate - 0.5;
        videoElement.playbackRate = decreasedSpeed;

    showToast(decreasedSpeed + "X");
}
}


const volumeUpHandler = function() {
    const videoElement = document.querySelector("video");
    if(videoElement == null) {
        return;
    }
    if(videoElement.volume >= 0.99) {
        return;
    }
    const increasedVolume = videoElement.volume + 0.1;
    videoElement.volume = increasedVolume;
    const percentage = (increasedVolume * 100) + "%";
    showToast(percentage);
}


const volumeDownHandler = function() {
    const videoElement = document.querySelector("video");
    if(videoElement == null) {
        return;
    }
    if(videoElement.volume <= 0.1) {
        videoElement.volume = 0;
        return;
    }
    const decreasedVolume = videoElement.volume - 0.1;
    videoElement.volume = decreasedVolume;
    const percentage = (decreasedVolume * 100) + "%";
    showToast(percentage);
}


function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(function() {
        toast.style.display = "none";
    }, 2000);
}


speedUp.addEventListener("click", speedUpHandler);
speedDown.addEventListener("click", speedDownHandler);
volumeUp.addEventListener("click", volumeUpHandler);
volumeDown.addEventListener("click", volumeDownHandler);


/***************Controls************************/

const fullScreenElem = document.querySelector("#fullScreen");
const forwardBtn = document.querySelector("#forwardBtn");
const backwardBtn = document.querySelector("#backBtn");
const playPauseContainer = document.querySelector("#playPause");
const stopBtn = document.querySelector("#stopBtn");

/************fullscreen behaviour****************/
const handleFullScreen = function() {
    videoPlayer.requestFullscreen();
}
fullScreenElem.addEventListener("click", handleFullScreen);

/***********adding seek behaviour in slider****************/
slider.addEventListener("change", function (e) {
    let value = e.target.value;
    video.currentTime = value;
})


/*************forward and backward button***************/
function forward() {
    currentPlayTime = Math.round(video.currentTime) + 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Forward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentTimeElem.innerText = time;
}
forwardBtn.addEventListener("click", forward);

function backward () {
    currentPlayTime = Math.round(video.currentTime) - 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Backward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentPlayTime.innerText = time;
}
backwardBtn.addEventListener("click", backward);


/********Play Pause*********/

function setPlayPause() {
    if (isPlaying === true) {
        playPauseContainer.innerHTML = `<i class="fas fa-pause state"></i>`;
        video.play();
    } else {
        playPauseContainer.innerHTML = `<i class="fas fa-play state"></i>`;
        video.pause();
    }
}

playPauseContainer.addEventListener("click", function (e) {
    if (video) {
        isPlaying = !isPlaying;
        setPlayPause();
    }
})


/**********Stop Button*************/
const stopHandler = function () {
    if(video) {
        //remove the video from ui
        video.remove();
        //reset all the variables
        isPlaying = false;
        currentPlayTime = 0;
        slider.value = 0;
        video = "";
        duration = "";
        totalTimeElem.innerText = '--/--';
        currentTimeElem.innerText = '00.00';
        slider.setAttribute("value", 0);
        stopTimer();
        setPlayPause();
    }
}
stopBtn.addEventListener("click", stopHandler);


/***utility function to convert secs intro hrs:mns:secs****/
function timeFormat (timeCount) {
    let time = '';
    const sec = parseInt(timeCount, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;
    time = `${hours}:${minutes}:${seconds}`;
    return time;
}

//function that runs slider and timer
function startTimer() {
    timerObj = setInterval(function () {
        currentPlayTime = Math.round(video.currentTime);
        slider.value = currentPlayTime;
        const time = timeFormat(currentPlayTime);
        currentTimeElem.innerText = time;
        if(currentPlayTime == duration) {
            state = "pause";
            stopTimer();
            setPlayPause();
            video.remove();
            slider.value = 0;
            currentTimeElem.innerText = "00:00:00";
            totalTimeElem.innerText = '--/--/--';
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerObj);
}

/***************enable drag and drop*****************/
videoPlayer.addEventListener('dragenter', (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener('dragleave', (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener('drop', (e) => {
    e.preventDefault();
    acceptInputHandler(e);
})


/***************keyboard support*********************/
const body = document.querySelector("body");
// keyboard inputs
body.addEventListener("keyup", function (e) {
    console.log(e.key);
    if (!video) return;
    if (e.code == "Space") {
        isPlaying = !isPlaying
        setPlayPause();
    }
    else if (e.key == "ArrowUp" ) {
        volumeUpHandler()
    }
    else if (e.key == "ArrowDown") {
        volumeDownHandler();
    }
    else if (e.key == "+") {
        speedUpHandler();
    }
    else if (e.key == "-") {
        speedDownhandler();
    }
    else if (e.key == "ArrowRight") {
        forward();
    }
    else if (e.key == "ArrowLeft") {
        backward();
    }
})