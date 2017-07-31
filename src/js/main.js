'use strict';
function ScrollRevealAnimation(wrapper, config) {
    this.wrapper = window[wrapper] || document.getElementsByClassName(wrapper);
    this.wrapperChildren = this.wrapper.children;
    this.body = document.getElementsByTagName('body');
    this.transformHeight = 0;
    this.config = {
        scrollDuration: 200,
        animation: 'ease'
    };

    // Initialize function
    this.init = function () {
        this.disableBodyScroll();
        this.buildConfig(config);
        this.initSections();
        this.resize();
        this.scrollSectionAnimation();
        this.detectActiveSection();
    };

    // Build config
    this.buildConfig = function(config){
        for (var option in config) {
            this.config[option] = config[option];
        }
    };

    // Body scroll disable
    this.disableBodyScroll = function () {
        this.body[0].style.cssText = 'overflow:hidden;';
        this.wrapper.style.cssText = '-webkit-transition-timing-function:'+this.config.animation+';'+
                                  '-moz-transition-timing-function:'+this.config.animation+';'+
                                  '-o-transition-timing-function:'+this.config.animation+';'+
                                  'transition-timing-function:'+this.config.animation+';'+
                                  '-webkit-transition-duration:'+this.config.scrollDuration/1000+'s;'+
                                  '-moz-transition-duration:'+this.config.scrollDuration/1000+'s;'+
                                  '-o-transition-duration:'+this.config.scrollDuration/1000+'s;'+
                                  'transition-duration:'+this.config.scrollDuration/1000+'s;';
    };

    // Set section background image, height and section number on init
    this.initSections = function(){
        for (var i = 0; i<this.wrapperChildren.length;i++) {
            var itemElem = this.wrapperChildren[i];
            var itemImageData = itemElem.getAttribute('data-img');
            itemElem.removeAttribute('data-img');
            this.setBackground(itemImageData, itemElem);
        }

        this.sectionsHeight();
    };

    this.setBackground = function(img, section){
        if(img){
            var overlay = document.createElement('div');
            overlay.className += 'reveal-overlay';
            overlay.style.cssText = 'position:absolute;'+
              'left:0;'+
              'top:0;'+
              'z-index:0;'+
              'width:100%;'+
              'height:100%;'+
              'background-size:cover;'+
              'background-position:center top;'+
              'background-repeat:no-repeat;'+
              'background-image:url('+img+');';
            section.insertBefore(overlay,section.children[0]);
        }
    };

    // Calculate sections height
    this.sectionsHeight = function(){
        this.windowHeight = document.documentElement.clientHeight;
        for (var i = 0; i < this.wrapperChildren.length; i++) {
            var itemElem = this.wrapperChildren[i];
            itemElem.style.cssText = 'height:'+this.windowHeight+'px;';
        }
    };

    // Detect user scroll
    this.scrollSectionAnimation = function () {
        var self = this;
        self.animationFlag = true;
        window.onwheel = function (event) {
            event.preventDefault();
            self.scrollDirection =  event.deltaY > 0;
            if(self.animationFlag && self.scrollDirection) {
                self.transformHeight = self.transformHeight + self.windowHeight;
                self.scrollSection();
            } else if(self.animationFlag) {

            }
        }
    };

    // Sections movement
    this.scrollSection = function () {
        var move = '-webkit-transform: translate('+this.transformHeight+'px,0);'+
                    '-moz-transform: translate('+this.transformHeight+'px,0);'+
                    '-ms-transform: translate('+this.transformHeight+'px,0);'+
                    '-o-transform: translate('+this.transformHeight+'px,0);'+
                    'transform: translate('+this.transformHeight+'px,0);';
        this.wrapper.style.cssText = move;
    };

    // Parallax animation
    this.parallaxAnimation = function(){
        var parallax = this.windowHeight*70/100;
    };

    // Detect active section
    this.detectActiveSection = function(){

    };

    // Show one slide on resize
    this.showOneSlideOnResize = function(){
        window.scrollTo(0, self.currentSlide * self.windowHeight);
    };

    // Resize window
    this.resize = function () {
        var self = this;
        window.onresize = function () {
            self.sectionsHeight();
            self.showOneSlideOnResize();
        };
    };

    this.init();
}