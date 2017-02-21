/*
 *	api query date=20161104&page=0&size=10
 *	response total
 */
; (function (global) {
    var $ = global.$
    var emptyFunc = function () { }
    var defaultOpt = {
        container: "body",
        startNum: 1,
        pageSize: 10,
        pageNumParamName: 'page',
        pageSizeParamName: 'size',
        currentNum: null,
        label: {
            first: "first",
            last: "last",
            prev: "prev",
            next: "next",
            goTo: 'go'
        },
        setTotal: emptyFunc,
        callback: emptyFunc
    }

    function Pagination(opt) {
        var opt = $.extend({}, defaultOpt, opt || {}),
            self = this,
            c = typeof opt.container === 'string' ? $(opt.container) : opt.container,
            api = opt.url || '/',
            dType = opt.dataType,
            label = opt.label,
            cb = function (res) {
                opt.pageCb(res)
                if (!opt.totalNum) opt.setTotal(res)
                self.updatePagi(opt.currentNum, opt.totalNum)
            },
            ajaxObj = {
                dataType: dType || 'json',
                cache: false,
                success: cb,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown)
                }
            }

        self.opt = opt

        self.getPage = function (num) {
            if (!num || isNaN(num)) throw Error('pageNumber error')
            if (+num < 1 || +num > self.lastNum) return
            opt.currentNum = num
            var pagiParams = {}
            pagiParams[opt.pageNumParamName] = num
            pagiParams[opt.pageSizeParamName] = opt.pageSize

            ajaxObj.url = addParams(api, pagiParams)
            $.ajax(ajaxObj)
        }

        //update pagination's pageNumber
        self.updatePagi = function (currentNum, lastNum) {
            opt.currentNum = currentNum
            var html = ''
            html += '<div class="pagi-contain"><ul class="pagi-list">'
            html += '<li class="pagi-item"><span>' + currentNum + '/' + lastNum + '</span></li>'
            html += '<li class="pagi-item"><a href="javascript:;" class="pagi-link pagi-first' + ((currentNum == 1) ? " disabled" : "") + '">' + label.first + '</a></li>'
            html += '<li class="pagi-item"><a href="javascript:;" class="pagi-link pagi-prev' + ((currentNum == 1) ? " disabled" : "") + '">' + label.prev + '</a></li>'
            html += '<li class="pagi-item"><a href="javascript:;" class="pagi-link pagi-next' + ((lastNum == currentNum) ? " disabled" : "") + '">' + label.next + '</a></li>'
            html += '<li class="pagi-item"><a href="javascript:;" class="pagi-link pagi-last' + ((lastNum == currentNum) ? " disabled" : "") + '">' + label.last + '</a></li>'
            html += '<li class="pagi-item"><input type="text" class="pagi-goto-num" value="' + currentNum + '">'
            html += '<a class="pagi-link pagi-goto-btn" href="#">' + label.goTo + '</a></li></ul></div>'
            // console.log(html)
            c.html(html)

            //event bind
            c.find('.pagi-first').on("click", function (e) {
                if ($(this).hasClass('disabled')) return
                self.gotoFirst()
            })
            c.find('.pagi-prev').on("click", function (e) {
                if ($(this).hasClass('disabled')) return
                self.prev()
            })
            c.find('.pagi-next').on("click", function (e) {
                if ($(this).hasClass('disabled')) return
                self.next()
            })
            c.find('.pagi-last').on("click", function (e) {
                if ($(this).hasClass('disabled')) return
                self.gotoLast()
            })
        }

        this.getPage(opt.startNum)



    }

    var proto = Pagination.prototype;

    proto.goto = function (num) {
        if (isNaN(num)) throw Error("page number type error: " + num)
        num = +num
        //console.log(num)
        this.getPage(num)
    }

    proto.next = function () {
        //console.log('next')
        var currentNum = this.opt.currentNum
        this.goto(++currentNum)

    }

    proto.prev = function () {
        //console.log('prev')
        var currentNum = this.opt.currentNum
        this.goto(--currentNum)
    }

    proto.gotoLast = function () {
        //console.log('gotoLast')
        this.goto(this.opt.totalNum)
    }

    proto.gotoFirst = function () {
        //console.log('gotoFirst')
        this.goto(1)
    }

    /*
     *	添加params方法
     *	#标记和无value query自动删除
     *	返回添加后的url
     */
    function addParams(url, paramsObj) {
        try {
            var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g")),
                source = url.replace(/\?.*/, ""),
                queryString = ''
            for (var k in paramsObj) {
                queryString += "&" + k + "=" + paramsObj[k]
            }
            // console.log(result&result.length)
            if (result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var p = result[i].replace(/[\?\&]/, "")
                        queryString += "&" + p
                    }
                }
            }
            queryString = queryString.replace(/^\&/, "")

            return source + "?" + queryString
        } catch (e) {
            throw Error("addParams error")
        }
    }


    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

        // AMD. Register as an anonymous module.
        define(function () {
            return Pagination;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Pagination.attach;
        module.exports.Pagination = Pagination;
    } else {
        window.Pagination = Pagination;
    }
}(this))


