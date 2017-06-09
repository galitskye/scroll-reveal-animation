function ScrollRevealAnimation(wrapper, config) {
    this.wrapper = window[wrapper] || document.getElementsByClassName(wrapper);
    this.wrapperChildren = this.wrapper.children;
    this.config = {
        scrollDuration: 100
    };

    // Initialize function
    this.init = function () {
        this.sectionsHeight();
        this.resize();
        this.scrollSectionRemove();
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

    this.scrollSectionRemove = function () {
        var self = this;
        window.onscroll = function () {
            var topWindowScroll = window.pageYOffset;
            console.log(topWindowScroll);
            // window.scrollTo(topWindowScroll, topWindowScroll + self.wh);
        }
    };

    // this.detectScreenSection = function () {
    //
    // }

    // Resize window
    this.resize = function () {
        var self = this;
        window.onresize = function () {
            self.sectionsHeight();
        };
    };

    this.init();
}

