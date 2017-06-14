function ScrollRevealAnimation(wrapper, config) {
    this.wrapper = window[wrapper] || document.getElementsByClassName(wrapper);
    this.wrapperChildren = this.wrapper.children;
    this.config = {
        scrollDuration: 100
    };
    this.animationFlag = true;

    // Initialize function
    this.init = function () {
        this.initSections();
        this.resize();
        this.scrollSectionAnimation();
        this.detectActiveSection();
    };
    
    // Calculate sections height
    this.sectionsHeight = function(){
        this.windowHeight = document.documentElement.clientHeight;
        this.sectionsDocumentPosition = [];
        var counter = 0;
        for (var item in this.wrapperChildren) {
            if(!isNaN(item)) {
                var itemElem = this.wrapperChildren[item];
                itemElem.style.cssText = 'height:'+this.windowHeight+'px;';
                this.calculateSectionsDocumentPosition(this.windowHeight*counter);
                counter++;
            }
        }
        this.currentScroll = window.pageYOffset;
        this.documentHeight = this.wrapper.offsetHeight;
    };

    // Set section background image, height and section number on init
    this.initSections = function(){
        for (var item in this.wrapperChildren) {
            var itemElem = this.wrapperChildren[item];
            if(!isNaN(item)) {
                var itemImageData = itemElem.getAttribute('data-img');
                this.setBackground(itemImageData, itemElem);
                itemElem.removeAttribute('data-img');
            }
        }
        this.sectionsHeight();
    };

    this.setBackground = function(img, section){
        if(img){
            var overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.style.cssText = 'position:absolute;left:0;top:0;z-index:0;width:100%;height:100%;background-size:cover;background-position:center top;background-repeat:no-repeat;';
            overlay.style.backgroundImage = 'url('+img+')';
            section.insertBefore(overlay,section.children[0]);
        }
    };

    // Create array with position of every section 
    this.calculateSectionsDocumentPosition = function(position){
        this.sectionsDocumentPosition.push(position);
    };

    // Detect user scroll
    this.scrollSectionAnimation = function () {
        var self = this;

        window.onwheel = function (event) {
            var topWindowScroll = window.pageYOffset;
            var stopWheelEnd = self.documentHeight-self.windowHeight;
            if(!self.animationFlag) {
                return;
            }
            if(event.deltaY>0 && topWindowScroll != stopWheelEnd) {
                self.direction = true;
                self.scrollSection(topWindowScroll, topWindowScroll + self.windowHeight,event.deltaY);
            } else if(event.deltaY<0 && topWindowScroll != 0) {
                self.direction = false;
                self.scrollSection(topWindowScroll, topWindowScroll - self.windowHeight,event.deltaY);
            }
        }
    };

    // Scroll section
    this.scrollSection = function(top, destination){
        this.animation(top, destination);
    };

    // Animation function
    this.animation = function(start, to){
        var self = this;
        var beginAnim = new Date().getTime();
        self.animationFlag = false;
        setTimeout(function() {
            var now = (new Date().getTime()) - beginAnim;
            var progress = now / 700;
            var result = (to - start) * self.delta(progress) + start;
            if(result>to && self.direction || result<to && !self.direction) {
                result = to;
            }
            window.scrollTo(start,result);
            self.checkProgress(progress,to,arguments.callee);
        }, 5);
    };

    this.delta = function(progress) {
        return progress;
    };

    this.checkProgress = function(progress,to,time){
        var self = this;
        if (progress < 1) {
            setTimeout(time, 5)
        } else {
            self.currentScroll = window.pageYOffset;
            self.detectActiveSection();
            self.animationFlag = true;
            this.parallaxAnimation();
        };
    };

    // Parallax animation
    this.parallaxAnimation = function(){
        var self = this;
        var parallax = self.windowHeight*70/100;
        if(self.currentSlide != self.wrapperChildren.length){
            var paralElem = self.wrapperChildren[self.currentSlide+1].children[0];
            paralElem.style.transform = 'translateY(-'+parallax+'px)';
        }
    };

    // Detect active section
    this.detectActiveSection = function(){
        var self = this;
        self.sectionsDocumentPosition.forEach(function(item,num){
            var elem = self.wrapperChildren[num];
            var nextElem = self.wrapperChildren[num+1];
            if(item == self.currentScroll) {
                self.currentSlide = num;
                elem.classList.add('current-slide');
            } else  {
                elem.classList.remove('current-slide');
            }
        })
    };

    // Show one slide on resize
    this.showOneSLideOnResize = function(){
        var self = this;
        window.scrollTo(0, self.currentSlide * self.windowHeight);
    };

    // Resize window
    this.resize = function () {
        var self = this;
        window.onresize = function () {
            self.sectionsHeight();
            this.showOneSLideOnResize();
        };
    };

    this.init();
}