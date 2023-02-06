/*
 * A open source pagination plugin using pure Javascript.
 * v1.0.0
 *
 * @copyright	Copyright (c) 2023 Robiul H.
 * @license	MIT License; see LICENSE.txt
 */


class Paginate {
    constructor(options) {
        this.defaults = {
            /**
             * A selector to select the container. 
             * @property {string} default value is '.times'
             */
            containerSelector: '.items',
            /**
             * A selector to select all the items.
             * @property {string} default value is '.item'
             */
            itemSelector: '.item',
            /**
             * A selector to select the navigation container.
             * @property {string} default value is '.page_navigation'
             * 
             */
            navigationSelector: '.page_navigation',
            /**
             * Number of item you want to show in a single page.
             * @property {number} default value is 10
             * 
             */
            itemsPerPage: 10,

            pageLinksToDisplay: 10,


            startPage: 0,
            wrapAround: false,
            /**
             * Label/icon that you wanna show in the Go direct to First item button.
             * @property {string/htmlElement} default value is 'First'
             * 
             */
            navLabelFirst: 'First',
            /**
             * Label/icon that you wanna show in the Previous button.
             * @property {string/htmlElement} default value is 'Prev'
             * 
             */
            navLabelPrev: 'Prev',
            /**
             * Label/icon that you wanna show in the Previous button.
             * @property {string/htmlElement} default value is 'Next'
             * 
             */
            navLabelNext: 'Next',
            /**
             * Label/icon that you wanna show in the Go direct to Last item button.
             * @property {string/htmlElement} default value is 'Last'
             * 
             */
            navLabelLast: 'Last',

            navAriaLabelFirst: 'First',
            navAriaLabelPrev: 'Prev',
            navAriaLabelNext: 'Next',
            navAriaLabelLast: 'Last',

            navOrder: ["first", "prev", "num", "next", "last"],
            showFirstLast: false,
            showPrevNext: true,
            hideOnSmall: false,
            defaultClass: '',
            activeClass: "active",
            disabledClass: "disabled",
            onInit: function onInit() { },
            onPageDisplayed: function onPageDisplayed() { },
            // extra options
            pageLinkAreaLabel:[],
            onLinkItemClick: function onLinkItemClick(e){ },
        };

        // checking the provided options value
        if (typeof options === 'object' &&
            !Array.isArray(options) &&
            options !== null) {
            Object.assign(this.defaults, options);
        } else if (typeof options === "undefined") {
            console.group("%c Suggestion for Paginate javascript Library","color: black; background-color: #D6995B;padding: 5px;font-size:20px")
            console.log("%c It Seems like you haven't provided the options object. \n If you want to change the default settings Please provide a Option object providing your disire settings on it as properties. \n Like below:\n var example_1 = new Paginate({\n containerSelector: '.example_1 .items', \n itemSelector: '.example_1 .items > div', \n navigationSelector: '.example_1 .page_navigation', \n itemsPerPage: 3 \n })","padding:10px")
            console.groupEnd()

        } else {
            throw Error("Your provided value as Option must be an Object.")
        }

        this.init();
    }
    init() {
    	this.defaults.item_container = document.querySelector(this.defaults.containerSelector);
    	this.defaults.pagination_containers = document.querySelectorAll(this.defaults.navigationSelector);
    	/* Get all the items that are paginated */
    	const items = this.defaults.item_container.querySelectorAll(this.defaults.itemSelector);
    	if (this.defaults.hideOnSmall && this.defaults.itemsPerPage >= items.length) {
    		return;
    	}
    	this.current_page = this.defaults.startPage;
    	for (let i = 0; i < items.length; i++) {
    		items[i].style.display = 'none';
    		items[i].classList.add('hidden');
    	}
    	/* Calculate the number of pages needed */
    	var number_of_pages = Math.ceil(items.length / this.defaults.itemsPerPage);
    	/* Construct the navigation bar */
    	const more = '<li class="ellipse more"><span>...</span></li>';
    	const less = '<li class="ellipse less"><span>...</span></li>';
    	const first = !this.defaults.showFirstLast ? '' : '<li class="first_link ' + this.defaults.defaultClass + '"><a href="" aria-label="' + this.defaults.navAriaLabelFirst + '" onclick="">' + this.defaults.navLabelFirst + '</a></li>';
    	const last = !this.defaults.showFirstLast ? '' : '<li class="last_link ' + this.defaults.defaultClass + '"><a href="" aria-label="' + this.defaults.navAriaLabelLast + '" onclick="return false;">' + this.defaults.navLabelLast + '</a></li>';
    	const previous = !this.defaults.showPrevNext ? '' : '<li class="previous_link ' + this.defaults.defaultClass + '"><a href="" aria-label="' + this.defaults.navAriaLabelPrev + '" onclick="return false;">' + this.defaults.navLabelPrev + '</a></li>';
    	const next = !this.defaults.showPrevNext ? '' : '<li class="next_link ' + this.defaults.defaultClass + '"><a href="" aria-label="' + this.defaults.navAriaLabelNext + '" onclick="return false;">' + this.defaults.navLabelNext + '</a></li>';
    	let navigation_html = '<ul>';
    	for (let i = 0; i < this.defaults.navOrder.length; i++) {
    		switch (this.defaults.navOrder[i]) {
    			case "first":
    				navigation_html += first;
    				break;
    			case "last":
    				navigation_html += last;
    				break;
    			case "next":
    				navigation_html += next;
    				break;
    			case "prev":
    				navigation_html += previous;
    				break;
    			case "num":
    				if (this.defaults.showPrevNext) {
    					navigation_html += less;
    				}
    				var current_link = 0;
    				while (number_of_pages > current_link) {
    					var extra_class = '';
    					if (current_link == 0) {
    						extra_class = ' first';
    					}
    					if (current_link == number_of_pages - 1) {
    						extra_class = ' last';
    					}
    					navigation_html += '<li class="page_link' + extra_class + ' ' + this.defaults.defaultClass + '" longdesc="' + current_link + '"><a href="" aria-label="' + (current_link + 1) + '" onclick="return false;"><span>' + (current_link + 1) + '</span></a></li>';
    					current_link++;
    				}
    				if (this.defaults.showPrevNext) {
    					navigation_html += more;
    				}
    				break;
    		}
    	}
    	navigation_html += '</ul>';
    // 	/* Iterate through all pagination blocks */
    // 	this.defaults.pagination_containers.forEach(function (el) {
    // 		el.innerHTML = navigation_html;
    // 		/* Show a subset of page links */
    // 		var page_links = el.querySelectorAll('.page_link');
    // 		for (let i = 0; i < page_links.length; i++) {
    // 			if (i >= this.defaults.pageLinksToDisplay + this.defaults.startPage || i < this.defaults.startPage) {
    // 				page_links[i].style.display = 'none';
    // 			}
    // 		}
    // 		/* Hide the more/less indicators */
    // 		el.querySelectorAll('.ellipse').forEach(function (ellipses) {
    // 			ellipses.style.display = 'none';
    // 		});
    // 		/* Set the active page link styling */
    // 		if (page_links.length > 0) {
    // 			var first_page = page_links[0];
    // 			first_page.classList.add('active_page');
    // 			first_page.classList.add(this.defaults.activeClass);
    // 		}
    // 		this.total_page_no_links = page_links.length;
    // 		this.defaults.pageLinksToDisplay = Math.min(this.defaults.pageLinksToDisplay, this.total_page_no_links);
    // 		const that = this; /* avoids bind(this) in function(e) { }.bind(this) */
    // 		if (this.defaults.showFirstLast) {
    // 			/* Event handler for 'First' link */
    // 			el.querySelector('.first_link').addEventListener('click', function (e) {
    // 				e.preventDefault();
    // 				that.showFirstPage(el);
    // 			});
    // 			/* Event handler for 'Last' link */
    // 			el.querySelector('.last_link').addEventListener('click', function (e) {
    // 				e.preventDefault();
    // 				that.showLastPage(el);
    // 			});
    // 		}
    // 		if (this.defaults.showPrevNext) {
    // 			/* Event handler for 'Prev' link */
    // 			el.querySelector('.previous_link').addEventListener('click', function (e) {
    // 				e.preventDefault();
    // 				that.showPrevPage(el);
    // 			});

    // 			el.querySelector('.previous_link').addEventListener('keydown', function (e) {
    // 				if (e.keyCode == 37) {
    // 					this.click();
    // 				}
    // 			});

    // 			/* Event handler for 'Next' link */
    // 			el.querySelector('.next_link').addEventListener('click', function (e) {
    // 				e.preventDefault();
    // 				that.showNextPage(el);
    // 			});

    // 			el.querySelector('.next_link').addEventListener('keydown', function (e) {
    // 				if (e.keyCode == 39) {
    // 					this.click();
    // 				}
    // 			});
    // 		}
    // 		/* Event handler for each 'Page' link */
    // 		el.querySelectorAll('.page_link').forEach(function (page) {
    // 			page.addEventListener('click', function (e) {
    // 				e.preventDefault();
    // 				that.gotopage(page.getAttribute('longdesc'));
    // 			});
    // 		}, that);
    // 	}, this);
    // 	this.gotopage(parseInt(this.defaults.startPage));
    // 	/* Set the pagination as ready */
    // 	this.defaults.item_container.classList.add('loaded');
    // 	/* Call user onInit */
    // 	this.defaults.onInit.call(this);
    }




