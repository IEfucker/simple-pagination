/*
 *	api query date=20161104&page=0&size=10
 *	response total
 */

;
(function() {
    var emptyFunc = function() {}
    var defaultOpt = {
        container: "body",
        startNum: 1,
        pageSize: 10,
        currentNum: null,
        label: {
            first: "first",
            last: "last",
            prev: "prev",
            next: "next",
            goto: 'go'
        },
        callback: emptyFunc
    }

    function Pagination(opt) {
        var opt = $.extend({}, defaultOpt, opt || {}),
            self = this

        var c = $(opt.container),
            api = opt.url || '/',
            date = getCurrentDate(),
            dType = opt.dataType,
            label = opt.label,
            cb = function(res){
            	opt.callback(res)
                var lastNum = res.hits.total
                self.updatePagi(opt.currentNum, lastNum)
            }

        //set jsonp callback in window obj
        if (dType === 'jsonp') {
            window._paginationCb = cb
        }

        self.getPage = function(num) {
            if (!num || isNaN(num)) throw Error('pageNumber error')
            if (+num < 1 || +num > self.lastNum) return
            var params = 'date=' + date + '&page=' + num + '&size=' + opt.pageSize

            $.ajax({
                url: api + "?" + params,
                dataType: dType || 'json',
                cache: false,
                jsonpCallback: '_paginationCb',
                success: cb,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown)
                }
            })
        }

        //update pagination's pageNumber
        self.updatePagi = function(currentNum, lastNum) {
            self.currentNum = currentNum
            self.lastNum = lastNum
            var html = ''
            html += '<div class="pagi-contain"><ul class="pagi-list">'
            html += '<li class="pagi-item"><span>' + currentNum + '/' + self.lastNum + '</span></li>'
            html += '<li class="pagi-item"><a href="#" class="pagi-link pagi-first' + ((currentNum == 1) ? " disabled" : "") + '">' + label.first + '</a></li>'
            html += '<li class="pagi-item"><a href="#" class="pagi-link pagi-prev' + ((currentNum == 1) ? " disabled" : "") + '">' + label.prev + '</a></li>'
            html += '<li class="pagi-item"><a href="#" class="pagi-link pagi-next' + ((lastNum == currentNum) ? " disabled" : "") + '">' + label.next + '</a></li>'
            html += '<li class="pagi-item"><a href="#" class="pagi-link pagi-last' + ((lastNum == currentNum) ? " disabled" : "") + '">' + label.last + '</a></li>'
            html += '<li class="pagi-item"><input type="text" class="pagi-goto-num" value="' + currentNum + '">'
            html += '<a class="pagi-link pagi-goto-btn" href="#">' + label.goto + '</a></li></ul></div>'

            c.html(html)

            //event bind
            $('.pagi-contain').find('.pagi-first').on("click", function(e) {
                if ($(this).hasClass('disabled')) return
                self.goto(1)
            })
            $('.pagi-contain').find('.pagi-prev').on("click", function(e) {
                if ($(this).hasClass('disabled')) return
                self.goto(self.currentNum - 1)
            })
            $('.pagi-contain').find('.pagi-next').on("click", function(e) {
                if ($(this).hasClass('disabled')) return
                self.goto(self.currentNum + 1)
            })
            $('.pagi-contain').find('.pagi-last').on("click", function(e) {
                if ($(this).hasClass('disabled')) return
                self.goto(self.lastNum)
            })
        }

        this.getPage(opt.startNum)



    }

    var proto = Pagination.prototype;

    proto.goto = function(num) {
        if (isNaN(num)) throw Error("page number type error: " + num)
        num = +num
            //console.log(num)
        this.getPage(num)
    }

    proto.next = function() {
        //console.log('next')
        var currentNum = this.currentNum
        this.goto(++currentNum)

    }

    proto.prev = function() {
        //console.log('prev')
        var currentNum = this.currentNum
        this.goto(--currentNum)
    }

    proto.gotoLast = function() {
        //console.log('gotoLast')
        this.goto(self.lastNum)
    }

    proto.gotoFirst = function() {
        //console.log('gotoFirst')
        this.goto(1)
    }

    function getCurrentDate() {
        var t = new Date(),
            y = t.getFullYear(),
            m = t.getMonth() + 1,
            d = t.getDate()
        m = m < 10 ? ('0' + m) : m
        d = d < 10 ? ('0' + d) : d
        return '' + t.getFullYear() + m + d
    }


    window.Pagination = Pagination
}());
