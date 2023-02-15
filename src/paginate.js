/*
 * A open source pagination plugin using pure Javascript.
 * v1.0.0
 *
 * @copyright	Copyright (c) 2023 Robiul H.
 * @license	MIT License; see LICENSE.txt
 */

class Paginate {
  constructor () {
    this.defaults = {
      itemsContainerClass: '.items_container',
      paginationContainerClass: '.pagination_container',
      itemsView: 'row_view', // row_view || column_view
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
      onLinkClick: function (event) {},
      onFirstClick: function (event) {},
      onLastClick: function (event) {},
      onPrevClick: function (event) {},
      onNextClick: function (event) {},
      onMoreClick: function (event) {},
      onLessClick: function (event) {}
    }
    this._currentPage = this.defaults.startpageNum
  }

  get getCurrentPage () {
    return this._currentPage
  }
  set setCurrentPage (ind) {
    return (this._currentPage = ind)
  }
  _optionsHandler (options) {
    // checking the provided options value
    if (
      typeof options === 'object' &&
      !Array.isArray(options) &&
      options !== null
    ) {
      Object.assign(this.defaults, options)
    } else if (typeof options === 'undefined') {
      console.group(
        '%c Suggestion for Paginate javascript Library',
        'color: black; background-color: #D6995B;padding: 5px;font-size:20px'
      )
      console.log(
        "%c It Seems like you haven't provided the options object. \n If you want to change the default settings Please provide a Option object providing your disire settings on it as properties. \n Like below:\n var example_1 = new Paginate({\n containerSelector: '.example_1 .items', \n itemSelector: '.example_1 .items > div', \n navigationSelector: '.example_1 .page_navigation', \n itemsPerPage: 3 \n })",
        'padding:10px'
      )
      console.groupEnd()
    } else {
      throw Error('Your provided value as Option must be an Object.')
    }
  }
  // check the validity of provided element selector
  _isValidElementSelector (selector) {
    try {
      document.createDocumentFragment().querySelector(selector)
    } catch {
      return false
    }
    return true
  }
  _selectArrayofElement (selector) {
    if (this._isValidElementSelector(selector))
      if (document.querySelectorAll(selector).length != 0)
        return document.querySelectorAll(selector)
      else
        throw Error(
          `Your site doesn't contain any '${selector}' selector. Please provide a valid selector.`
        )
    else
      throw Error(
        `'${selector}' is not a valid css selector Please provide a valid one.`
      )
  }
  _selectSingleElement (selector) {
    if (this._isValidElementSelector(selector))
      if (document.querySelector(selector))
        return document.querySelector(selector)
      else
        throw Error(
          `Your site doesn't contain any '${selector}' selector. Please provide a valid selector.`
        )
    else
      throw Error(
        `'${selector}' is not a valid css selector Please provide a valid one.`
      )
  }
  _checkElementOverflows (element) {
    if (element.classList.contains('row_view')) {
      if (element.offsetWidth < element.scrollWidth) return true
      return false
    } else if (element.classList.contains('column_view')) {
      if (element.offsetHeight < element.scrollHeight) return true
      return false
    }
  }
  _pageItemsHorizontalScrollEventCallback (e) {
    e.target.parentElement.scrollLeft += e.deltaY * 3
  }
  _pageItemsHorizontalScroll (container) {
    if (container.classList.contains('row_view')) {
      const that = this
      container.addEventListener(
        'wheel',
        that._pageItemsHorizontalScrollEventCallback,
        { passive: true }
      )
    }
  }
  _removePageItemsHorizontalScroll (container) {
    if (container.classList.contains('row_view')) {
      const that = this
      container.removeEventListener(
        'wheel',
        that._pageItemsHorizontalScrollEventCallback
      )
    }
  }
  _pageItemsTouchScroll (container) {
    // should fire when the page overflows. that means gets bigger that the parent.
    let startPossition = { startClintX: 0, startClintY: 0 }
    this._mouseDownHandler = function (e) {
      e.preventDefault()
      startPossition = {
        startClintX: e.clientX,
        startClintY: e.clientY
      }
      container.addEventListener('mousemove', mouseMoveHandler)
      container.addEventListener('mouseup', mouseUpHandler)
    }

    const mouseMoveHandler = function (e) {
      e.preventDefault()
      container.style.cursor = 'grabbing'
      container.style.userSelect = 'none'
      // How far the mouse has been moved
      const mouseMoveX = e.clientX - startPossition.startClintX
      const mouseMoveY = e.clientY - startPossition.startClintY
      // scroll the div
      container.classList.contains('column_view')
        ? (container.scrollTop -= 3 * mouseMoveY)
        : ''
      container.classList.contains('row_view')
        ? (container.scrollLeft -= 3 * mouseMoveX)
        : ''
    }
    const mouseUpHandler = function (e) {
      e.preventDefault()
      container.removeEventListener('mousemove', mouseMoveHandler)
      container.removeEventListener('mouseup', mouseUpHandler)
      container.style.cursor = 'grab'
      container.style.removeProperty('user-select')
    }
    container.addEventListener('mousedown', this._mouseDownHandler)
  }
  _removePageItemsTouchScrollEvent (container) {
    container.removeEventListener('mousedown', this._mouseDownHandler)
  }
  _handlePageScrollandTouchScrollDependingOverflows (container) {
    if (this._checkElementOverflows(container)) {
      container.style.justifyContent = 'flex-start'
      this._pageItemsHorizontalScroll(container)
      this._pageItemsTouchScroll(container)
    } else {
      container.style.justifyContent = 'center'
      this._removePageItemsHorizontalScroll(container)
      this._removePageItemsTouchScrollEvent(container)
    }
  }
  _createPagination () {
    let paginateWrapper = '<div class="paginate_wrapper">'
    paginateWrapper += `<div class="items_container ${this.defaults.itemsView}"> </div>`
    // createPagination section
    const more = this.defaults.hasEllips
      ? `<li class="pagination_item ellipse more"><span>...</span></li>`
      : ''
    const less = this.defaults.hasEllips
      ? `<li class="pagination_item ellipse less"><span>...</span></li>`
      : ''
    const first = !this.defaults.showFirstLast
      ? ''
      : `<li class="pagination_item paginaiton_first ${this.defaults.defaultClass}"><a href="" aria-label="${this.defaults.firstAreaLabel}" onclick="return false;">${this.defaults.firstAreaLabel}</a></li>`

    const last = !this.defaults.showFirstLast
      ? ''
      : `<li class="pagination_item paginaiton_last ${this.defaults.defaultClass}"><a href="" aria-label="${this.defaults.lastAreaLabel}" onclick="return false;">${this.defaults.lastAreaLabel}</a></li>`
    const previous = !this.defaults.showPrevNext
      ? ''
      : `<li class="pagination_item paginaiton_prev ${this.defaults.defaultClass}"><a href="" aria-label="${this.defaults.prevAreaLabel}" onclick="return false;">${this.defaults.prevAreaLabel}</a></li>`
    const next = !this.defaults.showPrevNext
      ? ''
      : `<li class="pagination_item paginaiton_next ${this.defaults.defaultClass}"><a href="" aria-label="${this.defaults.nextAreaLabel}" onclick="return false;">${this.defaults.nextAreaLabel}</a></li>`

    let paginationContainer = ` <div id="pagination_container"><ul class="pagination_wrapper">`

    this.defaults.paginationOrder.forEach(function (element) {
      switch (element) {
        case 'first':
          this.pageCount > this.defaults.visiblePageCount
            ? (paginationContainer += first)
            : ''
          break
        case 'prev':
          this.pageCount > this.defaults.visiblePageCount
            ? (paginationContainer += previous)
            : ''
          break
        case 'next':
          this.pageCount > this.defaults.visiblePageCount
            ? (paginationContainer += next)
            : ''
          break
        case 'last':
          this.pageCount > this.defaults.visiblePageCount
            ? (paginationContainer += last)
            : ''
          break
        case 'num':
          this.defaults.hasEllips
            ? this.pageCount > this.defaults.visiblePageCount
              ? (paginationContainer += less)
              : ''
            : ''
          if (this.pageCount > 1) {
            let count = 0
            while (count <= this.pageCount - 1) {
              let currentLink = ''
              switch (count) {
                case 0:
                  currentLink = 'first_num_link'
                  break
                case this.pageCount - 1:
                  currentLink = 'last_num_link'
                  break
              }
              paginationContainer += `<li class="pagination_item ${
                this.defaults.defaultClass
              } data-item ${currentLink}" aria-label="${count}"><a href="#" onclick="return false">${
                Array.isArray(this.defaults.pageLinkAreaLabel)
                  ? this.defaults.pageLinkAreaLabel[count] || count + 1
                  : count + 1
              }</a></li>`
              count++
            }
          }
          this.defaults.hasEllips
            ? this.pageCount > this.defaults.visiblePageCount
              ? (paginationContainer += more)
              : ''
            : ''
          break
      }
    }, this)
    return paginateWrapper + (paginationContainer + `</ul></div>`) + '</div>'
  }

