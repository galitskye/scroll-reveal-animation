'use strict';
function ScrollRevealAnimation(wrapper, config) {
    this.wrapper = window[wrapper] || document.getElementsByClassName(wrapper);
    this.wrapperChildren = this.wrapper.children;
    this.body = document.getElementsByTagName('body');
    this.transformHeight = 0;
    this.animationFlag = true;
    this.activeSection = 0;
    this.indexSlidesImages = [];
    this.config = {
        scrollDuration: 200,
        animation: 'ease',
        parallax: true,
        parallaxOffset: 70,
        destroySlider: 0
    };

    // Initialize function
    this.init = function () {
        this.buildConfig(config);
        this.initSections();
        this.detectActiveSection();
        this.initControls();
        this.resize();
    };

    // Build config
    this.buildConfig = function(config){
        for (var option in config) {
            this.config[option] = config[option];
        }
    };

    // Main Styles
    this.wrapperStyles = function (dur) {
        var animationDuration = dur ? 'transform '+this.config.scrollDuration+'ms '+this.config.animation : '';
        this.wrapper.style.transition = animationDuration;
    };

    // Body scroll disable
    this.disableBodyScroll = function () {
        this.body[0].style.cssText = 'overflow:hidden;'+
                                     'height:'+this.windowHeight+'px';
    };

    // Set section background image, height and section number on init
    this.initSections = function(){
        this.anchorMenu();
        for (var i = 0; i<this.wrapperChildren.length;i++) {
            var itemElem = this.wrapperChildren[i];

            var itemImageData = itemElem.getAttribute('data-img');
            itemElem.removeAttribute('data-img');
            this.setBackground(itemImageData, itemElem, i);

            this.appendNavItem(itemElem)
        }
        this.sectionsHeight();
    };

    this.setBackground = function(img, section, num){
        if(img){
            this.indexSlidesImages.push(num);
            var overlay = document.createElement('div');
            overlay.className += 'reveal-overlay';
            overlay.style.cssText =
              'background-image:url('+img+');'+
              'transition-timing-function:'+this.config.animation+';'+
              'transition-duration:'+this.config.scrollDuration+'ms;'+
              'transition-property: transform;';
            section.insertBefore(overlay,section.children[0]);
        }
    };
    
    // Anchor menu
    this.anchorMenu = function () {
        this.menu = document.createElement("ul");
        this.menu.className = 'reveal-nav';
        this.menu.id = 'reveal-nav';
        this.body[0].insertBefore(this.menu,this.wrapper);
        this.anchorMenuInit();
    };

    this.appendNavItem = function (itemElem) {
        var anchorLink = itemElem.getAttribute('data-anchor');
        var li = document.createElement('li');
        var a = document.createElement('a');
        itemElem.removeAttribute('data-anchor');
        itemElem.id = anchorLink;
        li.className = 'nav-item';
        a.href = anchorLink;
        a.innerText = anchorLink;
        li.appendChild(a);
        this.menu.appendChild(li);
    };

    this.anchorMenuInit = function () {
        var self = this;
        this.menu.addEventListener('click', function (event) {
            var target = event.target;
            while(target !== self.menu) {
                target = target.parentNode;
            }
            event.preventDefault();
        });
    };

    // Calculate sections height
    this.sectionsHeight = function(){
        this.windowHeight = document.documentElement.clientHeight;
        this.disableBodyScroll();

        for (var i = 0; i < this.wrapperChildren.length; i++) {
            var itemElem = this.wrapperChildren[i];
            itemElem.style.cssText = 'height:'+this.windowHeight+'px;';
        }
    };

    // Detect user scroll
    this.scrollSectionAnimation = function () {
        var self = this,
            directionTop = this.scrollDirection && this.activeSection != this.wrapperChildren.length - 1,
            directionBottom = !this.scrollDirection && this.activeSection !== 0;

        if((directionTop || directionBottom) && this.animationFlag) {
            this.wrapperStyles(true);
            self.animationFlag = false;

            self.scrollSection();

            setTimeout(function () {
                self.animationFlag = true;
            },self.config.scrollDuration);
        }
    };

    // Sections movement
    this.scrollSection = function () {
        if(this.scrollDirection) {
            this.transformHeight = this.transformHeight - this.windowHeight;
        } else {
            this.transformHeight = this.transformHeight + this.windowHeight;
        }
        this.detectActiveSection();
        this.moveWrapper();
    };

    this.moveWrapper = function () {
        this.wrapper.style.transform = 'translate3d(0,'+this.transformHeight+'px,0)';
    };

    // Detect active section
    this.detectActiveSection = function(){
        this.wrapperChildren[this.activeSection].className = 'reveal-item';
        this.activeSection = -this.transformHeight / this.windowHeight;
        this.wrapperChildren[this.activeSection].className = 'reveal-item';
        this.wrapperChildren[this.activeSection].classList.add('reveal-current');
        this.slideBefore();
        this.slideAfter();
    };

    this.slideBefore = function () {
        if(this.activeSection > 0) {
            this.wrapperChildren[this.activeSection-1].classList.add('reveal-before');
        }
    };

    this.slideAfter = function () {
        if(this.activeSection < this.wrapperChildren.length - 1) {
            this.nextSlide = this.wrapperChildren[this.activeSection+1];
            this.nextSlide.classList.add('reveal-after');
        }
        if(this.config.parallax){
            this.imagesParallax();
        }
    };
    // Parallax mode
    this.imagesParallax = function () {
        var parallax = -(this.windowHeight * this.config.parallaxOffset / 100);
        this.wrapperChildren[this.activeSection].children[0].style.transform = 'translate3d(0,0,0)';
        if(this.nextSlide && this.nextSlide.classList.contains('reveal-after')) {
            this.nextSlide.children[0].style.transform = 'translate3d(0,'+parallax+'px,0)';
        }
    };

    this.showOneSlideOnResize = function(){
        this.wrapperStyles(false);
        this.transformHeight = -(this.activeSection * this.windowHeight);
        this.moveWrapper();
    };


    // Slides controls
    this.wheelScroll = function () {
        var self = this;
        window.addEventListener("wheel", function (event) {
            event.preventDefault();

            self.scrollDirection =  event.deltaY > 0;
            if(self.animationFlag){
                self.scrollSectionAnimation();
            }
        });
    };

    this.keyBoard = function () {
        var self = this;
        document.addEventListener('keydown',function (event) {
            var up = event.keyCode == 38;
            var down = event.keyCode == 40 || event.keyCode == 32 ;
            if(up) {
                self.scrollDirection =  false;
            } else if(down) {
                self.scrollDirection =  true;
            }
            if(self.animationFlag && (up || down)){
                self.scrollSectionAnimation();
            }
        });
    };

    this.initControls = function () {
        this.wheelScroll();
        this.keyBoard();
    };

    // Resize window
    this.resize = function () {
        var self = this;

        window.addEventListener('resize', function () {
            self.sectionsHeight();
            self.showOneSlideOnResize();
            if(self.config.parallax){
                self.imagesParallax();
            }
        });
    };

    this.init();
}