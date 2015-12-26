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

    function loadSlides(slidesSelector, width, height) {
        var jsonSlidesArray = [],
            slides;
        if (slidesSelector != null) slides = $(slidesSelector + ' .slide');
        if (slides != null && slides.length > 0) {
            for (var i = 0; i < slides.length; i++) {
                var slideElement = slides[i]
                    slide = {
                        id: slideElement.id,
                        content: slideElement.outerHTML.replace('data-slipn-src', 'src')
                    };
                jsonSlidesArray.push(slide);
            }

            $(slidesSelector).remove();
        }


        if (jsonSlidesArray != null && jsonSlidesArray.length > 0) {
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
        loadSlides: loadSlides,
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










/*!
 * routie - a tiny hash router
 * v0.3.2
 * http://projects.jga.me/routie
 * copyright Greg Allen 2013
 * MIT License
*/
(function (w) {

    var routes = [];
    var map = {};
    var reference = "routie";
    var oldReference = w[reference];
    var paused = false;

    var Route = function (path, name) {
        this.name = name;
        this.path = path;
        this.keys = [];
        this.fns = [];
        this.params = {};
        this.regex = pathToRegexp(this.path, this.keys, false, false);

    };

    Route.prototype.addHandler = function (fn) {
        this.fns.push(fn);
    };

    Route.prototype.removeHandler = function (fn) {
        for (var i = 0, c = this.fns.length; i < c; i++) {
            var f = this.fns[i];
            if (fn == f) {
                this.fns.splice(i, 1);
                return;
            }
        }
    };

    Route.prototype.run = function (params) {
        for (var i = 0, c = this.fns.length; i < c; i++) {
            this.fns[i].apply(this, params);
        }
    };

    Route.prototype.match = function (path, params) {
        var m = this.regex.exec(path);

        if (!m) return false;


        for (var i = 1, len = m.length; i < len; ++i) {
            var key = this.keys[i - 1];

            var val = ('string' == typeof m[i]) ? decodeURIComponent(m[i]) : m[i];

            if (key) {
                this.params[key.name] = val;
            }
            params.push(val);
        }

        return true;
    };

    Route.prototype.toURL = function (params) {
        var path = this.path;
        for (var param in params) {
            path = path.replace('/:' + param, '/' + params[param]);
        }
        path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
        if (path.indexOf(':') != -1) {
            throw new Error('missing parameters for url: ' + path);
        }
        return path;
    };

    var pathToRegexp = function (path, keys, sensitive, strict) {
        if (path instanceof RegExp) return path;
        if (path instanceof Array) path = '(' + path.join('|') + ')';
        path = path
          .concat(strict ? '' : '/?')
          .replace(/\/\(/g, '(?:/')
          .replace(/\+/g, '__plus__')
          .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
              keys.push({ name: key, optional: !!optional });
              slash = slash || '';
              return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
          })
          .replace(/([\/.])/g, '\\$1')
          .replace(/__plus__/g, '(.+)')
          .replace(/\*/g, '(.*)');
        return new RegExp('^' + path + '$', sensitive ? '' : 'i');
    };

    var addHandler = function (path, fn) {
        var s = path.split(' ');
        var name = (s.length == 2) ? s[0] : null;
        path = (s.length == 2) ? s[1] : s[0];

        if (!map[path]) {
            map[path] = new Route(path, name);
            routes.push(map[path]);
        }
        map[path].addHandler(fn);
    };

    var routie = function (path, fn) {
        if (typeof fn == 'function') {
            addHandler(path, fn);
            routie.reload();
        } else if (typeof path == 'object') {
            for (var p in path) {
                addHandler(p, path[p]);
            }
            routie.reload();
        } else if (typeof fn === 'undefined') {
            routie.navigate(path);
        }
    };

    routie.lookup = function (name, obj) {
        for (var i = 0, c = routes.length; i < c; i++) {
            var route = routes[i];
            if (route.name == name) {
                return route.toURL(obj);
            }
        }
    };

    routie.remove = function (path, fn) {
        var route = map[path];
        if (!route)
            return;
        route.removeHandler(fn);
    };

    routie.removeAll = function () {
        map = {};
        routes = [];
    };

    routie.navigate = function (path, options) {
        options = options || {};
        var silent = options.silent || false;

        if (silent) {
            removeListener();
        }
        setTimeout(function () {
            window.location.hash = path;

            if (silent) {
                setTimeout(function () {
                    addListener();
                }, 1);
            }

        }, 1);
    };

    routie.noConflict = function () {
        w[reference] = oldReference;
        return routie;
    };

    var getHash = function () {
        return window.location.hash.substring(1);
    };

    var checkRoute = function (hash, route) {
        var params = [];
        if (route.match(hash, params)) {
            route.run(params);
            return true;
        }
        return false;
    };

    routie.pause = function () {
        paused = true;
    };
    routie.play = function () {
        paused = false;
    };

    var hashChanged = routie.reload = function () {
        if (paused == false) {
            var hash = getHash();
            for (var i = 0, c = routes.length; i < c; i++) {
                var route = routes[i];
                if (checkRoute(hash, route)) {
                    return;
                }
            }
        }
    };

    var addListener = function () {
        if (w.addEventListener) {
            w.addEventListener('hashchange', hashChanged, false);
        } else {
            w.attachEvent('onhashchange', hashChanged);
        }
    };

    var removeListener = function () {
        if (w.removeEventListener) {
            w.removeEventListener('hashchange', hashChanged);
        } else {
            w.detachEvent('onhashchange', hashChanged);
        }
    };
    addListener();

    w[reference] = routie;

})(window);