# Slipn

Slipn is a slide show library for interactive presentations.
The library can do several things:
* resize slides to the current window size (or centers slides on bigger monitors)
* allows deep linking to slides
* slide preloading (only load slides as they are needed)
* old slide removal (keeps the current page size down - helpful if viewing large image slides on an iPad, for example)
* uses your “previous” and “next” elements for slide control


## Getting Started

There are a couple of ways to download Slipn:
* [Download the zip](https://github.com/CaseyHaralson/slipn/archive/0.1.0.zip)
* Bower – `bower install slipn`
* Clone the repo: `git clone https://github.com/caseyharalson/slipn.git`


## Usage

An example of the following steps put together can be found [here.](https://github.com/CaseyHaralson/slipn/blob/master/demo.html)
The easiest way to start using Slipn is to download the library and then open the demo.html file.
You can then edit the demo file in your favorite editor to change the slides and styles.

Note: Slipn requires jQuery so that library will need to be [downloaded](https://jquery.com/download/) or [linked to from a CDN](https://jquery.com/download/#using-jquery-with-a-cdn).

**First**, reference the slipn.css file in your header and the slipn.js file after the jQuery library.

**Second**, add the slipn div to your page:

`<div id='slipn'></div>`

**Third**, add the slides to the slipn div.
There are several things to note here:
* the slide id will show up in the browser url for deep linking
* the slide element needs a class of "slide"
* any elements that need to fill the browser window need a class of "resize"
* image source needs to be defined in a "data-slipn-src" property

```
<div id='slipn'>
	<div id='slide01' class='slide'>
		<img class='resize' data-slipn-src='beach01.jpg' />
	</div>
	<div id='slide02' class='slide'>
		<img class='resize' data-slipn-src='beach02.jpg' />
	</div>
</div>
```

**Fourth**, after the slipn.js reference, the slides data and any options need to be passed to slipn:
```
slipn.loadSlides(1920, 1080);
slipn.preloadSlides(3);
slipn.navigationButtons('.previous', '.next');
```

**Lastly**, start the slide show:

`slipn.start();`


## Options

### Loading The Slides Data (required)
Loading the slides pulls in the slides data and how big the slides should be.
If the browser screen is smaller than the slides, the slides will scale to fit the window.
If the browser screen is bigger than the slides, the slides will center inside the window.
The **loadSlides** function takes two parameters:
* the slides width (example: 1920)
* the slides height (example: 1080)

### Navigation Buttons (required)
The slide show will not automatically advance which requires the page to have previous and next elements.
These elements aren't included with slipn so they will need to be added and styled to your liking.
Once the buttons are on the page, slipn can be told about them through the navigationButtons function.
The **navigationButtons** function takes two parameters:
* the css selector for the previous button (example: '.previous')
* the css selector for the next button (example: '.next')

### Starting The Slideshow (required)
There are two functions that will start the slideshow after the options have been loaded:
* start
* slide

### Preloading Slides
Slipn will, by default, load all of the slides once it is started.
The slides can be loaded only as necessary by using the preloadSlides function.
The **preloadSlides** function takes one parameter:
* how many slides to preload (example: 3)

### Removing slides
Slipn will, by default, keep all of the slides once they are loaded.
If the slides should be removed after they have been seen, the keepSlides function can be used.
Removing the slides can help to keep the loaded page size down for less powerful devices.
The **keepSlides** function takes one parameter:
* how many slides should be kept after viewing (example: 2)


## Events
There is only one event that is emitted on the #slipn div.
* the **slideLoading** event is emitted whenever a slide is being loaded.