  _hideAllShowSpecificPaginationItems (allEle) {
    if (this.pageCount > this.defaults.visiblePageCount) {
      allEle.forEach(function (item, ind) {
        if (
          ind < this.defaults.startpageNum ||
          ind >
            this.defaults.startpageNum + (this.defaults.visiblePageCount - 1)
        )
          item.style.display = 'none'
        else item.style.display = 'list-item'
      }, this)
    }
  }
  _makePaginationBtnDisable () {
    // handle less ellipse
    if (this.pageCount > this.defaults.visiblePageCount) {
      if (this._currentPage <= this.defaults.visiblePageCount - 1) {
        this._selectSingleElement(
          '.paginate_wrapper .pagination_item.ellipse.less'
        ).classList.add(this.defaults.disabledClass)
      } else {
        this._selectSingleElement(
          '.paginate_wrapper .pagination_item.ellipse.less'
        ).classList.remove(this.defaults.disabledClass)
      }
      // handle less ellipse
      if (
        this._currentPage >=
        this.pageCount - 1 - this.defaults.visiblePageCount
      ) {
        this._selectSingleElement(
          '.paginate_wrapper .pagination_item.ellipse.more'
        ).classList.add(this.defaults.disabledClass)
      } else {
        this._selectSingleElement(
          '.paginate_wrapper .pagination_item.ellipse.more'
        ).classList.remove(this.defaults.disabledClass)
      }
      if (!this.defaults.wrapAround) {
        // handle prev and first button
        if (this._currentPage <= 0) {
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_prev'
          ).classList.add(this.defaults.disabledClass)
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_first'
          ).classList.add(this.defaults.disabledClass)
        } else {
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_prev'
          ).classList.remove(this.defaults.disabledClass)
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_first'
          ).classList.remove(this.defaults.disabledClass)
        }
        // handle next and last button
        if (this._currentPage >= this.pageCount - 1) {
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_next'
          ).classList.add(this.defaults.disabledClass)
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_last'
          ).classList.add(this.defaults.disabledClass)
        } else {
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_next'
          ).classList.remove(this.defaults.disabledClass)
          this._selectSingleElement(
            '.paginate_wrapper .pagination_item.paginaiton_last'
          ).classList.remove(this.defaults.disabledClass)
        }
      }
    }
  }

  _setActiveLink (allEle) {
    allEle.forEach(function (elem, ind) {
      if (this._currentPage == ind)
        elem.classList.add(this.defaults.activeClass)
      else elem.classList.remove(this.defaults.activeClass)
    }, this)
  }

  _firstClickHandler (allItems, container) {
    const firstLink = this._selectSingleElement(
      '.pagination_wrapper .pagination_item.paginaiton_first'
    )
    if (!firstLink.classList.contains(this.defaults.disabledClass)) {
      const that = this
      firstLink.addEventListener('click', function (event) {
        // call the custom first function
        that.defaults.onFirstClick.call(that, event)
        that._currentPage = 0
        if (that.defaults.startpageNum != 0) {
          that.defaults.startpageNum = 0
          that._hideAllShowSpecificPaginationItems(allItems)
        }
        that._createRenderPageItems(container, that._currentPage)
        that._setActiveLink(allItems)
        that._makePaginationBtnDisable()
      })
    }
  }
  _prevClickHandler (allItems, container) {
    const prevLink = this._selectSingleElement(
      '.pagination_wrapper .pagination_item.paginaiton_prev'
    )
    if (!prevLink.classList.contains(this.defaults.disabledClass)) {
      const that = this
      prevLink.addEventListener('click', function (event) {
        // call the prev custom function
        that.defaults.onPrevClick.call(that, event)
        if (that._currentPage < that.pageCount && that._currentPage >= 1) {
          that._currentPage--
          if (that._currentPage < that.defaults.startpageNum) {
            that.defaults.startpageNum--
            that._hideAllShowSpecificPaginationItems(allItems)
          }
          that._createRenderPageItems(container, that._currentPage)
          that._setActiveLink(allItems)
          that._makePaginationBtnDisable()
        } else if (that._currentPage <= 0) {
          if (that.defaults.wrapAround) {
            that.defaults.startpageNum =
              that.pageCount - that.defaults.visiblePageCount
            that._hideAllShowSpecificPaginationItems(allItems)
            that._currentPage = that.pageCount - 1
            that._createRenderPageItems(container, that._currentPage)
            that._setActiveLink(allItems)
            that._makePaginationBtnDisable()
          }
        }
      })
    }
  }
  _ellipseMoreClickHandler (allItems, container) {
    const ellipseMore = this._selectSingleElement(
      '.pagination_wrapper .pagination_item.ellipse.more'
    )

    if (!ellipseMore.classList.contains(this.defaults.disabledClass)) {
      const that = this
      ellipseMore.addEventListener('click', function (event) {
        // call the custom more function
        that.defaults.onMoreClick.call(that, event)
        if (
          that.defaults.startpageNum + that.defaults.visiblePageCount >
          that.pageCount - 1 - that.defaults.visiblePageCount
        ) {
          that.defaults.startpageNum +=
            ((that.pageCount - 1) % that.defaults.visiblePageCount) - 1
        } else {
          that.defaults.startpageNum += that.defaults.visiblePageCount
        }
        if (
          that._currentPage + that.defaults.visiblePageCount >
          that.pageCount - 1
        ) {
          that._currentPage +=
            ((that.pageCount - 1) % that.defaults.visiblePageCount) - 1
        } else {
          that._currentPage += that.defaults.visiblePageCount
        }

        that._hideAllShowSpecificPaginationItems(allItems)
        that._createRenderPageItems(container, that._currentPage)
        that._setActiveLink(allItems)
        that._makePaginationBtnDisable()
      })
    }
  }
  _ellipseLessClickHandler (allItems, container) {
    const ellipseLess = this._selectSingleElement(
      '.pagination_wrapper .pagination_item.ellipse.less'
    )
    if (!ellipseLess.classList.contains(this.defaults.disabledClass)) {
      const that = this
      ellipseLess.addEventListener('click', function (event) {
        // call the custom less function
        that.defaults.onLessClick.call(that, event)

        if (that.defaults.startpageNum < that.defaults.visiblePageCount) {
          that.defaults.startpageNum -=
            that.defaults.startpageNum % that.defaults.visiblePageCount
        } else {
          that.defaults.startpageNum -= that.defaults.visiblePageCount
        }
        if (that._currentPage < that.defaults.visiblePageCount) {
          that._currentPage -=
            (that._currentPage % that.defaults.visiblePageCount) - 1
        } else {
          that._currentPage -= that.defaults.visiblePageCount
        }

        that._hideAllShowSpecificPaginationItems(allItems)
        that._createRenderPageItems(container, that._currentPage)
        that._setActiveLink(allItems)
        that._makePaginationBtnDisable()
      })
    }
  }
  _numElemClickHandler (allItems, container) {
    allItems.forEach((linkElement, linkEleInd) => {
      const that = this
      linkElement.addEventListener('click', function (event) {
        // call the custom function
        that.defaults.onLinkClick.call(that, event)

        that._currentPage = linkEleInd
        that._createRenderPageItems(container, that._currentPage)
        that._setActiveLink(allItems)
        that._makePaginationBtnDisable()
      })
    }, this)
  }
  _nextClickHander (allItems, container) {
    const nextLink = this._selectSingleElement(
      '.pagination_wrapper .pagination_item.paginaiton_next'
    )
    if (!nextLink.classList.contains(this.defaults.disabledClass)) {
      const that = this
      nextLink.addEventListener('click', function (event) {
        // call the custom next function
        that.defaults.onNextClick.call(that, event)
        if (that._currentPage < that.pageCount - 1 && that._currentPage >= 0) {
          that._currentPage++
          if (
            that._currentPage >=
            that.defaults.startpageNum + that.defaults.visiblePageCount
          ) {
            that.defaults.startpageNum++
            that._hideAllShowSpecificPaginationItems(allItems)
          }
          that._createRenderPageItems(container, that._currentPage)
          that._setActiveLink(allItems)
          that._makePaginationBtnDisable()
        } else if (that._currentPage >= that.pageCount - 1) {
          if (that.defaults.wrapAround) {
            that.defaults.startpageNum = 0
            that._hideAllShowSpecificPaginationItems(allItems)
            that._currentPage = 0
            that._createRenderPageItems(container, that._currentPage)
            that._setActiveLink(allItems)
            that._makePaginationBtnDisable()
          }
        }
      })
    }
  }
  _lastClickHandler (allItems, container) {
    const lastLink = this._selectSingleElement(
      '.pagination_wrapper .pagination_item.paginaiton_last'
    )
    if (!lastLink.classList.contains(this.defaults.disabledClass)) {
      const that = this
      lastLink.addEventListener('click', function (event) {
        // call the custom last function
        that.defaults.onLastClick.call(that, event)
        that._currentPage = that.pageCount - 1
        if (
          that.defaults.startpageNum !=
          that.pageCount - that.defaults.visiblePageCount
        ) {
          that.defaults.startpageNum =
            that.pageCount - that.defaults.visiblePageCount
          that._hideAllShowSpecificPaginationItems(allItems)
        }
        that._createRenderPageItems(container, that._currentPage)
        that._setActiveLink(allItems)
        that._makePaginationBtnDisable()
      })
    }
  }
}

