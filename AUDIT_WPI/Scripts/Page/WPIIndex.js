Codebase.helpersOnLoad(['jq-select2', 'jq-slick']);

$(document).ready(function () {
    $('.slider').slick({
        dots: true, // Add navigation dots
        arrows: false, // Hide navigation arrows
        autoplay: true, // Enable autoplay
        autoplaySpeed: 5000 // Set autoplay speed in milliseconds
    });
});