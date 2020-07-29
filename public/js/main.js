// console.log("test");

var cardAddHover = function() {
    $(this).addClass("active");
    $("."+$(this)[0].children[0].className).addClass("active");
};

var cardRemoveHover = function() {
    $(this).removeClass("active");
    $("."+$(this)[0].children[0].classList[0]).removeClass("active");
};

$('.post-card').hover(cardAddHover, cardRemoveHover);