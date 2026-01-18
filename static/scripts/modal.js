var globalIndex = 1;

let currentMouseX = 0;
let currentMouseY = 0;

document.addEventListener('mousemove', (e) => {
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
});

var openedApps = [];

function focusModal(targetId) {
    const target = document.getElementById(targetId);
    const modalContent = target.firstElementChild;

    globalIndex += 1;
    modalContent.style.zIndex = globalIndex;

    target.style.display = "block";
    
    highlightCurrentApp(targetId);
}

function maximizeModal(targetId) {
    var target = document.getElementById(targetId);
    var modalContent = target.firstElementChild;

    modalContent.style.left = "0px";
    modalContent.style.top = "0px";
    modalContent.style.width = "100vw";
    modalContent.style.height = "calc(100vh - 35px)";
    target.classList.add("maximized");
}

function minimizeModal(targetId) {
    var target = document.getElementById(targetId);
    var modalContent = target.firstElementChild;

    modalContent.classList.add("minimized-anim");
    setTimeout(() => {
        target.style.display = "none";
        modalContent.classList.remove("minimized-anim");
    }, 400);
}

function closeModal(target) {
    target = document.getElementById(target);
    target.style.display = "none";

    target.firstElementChild.style.left = "0px";
    target.firstElementChild.style.top = "0px";

    openedApps.splice(openedApps.indexOf(target), 1);
    removeFromTaskbar(target);
    target.firstElementChild.classList.remove("current-app"); 
} 

function openModal(targetId) { 
    const target = document.getElementById(targetId);
    if (!target) return; 

    const modalContent = target.firstElementChild; 
    if (!modalContent) return; 

    target.style.visibility = "hidden"; 
    target.style.display = "block"; 

    const viewW = window.innerWidth; 
    const viewH = window.innerHeight;
    const modalW = modalContent.offsetWidth;
    const modalH = modalContent.offsetHeight;

    const OFFSET = 10; // Distância do cursor

    let posX = currentMouseX + OFFSET;
    let posY = currentMouseY + OFFSET;

    if (posX + modalW > viewW) {
        posX = currentMouseX - modalW - OFFSET;
    }

    if (posY + modalH > viewH) {
        posY = currentMouseY - modalH - OFFSET;
    }

    if (posX < 0) posX = 10;
    if (posY < 0) posY = 10;

    globalIndex += 1;
    modalContent.style.zIndex = globalIndex;
    modalContent.style.left = posX + "px";
    modalContent.style.top = posY + "px";

    target.style.visibility = "visible";
   
    highlightCurrentApp(targetId);
    
    if (!openedApps.includes(target)) {
        openedApps.push(target);
        pushToTaskbar(target)
    }

}

function highlightCurrentApp(targetId) {
    var target = document.getElementById(targetId).firstElementChild;
    var modals = document.querySelectorAll(".application-window");
    modals.forEach(m => {
        m.classList.remove("current-app"); 
    });
    target.classList.add("current-app");
}

function nextImage(originId) {
    var origin = document.getElementById(originId);
    var spaceName = originId.split("-")[0];
    var index = parseInt(originId.split("-")[2]);

    var targetId = spaceName + "-image_media-" + (index + 1);
    var target = document.getElementById(targetId);
    if (target.classList.contains("image-media")) {
        target.firstElementChild.style.zIndex = globalIndex + 2;
        target.firstElementChild.style.left = origin.firstElementChild.style.left;
        target.firstElementChild.style.top = origin.firstElementChild.style.top;
        target.firstElementChild.style.width = origin.firstElementChild.style.width;
        target.firstElementChild.style.height = origin.firstElementChild.style.height;
        target.style.display = "block";

        highlightCurrentApp(targetId);
        pushToTaskbar(target);

        closeModal(originId);
    }
}

function previousImage(originId) {
    var origin = document.getElementById(originId);
    var spaceName = originId.split("-")[0];
    var index = parseInt(originId.split("-")[2]);

    var targetId = spaceName + "-image_media-" + (index + -1);
    var target = document.getElementById(targetId);
    if (target.classList.contains("image-media")) {
        target.firstElementChild.style.zIndex = globalIndex + 2;
        target.firstElementChild.style.left = origin.firstElementChild.style.left;
        target.firstElementChild.style.top = origin.firstElementChild.style.top;
        target.firstElementChild.style.width = origin.firstElementChild.style.width;
        target.firstElementChild.style.height = origin.firstElementChild.style.height;
        target.style.display = "block";

        highlightCurrentApp(targetId);

        pushToTaskbar(target);

        closeModal(originId);
    }
}

function removeFromTaskbar(app) {
    appName = app.querySelector(".window-header-top span").innerText;
    var element = document.getElementById("taskbar-app-" + app.id + "-" + appName);
    element.remove();
}

function pushToTaskbar(app) {
    if (app.id != "error-modal") {
        appIcon = app.querySelector(".window-header-top img").src;
    } else {
        appIcon = "";
    }
    appName = app.querySelector(".window-header-top span").innerText;

    var taskbar = document.getElementById("taskbar");
    taskbar.innerHTML += `<div onclick='focusModal("${app.id}")' class='taskbar-app' id='taskbar-app-${app.id}-${appName}'><img src='${appIcon}'><span>${appName}</span></div>`;
}

function toggleMenu() {
    var menu = document.getElementById("menu");
    if (menu.style.display == "none") menu.style.display = "block";
    else menu.style.display = "none";
}

$(document).ready(function () {

    $('.application').draggable({
        containment: ".containment",
        handle: ".application-img, .application-name",
        scroll: false,
        grid: [100, 100] })
    $('.application-window').draggable({
        containment: ".containment",
        handle: ".window-header",
        scroll: false,
    })

    var toolbarButtons = document.querySelectorAll(".toolbar-btn, .toolbar-btn-ie");
    var openErrorModalButtons = document.querySelectorAll(".open-error-modal, .menu-body-left-item, .menu-body-right-item, .menu-footer-item");
    
    Array.from(toolbarButtons).concat(...openErrorModalButtons).forEach(button => {
        if (!button.classList.contains("ignore-error")) {
            $(button).on("click", function () {
                openModal("error-modal");
            });
        }
    });

    var modals = document.querySelectorAll(".application-window");
    modals.forEach(modal => {
        $(modal).on("click", function(e) {

            if ($(e.target).closest(".space, .media, .toolbar-btn, .toolbar-btn-ie, .open-error-modal, .next-image, .previous-image").length > 0) {
                return;
            }

            globalIndex += 1;
            modal.style.zIndex = globalIndex;
            highlightCurrentApp(modal.parentNode.id);
        });

        $(modal).on("dragstart", function() {
            if (modal.parentNode.classList.contains("maximized")) {
                modal.style.width = "800px";
                modal.style.height = "500px";
                modal.parentNode.classList.remove("maximized");
            }
        });
    });

});

