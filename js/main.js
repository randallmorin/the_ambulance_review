//variables
var i, id, j, nav, navOffset, songs, video, videos,
videoLength, playButton, playButtons, stopButtons, pauseButtons,
progressBars, songLength, currentTime, progressContainer, progressBar,
expandButton, stopButtonContainers, elapsedTimeSection, elapsedTime, minutes,
seconds, totalTime, videoControls, videoContainer;

/*-------------
   Navigation
-------------*/
//sticky navigation on scroll
nav = document.getElementById('nav');
navOffset = nav.offsetTop;
window.onscroll = function() {stickyNav()};

//sticky nav
function stickyNav() {
  if (window.pageYOffset >= navOffset) {
    nav.classList.add('sticky');
    nav.style.boxShadow = '0px 3px 10px rgba(0, 0, 0, .3)';
  } else {
    nav.classList.remove('sticky');
    nav.style.boxShadow = 'none';
  }
}

//jQuery for smooth scrolling
$(document).ready(function() {
  $('.nav-link').on('click', function(e) {
    e.preventDefault();
    var hash = this.hash;
    $('html,body').animate({
      scrollTop: $(hash).offset().top - (nav.offsetHeight + 16)
    }, 400);
  });
});


/*-------------
  Audio/Video
-------------*/
//remove controls
removeControls();
//display song and video lengths
displayRunningTimes();
displayVideoLengths();

//remove default controls for video and audio
function removeControls() {
  songs = document.getElementsByTagName('audio');
  videos = document.getElementsByTagName('video');
  for (i = 0; i < songs.length; i++) {
    songs[i].removeAttribute('controls');
    songs[i].style.display = "none"; //remove allocated space in Safari
  }
  for (j = 0; j < videos.length; j++) {
    videos[j].removeAttribute('controls');
  }
}

//listen buttons
function expandTracks(n) {
  let trackContainer = document.getElementsByClassName('tracks')[n];
  let totalHeight = 0;
  let listenButton = document.getElementsByClassName('track-button')[n];
  for (i = 0; i < trackContainer.children.length; i++) {
    totalHeight += trackContainer.children[i].offsetHeight;
  }
  if (listenButton.classList.contains('listening')) {
    closeTracks(n);
    listenButton.classList.remove('listening');
  } else {
    if (n == 2) {
      trackContainer.style.transition = 'height 350ms ease-out';
    } else {
      trackContainer.style.transition = 'height 200ms ease-out';
    }
    trackContainer.style.height = totalHeight / 16 + 'rem';
    changeTrackIcon(n);
    listenButton.classList.add('listening');
  }
}

function closeTracks(n) {
  let trackContainer = document.getElementsByClassName('tracks')[n];
  let listenButton = document.getElementsByClassName('track-button')[n];
  changeTrackIcon(n);
  trackContainer.style.height = "0.75rem";
  listenButton.classList.remove('listening');
}

function changeTrackIcon(n) {
  let trackIcon = document.getElementsByClassName('show-tracklist')[n];
  if (trackIcon.classList.contains('fa-list')) {
    trackIcon.classList.remove('fas', 'fa-list');
    trackIcon.classList.add('far', 'fa-times-circle');
  } else {
    trackIcon.classList.remove('far', 'fa-times-circle');
    trackIcon.classList.add('fas', 'fa-list');
  }
}

/*--------------
  AUDIO PLAYER
--------------*/

//play the song with check
function playSong(n) {
  songs = document.getElementsByTagName('audio');
  playButtons = document.getElementsByClassName('play-button');
  progressBars = document.getElementsByClassName('progress-bar');
  stopButtonContainers = document.getElementsByClassName('stop-button-container');
  stopButtons = document.getElementsByClassName('stop-button');
  songTimes = document.getElementsByClassName('song-time');

  //check to see if song is playing first
  checkPlaying(n);

  if (playButtons[n].classList.contains('fa-play')) {
    songs[n].play();
    changePlayButton(n);
    stopButtonContainers[n].style.opacity = '1';
    if (stopButtons[n].classList.contains('fa-undo-alt')) {
      changeStopButton(n);
    }

    //handle song playing progress and song end
    songs[n].onended = function() {
      changePlayButton(n);
      stopButtonContainers[n].style.opacity = '0.5';
    };
    songs[n].ontimeupdate = function() {
      progressBars[n].style.width = songs[n].currentTime * 100 / songs[n].duration + '%';
    };

  } else if (playButtons[n].classList.contains('fa-pause')) {
    songs[n].pause();
    changePlayButton(n);
    changeStopButton(n);
  }
}

