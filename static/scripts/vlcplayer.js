function playVideo(id) {
    const video = document.getElementById(id);
    
    video.play();
}

function stopVideo(id) {
    const video = document.getElementById(id);

    video.pause();
}

function closeVideo(id) {
    const video = document.getElementById(id);

    video.pause();
    video.currentTime = 0;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}


function setProgress(spaceName, loopIndex) {
    const video = document.getElementById(spaceName + '-video-' + loopIndex);
    const progress = document.getElementById(spaceName + '-video_progress-' + loopIndex);
    video.currentTime = progress.value;
}

function syncProgress(spaceName, loopIndex) {
    const video = document.getElementById(spaceName + '-video-' + loopIndex);
    const progress = document.getElementById(spaceName + '-video_progress-' + loopIndex);
    const progress_text = document.getElementById(spaceName + '-video_progress_text-' + loopIndex)

    progress.max = video.duration;
    progress.value = video.currentTime;

    progress_text.innerText = formatTime(video.currentTime) + " / " + formatTime(video.duration);

}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("video").forEach((video) => {
        const spaceName = video.id.split("-")[0];
        const loopIndex = video.id.split("-")[2];

        video.addEventListener("timeupdate", () => {
            syncProgress(spaceName, loopIndex);
        })
    })
})