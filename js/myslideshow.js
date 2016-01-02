(function () {

    /////////////////////////////////////
    // FULLSCREEN
    /////////////////////////////////////
    function showFullScreenOption() {
        var optionExists = false;
        var element = document.body;
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
        if (requestMethod) optionExists = true;

        if (optionExists && !isFullscreen()) {
            $('.fullscreen').fadeIn('slow');
            $(".fullscreen").click(function () {
                var elem = document.body; // Make the body go full screen.
                requestFullScreen(elem);
            });
        }
    };
    function requestFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
            $('.fullscreen').fadeOut('slow');
        }
        /*else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }*/
    };
    function isFullscreen() {
        if ((screen.availHeight || screen.height - 30) <= window.innerHeight) return true;
        return false;
    };
    /////////////////////////////////////



    function closeButtonEvents() {
        $('.slide .container:hidden').fadeIn(1500);
        $('.close').click(function () {
            $(this).parent().fadeOut('fast');
        });
    };


    $(window).load(function () {
        $('#slipn').on('slideLoading', showFullScreenOption);
        $('#slipn').on('slideLoading', closeButtonEvents);
    });
})();