class ProPaginate extends Paginate {
  constructor (options) {
    super()
    this.defaults = Object.assign(this.defaults, {
      mainContainerSelector: '#paginate', // id is recomended.
      data: [],
      dataItemsArrayPath: '',
      dataItemHtml: '',
      showAlldataOnce: false,
      visibleDataonce: 5,
      showMoreAreaLabel: 'Show More',
      showMoreClass: 'show_more',
      mainDataArrayEmptyErrorHtml: '',
      singleDataItemArrayEmptyErrorHtml: '',
      onShowMoreClick: function () {}
    })
    this._optionsHandler(options)
    this.setCurrentPage = this.defaults.startpageNum
    this._init()
  }
  _init () {
    this.mainContainer = this._selectArrayofElement(
      this.defaults.mainContainerSelector
    )
    if (this._isDataValid()) {
      this.mainContainer.forEach(function (mainElement) {
        if (this.defaults.data.length == 0) {
          mainElement.innerHTML =
            this.defaults.mainDataArrayEmptyErrorHtml ||
            `<div>no data found.</div>`
          return
        }
        this.pageCount = this.defaults.data.length
        const pagination = this._createPagination()
        mainElement.innerHTML = pagination
        // get all pagination element and hide them and show only instructed items
        if (this.pageCount > 1) {
          const allPaginationLinkElements = this._selectArrayofElement(
            '#pagination_container .data-item'
          )
          this._hideAllShowSpecificPaginationItems(allPaginationLinkElements)
          this._setActiveLink(allPaginationLinkElements)
          this._makePaginationBtnDisable()
          const pageItemsContainer = this._selectSingleElement(
            '.paginate_wrapper .items_container'
          )
          this._createRenderPageItems(pageItemsContainer, this._currentPage)
          // handle event of every link items
          const that = this
          this._numElemClickHandler(
            allPaginationLinkElements,
            pageItemsContainer
          )
          if (this.pageCount > this.defaults.visiblePageCount) {
            this._firstClickHandler(
              allPaginationLinkElements,
              pageItemsContainer
            )
            this._prevClickHandler(
              allPaginationLinkElements,
              pageItemsContainer
            )
            this._nextClickHander(allPaginationLinkElements, pageItemsContainer)
            this._lastClickHandler(
              allPaginationLinkElements,
              pageItemsContainer
            )
            this._ellipseMoreClickHandler(
              allPaginationLinkElements,
              pageItemsContainer
            )
            this._ellipseLessClickHandler(
              allPaginationLinkElements,
              pageItemsContainer
            )
          }
        } else {
          const pageItemsContainer = this._selectSingleElement(
            '.paginate_wrapper .items_container'
          )
          this._createRenderPageItems(pageItemsContainer, this._currentPage)
        }
      }, this)
    }
  }