//stop song
function stopSong(n) {
  if (playButtons[n].classList.contains('fa-pause')) {
    songs[n].pause();
    songs[n].currentTime = 0;
    progressBars[n].style.width = songs[n].currentTime + '%';
    changePlayButton(n);
    stopButtonContainers[n].style.opacity = '0.5';
  } else {
    songs[n].pause();
    songs[n].currentTime = 0;
    progressBars[n].style.width = songs[n].currentTime + '%';
  }
}

//stop button behavior
function stopButtonBehavior(n) {
  songs = document.songs = document.getElementsByTagName('audio');
  playButtons = document.getElementsByClassName('play-button');
  progressBars = document.getElementsByClassName('progress-bar');
  stopButtonContainers = document.getElementsByClassName('stop-button-container');
  stopButtons = document.getElementsByClassName('stop-button');

  if (stopButtons[n].classList.contains('fa-undo-alt')) {
    songs[n].currentTime = 0;
    changeStopButton(n);
    playSong(n);
  } else {
    stopSong(n);
  }
}

//change play/pause buttons
function changePlayButton(n) {
  playButtons = document.getElementsByClassName('play-button');
  if (playButtons[n].classList.contains('fa-pause')) {
    playButtons[n].classList.remove('fa-pause');
    playButtons[n].classList.add('fa-play');

    //style play button
    playButtons[n].style.top = "50%";
    playButtons[n].style.left = "58%";
    playButtons[n].style.transform = "translate(-58%, -50%)";

  } else {
    playButtons[n].classList.remove('fa-play');
    playButtons[n].classList.add('fa-pause');

    //style pause button
    playButtons[n].style.top = "50%";
    playButtons[n].style.left = "50%";
    playButtons[n].style.transform = "translate(-50%, -50%)";
  }
}

//change stop button to restart button
function changeStopButton(n) {
  stopButtons = document.getElementsByClassName('stop-button');
  if (stopButtons[n].classList.contains('fa-stop')) {
    stopButtons[n].classList.remove('fa-stop');
    stopButtons[n].classList.add('fa-undo-alt');
  } else {
    stopButtons[n].classList.remove('fa-undo-alt');
    stopButtons[n].classList.add('fa-stop');
  }
}

//check to see if other songs are playing
function checkPlaying(n) {
  for (i = 0; i < songs.length; i++) {
    if (!songs[i].paused && i !== n) {
      songs[i].pause();
      songs[i].currentTime = 0;
      changePlayButton(i);
      progressBars[i].style.width = '0%';
      stopButtonContainers[i].style.opacity = '0.5';
    } else {
      continue;
    }
  }
}

function getSongRunningTimes(n) {
  songs = document.getElementsByTagName('audio');
  let songTimes = document.getElementsByClassName('song-time');
  let runningTime = songs[n].duration;
  let minutes = Math.floor(runningTime / 60);
  let seconds = Math.floor(runningTime - (minutes * 60));
  if (runningTime < 59 && seconds < 9) {
    songTimes[n].innerHTML = '0:0' + seconds;
  } else if (runningTime < 59) {
    songTimes[n].innerHTML = '0:' + seconds;
  } else if (runningTime > 59 && seconds < 9) {
    songTimes[n].innerHTML = minutes + ':0' + seconds;
  } else {
    songTimes[n].innerHTML = minutes + ':' + seconds;
  }
}

function displayRunningTimes() {
  songs = document.getElementsByTagName('audio');
  for (let n = 0; n < songs.length; n++) {
    songs[n].onloadedmetadata = function() {
      getSongRunningTimes(n);
    }
  }
}


/*--------------
  Video Player
--------------*/

