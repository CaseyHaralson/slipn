(function () {



    /////////////////////////////////////
    // RESIZE
    /////////////////////////////////////

    function resizeAndCenterSlides() {
        var maxWidth = $(window).width(),
            maxHeight = $(window).height(),
            widthRatio = maxWidth / slidesWidth,
            heightRatio = maxHeight / slidesHeight;

        if (slidesWidth > maxWidth && slidesHeight > maxHeight) {
            var ratio = widthRatio;
            if (widthRatio * slidesHeight < maxHeight) {
                ratio = heightRatio;
            }

            // resizing
            $('#slipn .slide .resize').each(function () {
                $(this).attr('width', slidesWidth * ratio)
                .attr('height', slidesHeight * ratio);
            });

            // clear centering
            $('#slipn .slide .resize').each(function () {
                $(this).css('left', 0)
                .css('top', 0);
            });
        }
        else {

            // center slide
            var left = (maxWidth - slidesWidth) / 2;
            var top = (maxHeight - slidesHeight) / 2;
            if (left < 0) left = 0;
            if (top < 0) top = 0;
            $('#slipn .slide .resize').each(function () {
                $(this).css('left', left)
                .css('top', top);
            });



            // clear sizing
            $('#slipn .slide .resize').each(function () {
                $(this).attr('width', null)
                .attr('height', null);
            });
        }

        //$('#slipn .slide').each(function () {
        //    $(this).attr('min-width', slidesWidth).attr('max-width', slidesWidth)
        //    .attr('min-height', slidesHeight).attr('max-height', slidesHeight);
        //});
    };
    $(window).on('resize', function () {
        resizeAndCenterSlides();
    });

    /////////////////////////////////////



    /////////////////////////////////////
    // ROUTING
    /////////////////////////////////////

    function previousSlide() {
        var previousId = -1;
        var currentId = getHashId();
        if (currentId != -1) {
            for (var i = 0; i < jsonSlides.length; i++) {
                var slide = jsonSlides[i];
                if (slide.id != currentId) {
                    previousId = slide.id;
                }
                else if (slide.id == currentId) {
                    // we found the current slide
                    // and the previousId should be filled (maybe not, so lets test)
                    // route to the previous slide
                    if (previousId == -1) previousId = jsonSlides[jsonSlides.length - 1].id;
                    routie('/' + previousId);
                    break;
                }
            }
        }
    };
    function nextSlide() {
        var firstSlideId = -1;
        var foundCurrentSlide = false;
        var foundNextSlide = false;
        var currentId = getHashId();
        if (currentId != -1) {
            for (var i = 0; i < jsonSlides.length; i++) {
                var slide = jsonSlides[i];
                if (firstSlideId == -1) firstSlideId = slide.id;

                if (slide.id == currentId) {
                    foundCurrentSlide = true;
                }
                else if (foundCurrentSlide) {
                    // this should be the next slide
                    var nextId = slide.id;
                    foundNextSlide = true;
                    routie('/' + nextId);
                    break;
                }
            }

            // switch to first if at the end
            if (!foundNextSlide && firstSlideId != -1) routie('/' + firstSlideId);
        }
    };


    function loadRoutes(slides) {
        for (var i = 0; i < slides.length; i++) {
            var slide = slides[i];
            routie('/' + slide.id, loadSlide);
        }
    };

    function getHashId() {
        var hash = window.location.hash;
        var id = -1;
        if (hash != null && hash.indexOf('/') > -1) {
            hash = hash.substring(hash.indexOf('/'));
            if (hash.length > 1) id = hash.substring(1);
        }
        if (id != null && id != -1) return id;
        else return -1;
    }

    function loadSlide() {
        var id = getHashId();
        if (id != -1) {
            removeOldSlidesIfOnPage(id);
            addNextSlidesIfNotAlreadyOnPage(id);

            // make sure the new slide is sized
            resizeAndCenterSlides();

            // hide the previous slide
            $('#slipn .activeSlide').fadeOut(500);
            $('#slipn .activeSlide').removeClass('activeSlide');

            // show the current slide
            $('#' + id).addClass('activeSlide');
            $('#' + id).fadeIn(500);
            $('#slipn').trigger('slideLoaded');
        }
    };

    function removeOldSlidesIfOnPage(id) {
        if (numberOfOldSlidesToKeep != null) {
            var newSlideIndex = -1;
            for (var i = 0; i < jsonSlides.length; i++) {
                var slide = jsonSlides[i];
                if (slide.id == id) {
                    newSlideIndex = i;
                    break;
                }
            }

            if (newSlideIndex != -1 && newSlideIndex > numberOfOldSlidesToKeep) {
                var slidesToRemove = [],
                    numberOfSlidesToRemove = newSlideIndex - numberOfOldSlidesToKeep;
                for (var i = 0; i < numberOfSlidesToRemove; i++) {
                    slidesToRemove.push(jsonSlides[i]);
                }

                // see if the slides are already on the page
                // and then remove them if so
                for (var i = 0; i < slidesToRemove.length; i++) {
                    var slide = slidesToRemove[i];
                    $('#' + slide.id).remove();
                }
            }
        }
    };

    function addNextSlidesIfNotAlreadyOnPage(id) {
        var newSlide,
            nextSlides = [];
        for (var i = 0; i < jsonSlides.length; i++) {
            var slide = jsonSlides[i];
            if (slide.id == id) {
                newSlide = slide;
            }
            else if (newSlide != null) {
                nextSlides.push(slide);
                if (nextSlides.length == numberOfSlidesToPreload) break;
            }
        }

        // see if the slide is already on the page
        var slideElement = $('#' + id);
        if (slideElement.length == 0) {
            var html = $('#slipn').html();
            $('#slipn').html(html + newSlide.content);
        }

        // check to see if the next slides are on the page
        for (var i = 0; i < nextSlides.length; i++) {
            var slide = nextSlides[i];
            var slideElement = $('#' + slide.id);
            if (slideElement.length == 0) {
                var html = $('#slipn').html();
                $('#slipn').html(html + slide.content);
            }
        }
    };

    /////////////////////////////////////






    var jsonSlides = [],
        slidesWidth = 100,
        slidesHeight = 100,
        previousButtonSelector,
        nextButtonSelector,
        numberOfSlidesToPreload,
        numberOfOldSlidesToKeep;

    function loadJsonSlides(jsonSlidesArray, width, height) {
        if (jsonSlidesArray != null) {
            jsonSlides = jsonSlidesArray;

            if (width != null) slidesWidth = width;
            if (height != null) slidesHeight = height;

            routie.pause(); // had to add this to the library
            loadRoutes(jsonSlides);
            routie.play(); // had to add this to the library
        }
    };

    function start() {
        var id = getHashId();
        if (id == -1 && jsonSlides != null && jsonSlides.length > 0) {
            var firstId = jsonSlides[0].id;
            routie('/' + firstId);
        }
        else routie.reload();
    };

    function navigationButtonSelectors(previous, next) {
        if (previous != null && previous.length > 0) {
            $(previous).click(previousSlide);
        }
        if (next != null && next.length > 0) {
            $(next).click(nextSlide);
        }
    };


    var slipn = {
        loadJsonSlides: loadJsonSlides,
        start: start,
        slide: start,
        navigationButtonSelectors: navigationButtonSelectors,
        preloadSlides: function (number) {
            if (number != null) numberOfSlidesToPreload = number;
        },
        keepSlides: function (number) {
            if (number != null) numberOfOldSlidesToKeep = number;
        }
    };






    window.slipn = slipn;
})();