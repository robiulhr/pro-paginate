"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*
 * A open source pagination plugin using pure Javascript.
 * v1.0.0
 *
 * @copyright	Copyright (c) 2023 Robiul H.
 * @license	MIT License; see LICENSE.txt
 */
var Paginate = /*#__PURE__*/function () {
  function Paginate() {
    _classCallCheck(this, Paginate);
    this.defaults = {
      itemsContainerClass: '.items_container',
      paginationContainerClass: '.pagination_container',
      itemsView: 'row_view',
      // row_view || column_view
      wrapAround: true,
      showPrevNext: true,
      showFirstLast: true,
      defaultClass: 'defaultclass',
      firstAreaLabel: 'First',
      prevAreaLabel: 'Prev',
      nextAreaLabel: 'Next',
      lastAreaLabel: 'Last',
      pageLinkAreaLabel: [],
      hasEllips: true,
      paginationOrder: ['first', 'prev', 'num', 'next', 'last'],
      paginationSelector: '.pagination',
      startpageNum: 0,
      visiblePageCount: 4,
      activeClass: 'active',
      disabledClass: 'disabled',
      onLinkClick: function onLinkClick(event) {},
      onFirstClick: function onFirstClick(event) {},
      onLastClick: function onLastClick(event) {},
      onPrevClick: function onPrevClick(event) {},
      onNextClick: function onNextClick(event) {},
      onMoreClick: function onMoreClick(event) {},
      onLessClick: function onLessClick(event) {}
    };
    this._currentPage = this.defaults.startpageNum;
  }
  _createClass(Paginate, [{
    key: "getCurrentPage",
    get: function get() {
      return this._currentPage;
    }
  }, {
    key: "setCurrentPage",
    set: function set(ind) {
      return this._currentPage = ind;
    }
  }, {
    key: "_optionsHandler",
    value: function _optionsHandler(options) {
      // checking the provided options value
      if (_typeof(options) === 'object' && !Array.isArray(options) && options !== null) {
        Object.assign(this.defaults, options);
      } else if (typeof options === 'undefined') {
        console.group('%c Suggestion for Paginate javascript Library', 'color: black; background-color: #D6995B;padding: 5px;font-size:20px');
        console.log("%c It Seems like you haven't provided the options object. \n If you want to change the default settings Please provide a Option object providing your disire settings on it as properties. \n Like below:\n var example_1 = new Paginate({\n containerSelector: '.example_1 .items', \n itemSelector: '.example_1 .items > div', \n navigationSelector: '.example_1 .page_navigation', \n itemsPerPage: 3 \n })", 'padding:10px');
        console.groupEnd();
      } else {
        throw Error('Your provided value as Option must be an Object.');
      }
    }
    // check the validity of provided element selector
  }, {
    key: "_isValidElementSelector",
    value: function _isValidElementSelector(selector) {
      try {
        document.createDocumentFragment().querySelector(selector);
      } catch (_unused) {
        return false;
      }
      return true;
    }
  }, {
    key: "_selectArrayofElement",
    value: function _selectArrayofElement(selector) {
      if (this._isValidElementSelector(selector)) {
        if (document.querySelectorAll(selector).length != 0) return document.querySelectorAll(selector);else throw Error("Your site doesn't contain any '".concat(selector, "' selector. Please provide a valid selector."));
      } else throw Error("'".concat(selector, "' is not a valid css selector Please provide a valid one."));
    }
  }, {
    key: "_selectSingleElement",
    value: function _selectSingleElement(selector) {
      if (this._isValidElementSelector(selector)) {
        if (document.querySelector(selector)) return document.querySelector(selector);else throw Error("Your site doesn't contain any '".concat(selector, "' selector. Please provide a valid selector."));
      } else throw Error("'".concat(selector, "' is not a valid css selector Please provide a valid one."));
    }
  }, {
    key: "_checkElementOverflows",
    value: function _checkElementOverflows(element) {
      if (element.classList.contains('row_view')) {
        if (element.offsetWidth < element.scrollWidth) return true;
        return false;
      } else if (element.classList.contains('column_view')) {
        if (element.offsetHeight < element.scrollHeight) return true;
        return false;
      }
    }
  }, {
    key: "_pageItemsHorizontalScrollEventCallback",
    value: function _pageItemsHorizontalScrollEventCallback(e) {
      e.target.parentElement.scrollLeft += e.deltaY * 3;
    }
  }, {
    key: "_pageItemsHorizontalScroll",
    value: function _pageItemsHorizontalScroll(container) {
      if (container.classList.contains('row_view')) {
        var that = this;
        container.addEventListener('wheel', that._pageItemsHorizontalScrollEventCallback, {
          passive: true
        });
      }
    }
  }, {
    key: "_removePageItemsHorizontalScroll",
    value: function _removePageItemsHorizontalScroll(container) {
      if (container.classList.contains('row_view')) {
        var that = this;
        container.removeEventListener('wheel', that._pageItemsHorizontalScrollEventCallback);
      }
    }
  }, {
    key: "_pageItemsTouchScroll",
    value: function _pageItemsTouchScroll(container) {
      // should fire when the page overflows. that means gets bigger that the parent.
      var startPossition = {
        startClintX: 0,
        startClintY: 0
      };
      this._mouseDownHandler = function (e) {
        e.preventDefault();
        startPossition = {
          startClintX: e.clientX,
          startClintY: e.clientY
        };
        container.addEventListener('mousemove', mouseMoveHandler);
        container.addEventListener('mouseup', mouseUpHandler);
      };
      var mouseMoveHandler = function mouseMoveHandler(e) {
        e.preventDefault();
        container.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
        // How far the mouse has been moved
        var mouseMoveX = e.clientX - startPossition.startClintX;
        var mouseMoveY = e.clientY - startPossition.startClintY;
        // scroll the div
        container.classList.contains('column_view') ? container.scrollTop -= 3 * mouseMoveY : '';
        container.classList.contains('row_view') ? container.scrollLeft -= 3 * mouseMoveX : '';
      };
      var mouseUpHandler = function mouseUpHandler(e) {
        e.preventDefault();
        container.removeEventListener('mousemove', mouseMoveHandler);
        container.removeEventListener('mouseup', mouseUpHandler);
        container.style.cursor = 'grab';
        container.style.removeProperty('user-select');
      };
      container.addEventListener('mousedown', this._mouseDownHandler);
    }
  }, {
    key: "_removePageItemsTouchScrollEvent",
    value: function _removePageItemsTouchScrollEvent(container) {
      container.removeEventListener('mousedown', this._mouseDownHandler);
    }
  }, {
    key: "_handlePageScrollandTouchScrollDependingOverflows",
    value: function _handlePageScrollandTouchScrollDependingOverflows(container) {
      if (this._checkElementOverflows(container)) {
        container.style.justifyContent = 'flex-start';
        this._pageItemsHorizontalScroll(container);
        this._pageItemsTouchScroll(container);
      } else {
        container.style.justifyContent = 'center';
        this._removePageItemsHorizontalScroll(container);
        this._removePageItemsTouchScrollEvent(container);
      }
    }
  }, {
    key: "_createPagination",
    value: function _createPagination() {
      var paginateWrapper = '<div class="paginate_wrapper">';
      paginateWrapper += "<div class=\"items_container ".concat(this.defaults.itemsView, "\"> </div>");
      // createPagination section
      var more = this.defaults.hasEllips ? "<li class=\"pagination_item ellipse more\"><span>...</span></li>" : '';
      var less = this.defaults.hasEllips ? "<li class=\"pagination_item ellipse less\"><span>...</span></li>" : '';
      var first = !this.defaults.showFirstLast ? '' : "<li class=\"pagination_item paginaiton_first ".concat(this.defaults.defaultClass, "\"><a href=\"\" aria-label=\"").concat(this.defaults.firstAreaLabel, "\" onclick=\"return false;\">").concat(this.defaults.firstAreaLabel, "</a></li>");
      var last = !this.defaults.showFirstLast ? '' : "<li class=\"pagination_item paginaiton_last ".concat(this.defaults.defaultClass, "\"><a href=\"\" aria-label=\"").concat(this.defaults.lastAreaLabel, "\" onclick=\"return false;\">").concat(this.defaults.lastAreaLabel, "</a></li>");
      var previous = !this.defaults.showPrevNext ? '' : "<li class=\"pagination_item paginaiton_prev ".concat(this.defaults.defaultClass, "\"><a href=\"\" aria-label=\"").concat(this.defaults.prevAreaLabel, "\" onclick=\"return false;\">").concat(this.defaults.prevAreaLabel, "</a></li>");
      var next = !this.defaults.showPrevNext ? '' : "<li class=\"pagination_item paginaiton_next ".concat(this.defaults.defaultClass, "\"><a href=\"\" aria-label=\"").concat(this.defaults.nextAreaLabel, "\" onclick=\"return false;\">").concat(this.defaults.nextAreaLabel, "</a></li>");
      var paginationContainer = " <div id=\"pagination_container\"><ul class=\"pagination_wrapper\">";
      this.defaults.paginationOrder.forEach(function (element) {
        switch (element) {
          case 'first':
            this.pageCount > this.defaults.visiblePageCount ? paginationContainer += first : "";
            break;
          case 'prev':
            this.pageCount > this.defaults.visiblePageCount ? paginationContainer += previous : "";
            break;
          case 'next':
            this.pageCount > this.defaults.visiblePageCount ? paginationContainer += next : "";
            break;
          case 'last':
            this.pageCount > this.defaults.visiblePageCount ? paginationContainer += last : "";
            break;
          case 'num':
            this.defaults.hasEllips ? this.pageCount > this.defaults.visiblePageCount ? paginationContainer += less : "" : '';
            var count = 0;
            while (count <= this.pageCount - 1) {
              var currentLink = '';
              switch (count) {
                case 0:
                  currentLink = 'first_num_link';
                  break;
                case this.pageCount - 1:
                  currentLink = 'last_num_link';
                  break;
              }
              paginationContainer += "<li class=\"pagination_item ".concat(this.defaults.defaultClass, " data-item ").concat(currentLink, "\" aria-label=\"").concat(count, "\"><a href=\"#\" onclick=\"return false\">").concat(Array.isArray(this.defaults.pageLinkAreaLabel) ? this.defaults.pageLinkAreaLabel[count] || count + 1 : count + 1, "</a></li>");
              count++;
            }
            this.defaults.hasEllips ? this.pageCount > this.defaults.visiblePageCount ? paginationContainer += more : "" : '';
            break;
        }
      }, this);
      return paginateWrapper + (paginationContainer + "</ul></div>") + '</div>';
    }
  }, {
    key: "_hideAllShowSpecificPaginationItems",
    value: function _hideAllShowSpecificPaginationItems(allEle) {
      allEle.forEach(function (item, ind) {
        if (ind < this.defaults.startpageNum || ind > this.defaults.startpageNum + (this.defaults.visiblePageCount - 1)) item.style.display = 'none';else item.style.display = 'list-item';
      }, this);
    }
  }, {
    key: "_makePaginationBtnDisable",
    value: function _makePaginationBtnDisable() {
      // handle less ellipse
      if (this._currentPage <= this.defaults.visiblePageCount - 1) {
        this._selectSingleElement('.paginate_wrapper .pagination_item.ellipse.less').style.display = 'none';
      } else {
        this._selectSingleElement('.paginate_wrapper .pagination_item.ellipse.less').style.display = 'list-item';
      }
      // handle less ellipse
      if (this._currentPage >= this.pageCount - 1 - this.defaults.visiblePageCount) {
        this._selectSingleElement('.paginate_wrapper .pagination_item.ellipse.more').style.display = 'none';
      } else {
        this._selectSingleElement('.paginate_wrapper .pagination_item.ellipse.more').style.display = 'list-item';
      }
      if (!this.defaults.wrapAround) {
        // handle prev and first button
        if (this._currentPage <= 0) {
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_prev').style.display = 'none';
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_first').style.display = 'none';
        } else {
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_prev').style.display = 'list-item';
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_first').style.display = 'list-item';
        }
        // handle next and last button
        if (this._currentPage >= this.pageCount - 1) {
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_next').style.display = 'none';
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_last').style.display = 'none';
        } else {
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_next').style.display = 'list-item';
          this._selectSingleElement('.paginate_wrapper .pagination_item.paginaiton_last').style.display = 'list-item';
        }
      }
    }
  }, {
    key: "_setActiveLink",
    value: function _setActiveLink(allEle) {
      allEle.forEach(function (elem, ind) {
        if (this._currentPage == ind) elem.classList.add(this.defaults.activeClass);else elem.classList.remove(this.defaults.activeClass);
      }, this);
    }
  }, {
    key: "_firstClickHandler",
    value: function _firstClickHandler(allItems, container) {
      var firstLink = this._selectSingleElement('.pagination_wrapper .pagination_item.paginaiton_first');
      var that = this;
      firstLink.addEventListener('click', function (event) {
        // call the custom first function
        that.defaults.onFirstClick.call(that, event);
        that._currentPage = 0;
        if (that.defaults.startpageNum != 0) {
          that.defaults.startpageNum = 0;
          that._hideAllShowSpecificPaginationItems(allItems);
        }
        that._createRenderPageItems(container, that._currentPage);
        that._setActiveLink(allItems);
        that._makePaginationBtnDisable();
      });
    }
  }, {
    key: "_prevClickHandler",
    value: function _prevClickHandler(allItems, container) {
      var prevLink = this._selectSingleElement('.pagination_wrapper .pagination_item.paginaiton_prev');
      var that = this;
      prevLink.addEventListener('click', function (event) {
        // call the prev custom function
        that.defaults.onPrevClick.call(that, event);
        if (that._currentPage < that.pageCount && that._currentPage >= 1) {
          that._currentPage--;
          if (that._currentPage < that.defaults.startpageNum) {
            that.defaults.startpageNum--;
            that._hideAllShowSpecificPaginationItems(allItems);
          }
          that._createRenderPageItems(container, that._currentPage);
          that._setActiveLink(allItems);
          that._makePaginationBtnDisable();
        } else if (that._currentPage <= 0) {
          if (that.defaults.wrapAround) {
            that.defaults.startpageNum = that.pageCount - that.defaults.visiblePageCount;
            that._hideAllShowSpecificPaginationItems(allItems);
            that._currentPage = that.pageCount - 1;
            that._createRenderPageItems(container, that._currentPage);
            that._setActiveLink(allItems);
            that._makePaginationBtnDisable();
          }
        }
      });
    }
  }, {
    key: "_ellipseMoreClickHandler",
    value: function _ellipseMoreClickHandler(allItems, container) {
      var ellipseMore = this._selectSingleElement('.pagination_wrapper .pagination_item.ellipse.more');
      var that = this;
      ellipseMore.addEventListener('click', function (event) {
        // call the custom more function
        that.defaults.onMoreClick.call(that, event);
        if (that.defaults.startpageNum + that.defaults.visiblePageCount > that.pageCount - 1 - that.defaults.visiblePageCount) {
          that.defaults.startpageNum += (that.pageCount - 1) % that.defaults.visiblePageCount - 1;
        } else {
          that.defaults.startpageNum += that.defaults.visiblePageCount;
        }
        if (that._currentPage + that.defaults.visiblePageCount > that.pageCount - 1) {
          that._currentPage += (that.pageCount - 1) % that.defaults.visiblePageCount - 1;
        } else {
          that._currentPage += that.defaults.visiblePageCount;
        }
        that._hideAllShowSpecificPaginationItems(allItems);
        that._createRenderPageItems(container, that._currentPage);
        that._setActiveLink(allItems);
        that._makePaginationBtnDisable();
      });
    }
  }, {
    key: "_ellipseLessClickHandler",
    value: function _ellipseLessClickHandler(allItems, container) {
      var ellipseLess = this._selectSingleElement('.pagination_wrapper .pagination_item.ellipse.less');
      var that = this;
      ellipseLess.addEventListener('click', function (event) {
        // call the custom less function
        that.defaults.onLessClick.call(that, event);
        if (that.defaults.startpageNum < that.defaults.visiblePageCount) {
          that.defaults.startpageNum -= that.defaults.startpageNum % that.defaults.visiblePageCount;
        } else {
          that.defaults.startpageNum -= that.defaults.visiblePageCount;
        }
        if (that._currentPage < that.defaults.visiblePageCount) {
          that._currentPage -= that._currentPage % that.defaults.visiblePageCount - 1;
        } else {
          that._currentPage -= that.defaults.visiblePageCount;
        }
        that._hideAllShowSpecificPaginationItems(allItems);
        that._createRenderPageItems(container, that._currentPage);
        that._setActiveLink(allItems);
        that._makePaginationBtnDisable();
      });
    }
  }, {
    key: "_numElemClickHandler",
    value: function _numElemClickHandler(allItems, container) {
      var _this = this;
      allItems.forEach(function (linkElement, linkEleInd) {
        var that = _this;
        linkElement.addEventListener('click', function (event) {
          // call the custom function
          that.defaults.onLinkClick.call(that, event);
          that._currentPage = linkEleInd;
          that._createRenderPageItems(container, that._currentPage);
          that._setActiveLink(allItems);
          that._makePaginationBtnDisable();
        });
      }, this);
    }
  }, {
    key: "_nextClickHander",
    value: function _nextClickHander(allItems, container) {
      var nextLink = this._selectSingleElement('.pagination_wrapper .pagination_item.paginaiton_next');
      var that = this;
      nextLink.addEventListener('click', function (event) {
        // call the custom next function
        that.defaults.onNextClick.call(that, event);
        if (that._currentPage < that.pageCount - 1 && that._currentPage >= 0) {
          that._currentPage++;
          if (that._currentPage >= that.defaults.startpageNum + that.defaults.visiblePageCount) {
            that.defaults.startpageNum++;
            that._hideAllShowSpecificPaginationItems(allItems);
          }
          that._createRenderPageItems(container, that._currentPage);
          that._setActiveLink(allItems);
          that._makePaginationBtnDisable();
        } else if (that._currentPage >= that.pageCount - 1) {
          if (that.defaults.wrapAround) {
            that.defaults.startpageNum = 0;
            that._hideAllShowSpecificPaginationItems(allItems);
            that._currentPage = 0;
            that._createRenderPageItems(container, that._currentPage);
            that._setActiveLink(allItems);
            that._makePaginationBtnDisable();
          }
        }
      });
    }
  }, {
    key: "_lastClickHandler",
    value: function _lastClickHandler(allItems, container) {
      var lastLink = this._selectSingleElement('.pagination_wrapper .pagination_item.paginaiton_last');
      var that = this;
      lastLink.addEventListener('click', function (event) {
        // call the custom last function
        that.defaults.onLastClick.call(that, event);
        that._currentPage = that.pageCount - 1;
        if (that.defaults.startpageNum != that.pageCount - that.defaults.visiblePageCount) {
          that.defaults.startpageNum = that.pageCount - that.defaults.visiblePageCount;
          that._hideAllShowSpecificPaginationItems(allItems);
        }
        that._createRenderPageItems(container, that._currentPage);
        that._setActiveLink(allItems);
        that._makePaginationBtnDisable();
      });
    }
  }]);
  return Paginate;
}();
var ProPaginate = /*#__PURE__*/function (_Paginate) {
  _inherits(ProPaginate, _Paginate);
  var _super = _createSuper(ProPaginate);
  function ProPaginate(options) {
    var _this2;
    _classCallCheck(this, ProPaginate);
    _this2 = _super.call(this);
    _this2.defaults = Object.assign(_this2.defaults, {
      mainContainerSelector: '#paginate',
      // id is recomended.
      data: [],
      dataItemsArrayPath: '',
      dataItemHtml: '',
      showAlldataOnce: false,
      visibleDataonce: 5,
      showMoreAreaLabel: 'Show More',
      showMoreClass: 'show_more',
      mainDataArrayEmptyErrorHtml: "",
      singleDataItemArrayEmptyErrorHtml: "",
      onShowMoreClick: function onShowMoreClick() {}
    });
    _this2._optionsHandler(options);
    _this2.setCurrentPage = _this2.defaults.startpageNum;
    _this2._init();
    return _this2;
  }
  _createClass(ProPaginate, [{
    key: "_init",
    value: function _init() {
      this.mainContainer = this._selectArrayofElement(this.defaults.mainContainerSelector);
      if (this._isDataValid()) {
        this.mainContainer.forEach(function (mainElement) {
          if (this.defaults.data.length == 0) {
            mainElement.innerHTML = this.defaults.mainDataArrayEmptyErrorHtml || "<div>no data found.</div>";
            return;
          }
          this.pageCount = this.defaults.data.length;
          var pagination = this._createPagination();
          mainElement.innerHTML = pagination;
          // get all pagination element and hide them and show only instructed items
          var allPaginationLinkElements = this._selectArrayofElement('#pagination_container .data-item');
          this._hideAllShowSpecificPaginationItems(allPaginationLinkElements);
          this._setActiveLink(allPaginationLinkElements);
          this._makePaginationBtnDisable();
          var pageItemsContainer = this._selectSingleElement('.paginate_wrapper .items_container');
          this._createRenderPageItems(pageItemsContainer, this._currentPage);
          // handle event of every link items
          var that = this;
          this._numElemClickHandler(allPaginationLinkElements, pageItemsContainer);
          this._firstClickHandler(allPaginationLinkElements, pageItemsContainer);
          this._prevClickHandler(allPaginationLinkElements, pageItemsContainer);
          this._nextClickHander(allPaginationLinkElements, pageItemsContainer);
          this._lastClickHandler(allPaginationLinkElements, pageItemsContainer);
          this._ellipseMoreClickHandler(allPaginationLinkElements, pageItemsContainer);
          this._ellipseLessClickHandler(allPaginationLinkElements, pageItemsContainer);
        }, this);
      }
    }
  }, {
    key: "_stringToTamplateGet",
    value: function _stringToTamplateGet(path, obj) {
      var fb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "${".concat(path, "}");
      return path.split('.').reduce(function (res, key) {
        return res[key] || fb;
      }, obj);
    }
  }, {
    key: "_stringToTamplateParser",
    value: function _stringToTamplateParser(template, map, fallback) {
      var _this3 = this;
      return template.replace(/\$\{.+?}/g, function (match) {
        var path = match.substr(2, match.length - 3).trim();
        return _this3._stringToTamplateGet(path, map, fallback);
      });
    }
  }, {
    key: "_isDataValid",
    value: function _isDataValid() {
      if (!Array.isArray(this.defaults.data)) throw Error('your data should be an array.');else return true;
    }
  }, {
    key: "_createRenderPageItems",
    value: function _createRenderPageItems(container, currentpage) {
      var _this$defaults$data$c;
      var dataArr = ((_this$defaults$data$c = this.defaults.data[currentpage]) === null || _this$defaults$data$c === void 0 ? void 0 : _this$defaults$data$c[this.defaults.dataItemsArrayPath]) || [];
      if (dataArr.length > 0) {
        var renderToCount = this.defaults.showAlldataOnce ? dataArr.length : Math.min(this.defaults.visibleDataonce, dataArr.length);
        var allElement = '';
        for (var i = 0; i < renderToCount; i++) {
          var htmlElement = this._stringToTamplateParser(this.defaults.dataItemHtml, dataArr[i]);
          allElement += htmlElement;
        }
        container.innerHTML = allElement;
        this._handlePageScrollandTouchScrollDependingOverflows(container);
        if (dataArr.length > this.defaults.visibleDataonce) {
          if (!this.isShowMoreSectionExist) {
            this._createRenderShowMore(container);
            var showMoreSection = this._selectSingleElement('.paginate_wrapper .show_more_btn');
            showMoreSection.addEventListener('click', this._showMoreClickEventCallback.bind(this));
          }
        } else {
          if (this.isShowMoreSectionExist) {
            var _showMoreSection = this._selectSingleElement('.paginate_wrapper .show_more_btn');
            _showMoreSection.removeEventListener('click', this._showMoreClickEventCallback.bind(this));
            _showMoreSection.remove();
            this.isShowMoreSectionExist = false;
          }
        }
      } else {
        container.innerHTML = this.defaults.singleDataItemArrayEmptyErrorHtml || "<div>No data available in this page.</div>";
      }
    }
  }, {
    key: "_createRenderShowMore",
    value: function _createRenderShowMore(container) {
      var showMoreSection = "<div class=\"show_more_btn ".concat(this.defaults.showMoreClass, " hidden\"><span>").concat(this.defaults.showMoreAreaLabel, "</span></div>");
      this.defaults.showAlldataOnce || container.insertAdjacentHTML('afterend', showMoreSection);
      this.isShowMoreSectionExist = true;
      this._showHideShowMore(container);
    }
  }, {
    key: "_showHideShowMoreScrollEventCallback",
    value: function _showHideShowMoreScrollEventCallback(e) {
      if (this.isShowMoreSectionExist) {
        var showMoreSection = this._selectSingleElement('.paginate_wrapper .show_more_btn');
        if (e.target.classList.contains('column_view')) {
          if (e.target.scrollHeight - 20 <= e.target.scrollTop + e.target.clientHeight) {
            showMoreSection.classList.remove('hidden');
          } else {
            showMoreSection.classList.add('hidden');
          }
        } else if (e.target.classList.contains('row_view')) {
          if (e.target.scrollWidth - 20 <= e.target.scrollLeft + e.target.clientWidth) {
            showMoreSection.classList.remove('hidden');
          } else {
            showMoreSection.classList.add('hidden');
          }
        }
      }
    }
  }, {
    key: "_showHideShowMore",
    value: function _showHideShowMore(container) {
      if (this._checkElementOverflows(container)) {
        container.addEventListener('scroll', this._showHideShowMoreScrollEventCallback.bind(this));
      } else {
        if (this.isShowMoreSectionExist) {
          var showMoreSection = this._selectSingleElement('.paginate_wrapper .show_more_btn');
          if (showMoreSection.classList.contains('hidden')) showMoreSection.classList.remove('hidden');
        }
      }
    }
  }, {
    key: "_addMorePageItems",
    value: function _addMorePageItems(itemCount) {
      var pageItemsContainer = this._selectSingleElement('.paginate_wrapper .items_container');
      var alreadyExistEleCount = pageItemsContainer.querySelectorAll('div.data_item').length;
      var dataArr = this.defaults.data[this._currentPage][this.defaults.dataItemsArrayPath];
      var loopEnd = dataArr.length - alreadyExistEleCount < itemCount ? dataArr.length - 1 : alreadyExistEleCount - 1 + itemCount;
      for (var i = alreadyExistEleCount - 1; i < loopEnd; i++) {
        var newElements = this._stringToTamplateParser(this.defaults.dataItemHtml, dataArr[i]);
        pageItemsContainer.insertAdjacentHTML('beforeend', newElements);
      }
      if (pageItemsContainer.querySelectorAll('div.data_item').length >= dataArr.length && this.isShowMoreSectionExist) {
        this._selectSingleElement('.paginate_wrapper .show_more_btn').remove();
        this.isShowMoreSectionExist = false;
      } else {
        this._selectSingleElement('.paginate_wrapper .show_more_btn').classList.add('hidden');
      }
      this._handlePageScrollandTouchScrollDependingOverflows(pageItemsContainer);
    }
  }, {
    key: "_showMoreClickEventCallback",
    value: function _showMoreClickEventCallback(e) {
      if (this.defaults.visibleDataonce < 5 && this.defaults.visibleDataonce > 0) {
        this._addMorePageItems(this.defaults.visibleDataonce);
      } else if (this.defaults.visibleDataonce >= 5) {
        this._addMorePageItems(Math.round(this.defaults.visibleDataonce / 2));
      }
    }
  }]);
  return ProPaginate;
}(Paginate);