function playVideo(n) {
  video = document.getElementsByTagName('video')[n];
  playButton = document.getElementsByClassName('video-play-container')[n];
  progressBar = document.getElementsByClassName('video-progress')[n];
  pauseButton = document.getElementsByClassName('video-pause')[n];
  elapsedTimeSection = document.getElementsByClassName('elapsed-time')[n];
  videoControls = document.getElementsByClassName('video-controls')[n];
  videoContainer = document.getElementsByClassName('video-container')[n];

  //play video
  video.play();
  playButton.style.display = 'none';
  if (pauseButton.classList.contains('fa-undo-alt')) {
    pauseButton.classList.add('fa-pause');
    pauseButton.classList.remove('fa-undo-alt');
  }

  //display controls on touch screen devices
  videoContainer.ontouchstart = function() {
    showControls(n);
  }

  //display controls on keyboard/mouse based devices
  videoContainer.onmouseover = function() {
    showControls(n);
  }

  video.ontimeupdate = function() {
    elapsedTime = Math.floor(video.currentTime);
    minutes = Math.floor(video.currentTime / 60);
    seconds = Math.floor(elapsedTime % 60);
    progressBar.style.width = video.currentTime * 100 / video.duration + '%';
    // console.log(elapsedTime, minutes, seconds);
    if (seconds < 10) {
      elapsedTimeSection.innerHTML = minutes + ':0' + seconds;
    } else {
      elapsedTimeSection.innerHTML = minutes + ':' + seconds;
    }
  }
  video.onended = function() {
    progressBar.style.width = '0%';
    playButton.style.display = 'block';
  }
}

function pauseVideo(n) {
  video = document.getElementsByTagName('video')[n];
  pauseButton = document.getElementsByClassName('video-pause')[n];
  playButton = document.getElementsByClassName('video-play-container')[n];

  //pause video
  if (pauseButton.classList.contains('fa-pause')) {
    video.pause();
    playButton.style.display = 'block';
    pauseButton.classList.remove('fa-pause');
    pauseButton.classList.add('fa-undo-alt');
  } else {
    video.currentTime = 0;
    playVideo(n);
  }
}

//check to see if other videos are playing
function checkVideoPlaying(n) {
  videos = document.getElementsByTagName('video');
  for (i = 0; i < videos.length; i++) {
    if (!videos[i].paused) {
      videos[i].pause;
    }
  }
}


function getVideoLength(n) {
  video = document.getElementsByTagName('video')[n];
  videoLength = document.getElementsByClassName('total-time')[n];
  totalTime = video.duration;
  minutes = Math.floor(totalTime / 60);
  seconds = Math.floor(totalTime - (minutes * 60));
  if (seconds < 9) {
    videoLength.innerHTML = minutes + ':0' + seconds;
  } else {
    videoLength.innerHTML = minutes + ':' + seconds;
  }
}

function displayVideoLengths() {
  videos = document.getElementsByTagName('video');
  for (let n = 0; n < videos.length; n++) {
    videos[n].onloadedmetadata = function() {
      getVideoLength(n);
    }
  }
}

function changeExpandButton(n) {
  if (expandButton.classList.contains('fa-expand')) {
    expandButton.classList.remove('fa-expand');
    expandButton.classList.add('fa-collpase');
  } else {
    expandButton.classList.remove('fa-collapse');
    expandButton.classList.add('fa-expand');
  }
}

function fullscreenVideo(n) {
  video = document.getElementsByTagName('video')[n];
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.mozRequestFullscreen) {
    video.mozRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

function showControls(n) {
  if (!video.paused) {
    videoControls.style.bottom = "0rem";
    setTimeout(function() {closeControls(n)}, 3000);
  }
  videoControls.style.transition = "bottom 150ms linear";
}

function closeControls(n) {
  videoControls.style.bottom = "-2.5rem";
}

// //determine video length
// function videoLength() {
//   songs = document.getElementsByTagName('audio');
//   durations = document.getElementsByClassName('duration');
//   for (let i = 0; i < songs.length; i++) {
//     songs[i].addEventListener('loadedmetadata', function() {
//       let time = songs[i].duration;
//       let minutes = Math.floor(time / 60);
//       let seconds = Math.floor(time - (minutes * 60));
//     });
//   }
// }
