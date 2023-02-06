class Paginate {
  constructor () {
    this.defaults = {
      itemsContainerClass: '.items_container',
      paginationContainerClass: '.pagination_container',
      itemsView: 'row_view', // row_view || column_view
      wrapAround: true,
      paginationHideOnSmall: true,
      showPrevNext: true,
      showFirstLast: true,
      defaultClass: '',
      firstAreaLabel: 'First',
      prevAreaLabel: 'Prev',
      nextAreaLabel: 'Next',
      lastAreaLabel: 'Last',
      pageLinkAreaLabel: ['jan', 'feb', 'march', 'april'],
      hasEllips: true,
      paginationOrder: ['first', 'prev', 'num', 'next', 'last'],
      hasMoreLess: false,
      paginationSelector: '.pagination',
      startpageNum: 0,
      visiblePageCount: 4,
      onLinkClick: function () {},
      onFirstClick: function () {},
      onLastClick: function () {},
      onPrevClick: function () {},
      onNextClick: function () {},
      onMoreClick: function () {},
      onLessClick: function () {}
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
  _selectElement (selector) {
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

  _checkElementOverflows (element) {
    if (element.classList.contains('row_view')) {
      if (element.offsetWidth < element.scrollWidth) return true
      return false
    } else if (element.classList.contains('column_view')) {
      if (element.offsetHeight < element.scrollHeight) return true
      return false
    }
  }
  _pageItemsHorizontalScroll (container) {
    if (container.classList.contains('row_view')) {
      container.addEventListener(
        'wheel',
        function (e) {
          container.scrollLeft += e.deltaY * 3
        },
        { passive: true }
      )
    }
  }
  _pageItemsTouchScroll (container) {
    // should fire when the page overflows. that means gets bigger that the parent.
    let startPossition = { startClintX: 0, startClintY: 0 }
    const mouseDownHandler = function (e) {
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
    container.addEventListener('mousedown', mouseDownHandler)
  }
  _createPagination (pageCount) {
    // createPagination section
    const more = this.defaults.hasEllips
      ? '<li class="pagination_item ellipse more"><span>...</span></li>'
      : ''
    const less = this.defaults.hasEllips
      ? '<li class="pagination_item ellipse less"><span>...</span></li>'
      : ''
    const first = !this.defaults.showFirstLast
      ? ''
      : '<li class="pagination_item paginaiton_first' +
        this.defaults.defaultClass +
        '"><a href="" aria-label="' +
        this.defaults.firstAreaLabel +
        '" onclick="return false;">' +
        this.defaults.firstAreaLabel +
        '</a></li>'
    const last = !this.defaults.showFirstLast
      ? ''
      : '<li class="pagination_item paginaiton_last' +
        this.defaults.defaultClass +
        '"><a href="" aria-label="' +
        this.defaults.lastAreaLabel +
        '" onclick="return false;">' +
        this.defaults.lastAreaLabel +
        '</a></li>'
    const previous = !this.defaults.showPrevNext
      ? ''
      : '<li class="pagination_item paginaiton_prev' +
        this.defaults.defaultClass +
        '"><a href="" aria-label="' +
        this.defaults.prevAreaLabel +
        '" onclick="return false;">' +
        this.defaults.prevAreaLabel +
        '</a></li>'
    const next = !this.defaults.showPrevNext
      ? ''
      : '<li class="pagination_item paginaiton_next' +
        this.defaults.defaultClass +
        '"><a href="" aria-label="' +
        this.defaults.nextAreaLabel +
        '" onclick="return false;">' +
        this.defaults.nextAreaLabel +
        '</a></li>'
    let paginationContainer = ` <div id="pagination_container"><ul class="pagination_wrapper">`

    this.defaults.paginationOrder.forEach(function (element) {
      switch (element) {
        case 'first':
          paginationContainer += first
          break
        case 'prev':
          paginationContainer += previous
          break
        case 'next':
          paginationContainer += next
          break
        case 'last':
          paginationContainer += last
          break
        case 'num':
          this.defaults.hasEllips ? (paginationContainer += less) : ''
          let count = 0
          while (count <= pageCount - 1) {
            let currentLink = ''
            switch (count) {
              case 0:
                currentLink = 'first_num_link'
                break
              case pageCount - 1:
                currentLink = 'last_num_link'
                break
            }
            paginationContainer += `<li class="pagination-item ${
              this.defaults.defaultClass
            } data-item ${currentLink}" aria-label="${count}"><a href="#" onclick="return false">${
              Array.isArray(this.defaults.pageLinkAreaLabel)
                ? this.defaults.pageLinkAreaLabel[count] || count + 1
                : count + 1
            }</a></li>`
            count++
          }
          this.defaults.hasEllips ? (paginationContainer += more) : ''
          break
      }
    }, this)
    return (paginationContainer += `</ul></div>`)
  }

  _hideAllShowSpecificPaginationItems (allEle) {
    allEle.forEach(function (item, ind) {
      if (
        ind < this.defaults.startpageNum ||
        ind > this.defaults.startpageNum + this.defaults.visiblePageCount - 1
      )
        item.style.display = 'none'
      else item.style.display = 'list-item'
    }, this)
  }

  _setActiveLink (allEle) {
    allEle.forEach(function (elem, ind) {
      if (this._currentPage == ind) elem.classList.add('active')
      else elem.classList.remove('active')
    }, this)
  }
}

// console.log(new Paginate());
// class PaginateClassic extends Paginate {
// next button and previous button only.
// }

// class PaginateMinimal extends Paginate {

// }

class ProPaginate extends Paginate {
  #dummyData = [
    {
      month: 'jan',
      data: [
        {
          _date: 'Jan 20',
          location: 'Chattagram'
        }
      ]
    },
    {
      month: 'feb',
      data: [
        {
          _date: 'feb 20',
          location: 'Chattagram'
        }
      ]
    },
    {
      month: 'march',
      data: [
        {
          _date: 'march 12',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'apr',
      data: [
        {
          _date: 'apr 12',
          location: 'Dhaka'
        },
        {
          _date: 'apr 32',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'may',
      data: [
        {
          _date: 'may 5',
          location: 'Dhaka'
        },
        {
          _date: 'may 25',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'jun',
      data: [
        {
          _date: 'jun 4',
          location: 'Dhaka'
        },
        {
          _date: 'jun 24',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'jul',
      data: [
        {
          _date: 'jul 5',
          location: 'Dhaka'
        },
        {
          _date: 'jul 3',
          location: 'Dhaka'
        },
        {
          _date: 'jul 25',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'aug',
      data: [
        {
          _date: 'aug 4',
          location: 'Dhaka'
        },
        {
          _date: 'aug 3',
          location: 'Dhaka'
        },
        {
          _date: 'aug 11',
          location: 'Dhaka'
        },
        {
          _date: 'aug 13',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'sep',
      data: [
        {
          _date: 'sep 3',
          location: 'Dhaka'
        },
        {
          _date: 'sep 2',
          location: 'Dhaka'
        },
        {
          _date: 'sep 6',
          location: 'Dhaka'
        },
        {
          _date: 'sep 6',
          location: 'Dhaka'
        },
        {
          _date: 'sep 5',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'oct',
      data: [
        {
          _date: 'oct 3',
          location: 'Dhaka'
        },
        {
          _date: 'oct 23',
          location: 'Dhaka'
        },
        {
          _date: 'oct 13',
          location: 'Dhaka'
        },
        {
          _date: 'oct 23',
          location: 'Dhaka'
        },
        {
          _date: 'oct 3',
          location: 'Dhaka'
        },
        {
          _date: 'oct 13',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'nov',
      data: [
        {
          _date: 'nov 2',
          location: 'Dhaka'
        },
        {
          _date: 'nov 2',
          location: 'Dhaka'
        },
        {
          _date: 'nov 22',
          location: 'Dhaka'
        },
        {
          _date: 'nov 2',
          location: 'Dhaka'
        },
        {
          _date: 'nov 22',
          location: 'Dhaka'
        },
        {
          _date: 'nov 22',
          location: 'Dhaka'
        },
        {
          _date: 'nov 2',
          location: 'Dhaka'
        },
        {
          _date: 'nov 22',
          location: 'Dhaka'
        },
        {
          _date: 'nov 2',
          location: 'Dhaka'
        }
      ]
    },
    {
      month: 'dec',
      data: [
        {
          _date: 'dec 5',
          location: 'Dhaka'
        },
        {
          _date: 'dec 15',
          location: 'Dhaka'
        },
        {
          _date: 'dec 16',
          location: 'Dhaka'
        },
        {
          _date: 'dec 5',
          location: 'Dhaka'
        },
        {
          _date: 'dec 15',
          location: 'Dhaka'
        },
        {
          _date: 'dec 16',
          location: 'Dhaka'
        },
        {
          _date: 'dec 5',
          location: 'Dhaka'
        },
        {
          _date: 'dec 15',
          location: 'Dhaka'
        },
        {
          _date: 'dec 5',
          location: 'Dhaka'
        },
        {
          _date: 'dec 16',
          location: 'Dhaka'
        },
        {
          _date: 'dec 15',
          location: 'Dhaka'
        },
        {
          _date: 'dec 16',
          location: 'Dhaka'
        },
        {
          _date: 'dec 16',
          location: 'Dhaka'
        },
        {
          _date: 'dec 15',
          location: 'Dhaka'
        },
        {
          _date: 'dec 5',
          location: 'Dhaka'
        },
        {
          _date: 'dec 15',
          location: 'Dhaka'
        },
        {
          _date: 'dec 5',
          location: 'Dhaka'
        }
      ]
    }
  ]
  constructor (options) {
    super()
    this.defaults = Object.assign(this.defaults, {
      paginationType: 'propaginate',
      mainContainerSelector: '#paginate', // id is recomended.
      data: this.#dummyData,
      dataItemsArrayPath: 'data',
      dataItemHtml: '',
      showAlldataOnce: false,
      visibleDataonce: 10,
      linkAreaLabel: 1,
      showMoreAreaLabel: '',
      showMoreClass: '',
      onShowMoreClick: function () {}
    })
    this._optionsHandler(options)
    this.setCurrentPage = this.defaults.startpageNum
    this._init()
  }
  _init () {
    this.mainContainer = this._selectElement(
      this.defaults.mainContainerSelector
    )
    if (this._isDataValid()) {
      this.mainContainer.forEach(function (ele, ind) {
        this.pageCount = this.defaults.data.length
        let paginateWrapper = '<div class="paginate_wrapper">'
        paginateWrapper += `<div class="items_container ${this.defaults.itemsView}"> </div>`
        const paginationContainer = this._createPagination(this.pageCount)
        paginateWrapper += paginationContainer
        paginateWrapper += '</div>'
        ele.innerHTML = paginateWrapper
        // get all pagination element and hide them and show only instructed items
        const allPaginationLinkElements = document.querySelectorAll(
          '#pagination_container .data-item'
        )
        this._hideAllShowSpecificPaginationItems(allPaginationLinkElements)
        this._setActiveLink(allPaginationLinkElements)
        const pageItemsContainer = document.querySelector(
          '.paginate_wrapper .items_container'
        )
        this._createRenderPageItems(pageItemsContainer, this._currentPage)
      }, this)
    }
  }

  _isDataValid () {
    if (!Array.isArray(this.defaults.data))
      throw Error('your data should be an array.')
    else if (this.defaults.data.length == 0)
      throw Error('please provide some data.')
    else return true
  }
  _createRenderPageItems (container, currentpage) {
    let dataArr = this.defaults.data[11][this.defaults.dataItemsArrayPath]
    let renderToCount = this.defaults.showAlldataOnce
      ? dataArr.length
      : Math.min(this.defaults.visibleDataonce, dataArr.length)
    let allElement = ''
    for (let i = 0; i < renderToCount; i++) {
      const htmlElement =
        this.defaults.dataItemHtml ||
        `<div class="data_item">
                  <div class="data_item_details">
                    <span class="data_item_date">${dataArr[i]._date}</span
                    ><span class="data_item_location">${dataArr[i].location}</span>
                  </div>
                </div>`
      allElement += htmlElement
    }
    container.innerHTML = allElement
    if (this._checkElementOverflows(container)) {
      container.style.justifyContent = 'flex-start'
      this._pageItemsHorizontalScroll(container)
      this._pageItemsTouchScroll(container)
      this._createRenderShowMore(container)
    }
  }

  _createRenderShowMore (container) {
    const showMoreSection = `<div class="show_more_btn ${
      this.defaults.showMoreClass
    } hidden"><span>${
      this.defaults.showMoreAreaLabel || 'Show More'
    }</span></div>`
    this.defaults.showAlldataOnce ||
      container.insertAdjacentHTML('afterend', showMoreSection)
    this._showHideShowMore(container)
  }
  _showHideShowMore (container) {
    const showMoreSection = document.querySelector('.show_more_btn')
    container.addEventListener('scroll', function (e) {
      if (container.classList.contains('column_view')) {
        if (
          container.scrollHeight - 20 <=
          container.scrollTop + container.clientHeight
        )
          showMoreSection.classList.remove('hidden')
        else showMoreSection.classList.add('hidden')
      } else if (container.classList.contains('row_view')) {
        if (
          container.scrollWidth - 20 <=
          container.scrollLeft + container.clientWidth
        )
          showMoreSection.classList.remove('hidden')
        else showMoreSection.classList.add('hidden')
      }
    })
  }
}

// let ProPaginate_1 = new ProPaginate()
// ProPaginate_1.setCurrentPage = 3
// let ProPaginate_2 = new ProPaginate()
// ProPaginate_2.setCurrentPage = 4

// console.log(ProPaginate_1);
// console.log(ProPaginate_2);