    // showFirstPage(el) {
    // 	this.movePageNumbersRight(el.querySelector('.first_link'), 0);
    // 	this.gotopage(0);
    // }
    // showLastPage(el) {
    // 	var lastPage = this.total_page_no_links - 1;
    // 	this.movePageNumbersLeft(el.querySelector('.last_link'), lastPage);
    // 	this.gotopage(lastPage);
    // }
    // showPrevPage(el) {
    // 	var new_page = parseInt(this.current_page) - 1;
    // 	var before_active = el.querySelector('.previous_link').parentNode.querySelector('.active_page').previousElementSibling;
    // 	if (before_active != null && before_active.classList.contains('page_link')) {
    // 		this.movePageNumbersRight(el.querySelector('.previous_link'), new_page);
    // 		this.gotopage(new_page);
    // 	}
    // 	else if (this.defaults.wrapAround) {
    // 		this.movePageNumbersLeft(el.querySelector('.previous_link'), this.total_page_no_links - 1);
    // 		this.gotopage(this.total_page_no_links - 1);
    // 	}
    // }
    // showNextPage(el) {
    // 	var new_page = parseInt(this.current_page) + 1;
    // 	var after_active = el.querySelector('.next_link').parentNode.querySelector('.active_page').nextElementSibling;
    // 	if (after_active != null && after_active.classList.contains('page_link')) {
    // 		this.movePageNumbersLeft(el.querySelector('.next_link'), new_page);
    // 		this.gotopage(new_page);
    // 	}
    // 	else if (this.defaults.wrapAround) {
    // 		this.movePageNumbersRight(el.querySelector('.next_link'), 0);
    // 		this.gotopage(0);
    // 	}
    // }
    // gotopage(page_num) {
    // 	page_num = parseInt(page_num, 10);
    // 	var ipp = parseInt(this.defaults.itemsPerPage);
    // 	/* Find the start of the next slice */
    // 	var start_from = page_num * ipp;
    // 	/* Find the end of the next slice */
    // 	var end_on = start_from + ipp;
    // 	/* Hide the current page */
    // 	var items = this.defaults.item_container.querySelectorAll(this.defaults.itemSelector);
    // 	for (let i = 0; i < items.length; i++) {
    // 		if (i >= end_on || i < start_from) {
    // 			items[i].style.display = 'none';
    // 			items[i].classList.remove('visible');
    // 			items[i].classList.add('hidden');
    // 		}
    // 		else {
    // 			items[i].style.display = 'inline-block';
    // 			setTimeout(function () {
    // 				items[i].classList.remove('hidden');
    // 				items[i].classList.add('visible');
    // 			}, 20);
    // 		}
    // 	}
    // 	/* Reassign the active class */
    // 	this.defaults.pagination_containers.forEach(function (el) {
    // 		var page_links = el.querySelectorAll('.page_link');
    // 		for (let i = 0; i < page_links.length; i++) {
    // 			if (page_links[i].getAttribute('longdesc') == page_num) {
    // 				page_links[i].classList.add('active_page');
    // 				page_links[i].classList.add(this.defaults.activeClass);
    // 			}
    // 			else {
    // 				page_links[i].classList.remove('active_page');
    // 				page_links[i].classList.remove(this.defaults.activeClass);
    // 			}
    // 		}
    // 	}, this);
    // 	/* Set the current page */
    // 	this.current_page = page_num;
    // 	/* Hide the more and/or less indicators */
    // 	this.toggleMoreLess();
    // 	/* Add a class to the next or prev links if there are no more pages next or previous to the active page */
    // 	if (!this.defaults.wrapAround) {
    // 		this.tagNextPrev();
    // 	}
    // 	this.defaults.onPageDisplayed.call(this, page_num + 1);
    // }
    // movePageNumbersLeft(e, new_p) {
    // 	var new_page = new_p;
    // 	e.parentNode.querySelectorAll('.page_link').forEach(function (el) {
    // 		if (el.getAttribute('longdesc') == new_page && !el.classList.contains('active_page') && el.style.display == 'none') {
    // 			this.defaults.pagination_containers.forEach(function (el) {
    // 				var page_links = el.querySelectorAll('.page_link');
    // 				for (let i = 0; i < page_links.length; i++) {
    // 					if (i < new_page + 1 && i >= parseInt(new_page - this.defaults.pageLinksToDisplay + 1)) {
    // 						page_links[i].style.display = 'inline';
    // 					}
    // 					else {
    // 						page_links[i].style.display = 'none';
    // 					}
    // 				}
    // 			}, this);
    // 		}
    // 	}, this);
    // }
    // movePageNumbersRight(e, new_p) {
    // 	var new_page = new_p;
    // 	e.parentNode.querySelectorAll('.page_link').forEach(function (el) {
    // 		if (el.getAttribute('longdesc') == new_page && !el.classList.contains('active_page') && el.style.display == 'none') {
    // 			this.defaults.pagination_containers.forEach(function (el) {
    // 				var page_links = el.querySelectorAll('.page_link');
    // 				for (let i = 0; i < page_links.length; i++) {
    // 					if (i < new_page + parseInt(this.defaults.pageLinksToDisplay) && i >= new_page) {
    // 						page_links[i].style.display = 'inline';
    // 					}
    // 					else {
    // 						page_links[i].style.display = 'none';
    // 					}
    // 				}
    // 			}, this);
    // 		}
    // 	}, this);
    // }
    // toggleMoreLess() {
    // 	this.defaults.pagination_containers.forEach(function (container) {
    // 		var more = container.querySelector('.more');
    // 		if (more != null) {
    // 			more.style.display = 'none';
    // 			if (container.querySelector('.page_link.last') && this.isHidden(container.querySelector('.page_link.last'))) {
    // 				more.style.display = 'inline';
    // 			}
    // 		}
    // 		var less = container.querySelector('.less');
    // 		if (less != null) {
    // 			less.style.display = 'none';
    // 			if (container.querySelector('.page_link.first') && this.isHidden(container.querySelector('.page_link.first'))) {
    // 				less.style.display = 'inline';
    // 			}
    // 		}
    // 	}, this);
    // }
    // tagNextPrev() {
    // 	this.defaults.pagination_containers.forEach(function (container) {
    // 		var next = container.querySelector('.next_link');
    // 		var previous = container.querySelector('.previous_link');
    // 		var first = container.querySelector('.first_link');
    // 		var last = container.querySelector('.last_link');
    // 		if (container.querySelector('.page_link.last') && container.querySelector('.page_link.last').classList.contains('active_page')) {
    // 			if (next != null) {
    // 				next.classList.add('no_more');
    // 				next.classList.add(this.defaults.disabledClass);
    // 			}
    // 			if (last != null) {
    // 				last.classList.add('no_more');
    // 				last.classList.add(this.defaults.disabledClass);
    // 			}
    // 		}
    // 		else {
    // 			if (next != null) {
    // 				next.classList.remove('no_more');
    // 				next.classList.remove(this.defaults.disabledClass);
    // 			}
    // 			if (last != null) {
    // 				last.classList.remove('no_more');
    // 				last.classList.remove(this.defaults.disabledClass);
    // 			}
    // 		}
    // 		if (container.querySelector('.page_link.first') && container.querySelector('.page_link.first').classList.contains('active_page')) {
    // 			if (previous != null) {
    // 				previous.classList.add('no_more');
    // 				previous.classList.add(this.defaults.disabledClass);
    // 			}
    // 			if (first != null) {
    // 				first.classList.add('no_more');
    // 				first.classList.add(this.defaults.disabledClass);
    // 			}
    // 		}
    // 		else {
    // 			if (previous != null) {
    // 				previous.classList.remove('no_more');
    // 				previous.classList.remove(this.defaults.disabledClass);
    // 			}
    // 			if (first != null) {
    // 				first.classList.remove('no_more');
    // 				first.classList.remove(this.defaults.disabledClass);
    // 			}
    // 		}
    // 	}, this);
    // }
    // isHidden(el) {
    // 	var style = window.getComputedStyle(el);
    // 	return ((style.display === 'none') || (style.visibility === 'hidden'));
    // }
}

