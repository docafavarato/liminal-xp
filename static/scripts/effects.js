$(document).ready(function () {
    var clickEffect = document.getElementById("click-effect");
    var errorEffect = document.getElementById("error-effect");

    $(document).on("click", () => clickEffect.play());

    var toolbarButtons = document.querySelectorAll(".toolbar-btn, .toolbar-btn-ie");
    var openErrorModalButtons = document.querySelectorAll(".open-error-modal");
    
    Array.from(toolbarButtons).concat(...openErrorModalButtons).forEach(button => {
        if (!button.classList.contains("ignore-error")) {
            $(button).on("click", function () {
                errorEffect.play(); 
            });
        }
    });
});
