function ScrollRevealAnimation(wrapper, config) {
    this.wrapper = window[wrapper] || document.getElementsByClassName(wrapper);
    this.wrapperChildren = this.wrapper.children;
    this.config = {
        scrollDuration: 700
    };
    this.animationFlag = true;

    // Initialize function
    this.init = function () {
        this.sectionsHeight();
        this.resize();
        this.scrollSectionAnimation();
    };

    // Set sections height into wrapper
    this.sectionsHeight = function () {
        this.wh = document.documentElement.clientHeight;
        this.wrapperChildrenCenter = [];
        var arr = this.wrapperChildrenCenter;

        for (var item in this.wrapperChildren) {
            if(!isNaN(item)) {
                if(!+item){
                    arr.push(this.wh/2);
                } else {
                    arr.push(arr[arr.length - 1] + this.wh);
                }
                this.wrapperChildren[item].style.height = this.wh + 'px';
            }
        }
    };

    // Detect, where user scroll
    this.scrollSectionAnimation = function () {
        var self = this;
        window.onwheel = function (event) {
            var topWindowScroll = window.pageYOffset;
            if(event.deltaY>0) {
                self.direction = true;
                self.scrollAnimation(topWindowScroll, topWindowScroll + self.wh,event.deltaY);
            } else {
                self.direction = false;
                self.scrollAnimation(topWindowScroll, topWindowScroll - self.wh,event.deltaY);
            }
        }
    };

    // Scroll animation function
    this.scrollAnimation = function(start, to, direction){
        var self = this;
        var beginAnim = new Date().getTime();
        
        if(self.animationFlag){
            self.animationFlag = false;
            setTimeout(function() {
                var now = (new Date().getTime()) - beginAnim;
                console.log(self.config.scrollDuration);
                var progress = now / self.config.scrollDuration;

                var result = (to - start) * delta(progress) + start;

                if(result>to && self.direction || result<to && !self.direction) {
                    result = to;
                }

                window.scrollTo(start,result);             

                if (progress < 1) {
                    setTimeout(arguments.callee, 10)
                } else {
                    self.animationFlag = true;
                };
            }, 10);
        }

        function delta(progress) {
            return progress;
        }

    },

    // Resize window
    this.resize = function () {
        var self = this;
        window.onresize = function () {
            self.sectionsHeight();
        };
    };

    this.init();
}