  _stringToTamplateGet (path, obj, fb = `$\{${path}}`) {
    return path.split('.').reduce((res, key) => res[key] || fb, obj)
  }

  _stringToTamplateParser (template, map, fallback) {
    return template.replace(/\$\{.+?}/g, match => {
      const path = match.substr(2, match.length - 3).trim()
      return this._stringToTamplateGet(path, map, fallback)
    })
  }

  _isDataValid () {
    if (!Array.isArray(this.defaults.data))
      throw Error('your data should be an array.')
    else return true
  }
  _createRenderPageItems (container, currentpage) {
    let dataArr =
      this.defaults.data[currentpage]?.[this.defaults.dataItemsArrayPath] || []
    if (dataArr.length > 0) {
      let renderToCount = this.defaults.showAlldataOnce
        ? dataArr.length
        : Math.min(this.defaults.visibleDataonce, dataArr.length)
      let allElement = ''
      for (let i = 0; i < renderToCount; i++) {
        const htmlElement = this._stringToTamplateParser(
          this.defaults.dataItemHtml,
          dataArr[i]
        )
        allElement += htmlElement
      }
      container.innerHTML = allElement

      this._handlePageScrollandTouchScrollDependingOverflows(container)

      if (dataArr.length > this.defaults.visibleDataonce) {
        if (!this.isShowMoreSectionExist) {
          this._createRenderShowMore(container)
          const showMoreSection = this._selectSingleElement(
            '.paginate_wrapper .show_more_btn'
          )
          showMoreSection.addEventListener(
            'click',
            this._showMoreClickEventCallback.bind(this)
          )
        }
      } else {
        if (this.isShowMoreSectionExist) {
          const showMoreSection = this._selectSingleElement(
            '.paginate_wrapper .show_more_btn'
          )
          showMoreSection.removeEventListener(
            'click',
            this._showMoreClickEventCallback.bind(this)
          )
          showMoreSection.remove()
          this.isShowMoreSectionExist = false
        }
      }
    } else {
      container.innerHTML =
        this.defaults.singleDataItemArrayEmptyErrorHtml ||
        `<div>No data available in this page.</div>`
    }
  }

