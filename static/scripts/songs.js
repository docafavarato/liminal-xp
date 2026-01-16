function playSong(id) {
    var allSongs = document.querySelectorAll(".liminal-song");
    
    allSongs.forEach(song => {
        closeSong(song.id);
    });

    var song = document.getElementById(id);
    song.play();
}

function pauseSong(id) {
    var song = document.getElementById(id);
    song.pause();
}

function closeSong(id) {
    var song = document.getElementById(id);
    song.pause();
    song.currentTime = 0;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

function setSongProgress(id) {
    var song = document.getElementById(id);
    const progress = document.getElementById(id + '-audio_progress');
    song.currentTime = progress.value; 
}

function syncSongProgress(id) { 
    var song = document.getElementById(id);
    const progress = document.getElementById(id + '-audio_progress');
    var positionText = document.getElementById(id + '-audio_position');
    var lengthText = document.getElementById(id + '-audio_length');

    progress.max = song.duration;
    progress.value = song.currentTime;

    positionText.innerText = formatTime(song.currentTime);
    lengthText.innerText = formatTime(song.duration);

}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".liminal-song").forEach((song) => {
        syncSongProgress(song.id);
        song.addEventListener("timeupdate", () => {
            syncSongProgress(song.id);
        });
    });
    
    // var songs = document.querySelectorAll(".liminal-song");
    // document.querySelectorAll(".space-play-song").forEach((image) => {
    //     image.addEventListener("click", () => {
    //         var randomIndex = Math.floor(Math.random() * songs.length);
    //         var song = songs[randomIndex];
    //
    //         songToast(song.getAttribute("song_name"));
    //
    //         setTimeout(() => {
    //             playSong(song.getAttribute("song_name"));
    //         }, 500);
    //     });
    // });
    
    var isPlaying = false;
    var currentPlayingFolder = null;
    var song = null;
    document.querySelectorAll(".space-play-song").forEach((folder) => {
        folder.addEventListener("click", function() {
            var autoplay = document.getElementById("holder").getAttribute("autoplay");
           if (!isPlaying && autoplay == "on") {
               song = playRandomSong();
               isPlaying = true;
               currentPlayingFolder = document.getElementById(folder.getAttribute("onclick").split("'")[1]);
               currentPlayingFolder.querySelector(".close-button").addEventListener("click", () => {
                    closeSong(song);
                   isPlaying = false;
                   document.getElementById("song-toast").style.display = "none";
               });
           } 
        });
    });
});

function playRandomSong() {
    var songs = document.querySelectorAll(".liminal-song");
    var randomIndex = Math.floor(Math.random() * songs.length);
    var song = songs[randomIndex].getAttribute("song_name");
    
    playSong(song);
    songToast(song);

    return song;
}

function songToast(song_name) {
    var songToastContent = document.getElementById("song-toast-content");
    var notificationEffect = document.getElementById("notify-effect");

    songToastContent.innerHTML = "Now playing '" + song_name + "'";
    $("#song-toast").fadeIn(300);

    notificationEffect.play();
}

function songForward(id) {
    var song = document.getElementById(id);
    song.currentTime = song.currentTime + 5;
}

function songBackward(id) {
    var song = document.getElementById(id);  
    song.currentTime = song.currentTime - 5;
}
