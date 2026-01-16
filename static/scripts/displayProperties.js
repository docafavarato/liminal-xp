function changePreview(path) {
    var preview = document.querySelector("#wallpaper-preview");

    preview.src = path;
}

function changeWallpaper() {
    var path = document.querySelector("#wallpaper-preview").src;

    document.body.style.backgroundImage = "url('" + path + "')";
}