  _createRenderShowMore (container) {
    const showMoreSection = `<div class="show_more_btn ${this.defaults.showMoreClass} hidden"><span>${this.defaults.showMoreAreaLabel}</span></div>`
    this.defaults.showAlldataOnce ||
      container.insertAdjacentHTML('afterend', showMoreSection)
    this.isShowMoreSectionExist = true
    this._showHideShowMore(container)
  }
  _showHideShowMoreScrollEventCallback (e) {
    if (this.isShowMoreSectionExist) {
      const showMoreSection = this._selectSingleElement(
        '.paginate_wrapper .show_more_btn'
      )
      if (e.target.classList.contains('column_view')) {
        if (
          e.target.scrollHeight - 20 <=
          e.target.scrollTop + e.target.clientHeight
        ) {
          showMoreSection.classList.remove('hidden')
        } else {
          showMoreSection.classList.add('hidden')
        }
      } else if (e.target.classList.contains('row_view')) {
        if (
          e.target.scrollWidth - 20 <=
          e.target.scrollLeft + e.target.clientWidth
        ) {
          showMoreSection.classList.remove('hidden')
        } else {
          showMoreSection.classList.add('hidden')
        }
      }
    }
  }
  _showHideShowMore (container) {
    if (this._checkElementOverflows(container)) {
      container.addEventListener(
        'scroll',
        this._showHideShowMoreScrollEventCallback.bind(this)
      )
    } else {
      if (this.isShowMoreSectionExist) {
        const showMoreSection = this._selectSingleElement(
          '.paginate_wrapper .show_more_btn'
        )
        if (showMoreSection.classList.contains('hidden'))
          showMoreSection.classList.remove('hidden')
      }
    }
  }
  _addMorePageItems (itemCount) {
    const pageItemsContainer = this._selectSingleElement(
      '.paginate_wrapper .items_container'
    )
    const alreadyExistEleCount =
      pageItemsContainer.querySelectorAll('div.data_item').length
    const dataArr =
      this.defaults.data[this._currentPage][this.defaults.dataItemsArrayPath]
    const loopEnd =
      dataArr.length - alreadyExistEleCount < itemCount
        ? dataArr.length - 1
        : alreadyExistEleCount - 1 + itemCount
    for (let i = alreadyExistEleCount - 1; i < loopEnd; i++) {
      const newElements = this._stringToTamplateParser(
        this.defaults.dataItemHtml,
        dataArr[i]
      )
      pageItemsContainer.insertAdjacentHTML('beforeend', newElements)
    }
    if (
      pageItemsContainer.querySelectorAll('div.data_item').length >=
        dataArr.length &&
      this.isShowMoreSectionExist
    ) {
      this._selectSingleElement('.paginate_wrapper .show_more_btn').remove()
      this.isShowMoreSectionExist = false
    } else {
      this._selectSingleElement(
        '.paginate_wrapper .show_more_btn'
      ).classList.add('hidden')
    }

    this._handlePageScrollandTouchScrollDependingOverflows(pageItemsContainer)
  }

  _showMoreClickEventCallback (e) {
    if (
      this.defaults.visibleDataonce < 5 &&
      this.defaults.visibleDataonce > 0
    ) {
      this._addMorePageItems(this.defaults.visibleDataonce)
    } else if (this.defaults.visibleDataonce >= 5) {
      this._addMorePageItems(Math.round(this.defaults.visibleDataonce / 2))
    }
  }
}
