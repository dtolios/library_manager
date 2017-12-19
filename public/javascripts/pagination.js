const Pagination = (() => {

  const $items = $('tbody > tr');
  const itemsPerPage = 10;

  /**
   * Sets the number of items in the list
   * @param numItems
   */
  const setNumStudents = (numItems) => {
    this.numStudents = numItems;
  };

  /**
   * Sets the number of total pages
   * @param numPages
   */
  const setNumPages = (numPages) => {
    this.numPages = Math.ceil(numPages);
  };

  /**
   * Adds required html container for pagination buttons
   */
  const addPaginationContainer = () => {
    $('table').after($('<div class="pagination"><ul></ul></div>'));
  };

  /**
   * Adds a page button to the pagination container
   */
  const addPageButton = (number) => {
    $('.pagination ul').append($('<li><a href="#">' + number + '</a></li>'));
  };

  /**
   * Sets the target's class to "active"
   * @param $target
   */
  const setButtonActive = ($target) => {
    // First remove the class from the old active button, then add it to the current target
    $('.pagination ul li').find('.active').removeClass('active');
    $target.addClass('active');
  };

  /**
   * Sets the class of the items in $obj to "active"
   * @param $obj
   * @param start
   * @param end
   */
  const setItemActive = ($obj, start, end) => {
    // First remove the class from the old set of active items, then add to current range
    $items.removeClass('active');
    $obj.slice(start, end).addClass('active');
  };

  /**
   * Displays the items in $active
   * @param $active
   */
  const showActiveItems = ($active) => {
    $items.hide();
    $active.show();
  };

  /**
   * event handler for page button clicks
   * @param ev
   */
  const buttonClick = (ev) => {
    ev.preventDefault();
    $target = $(ev.target);

    if ($target.attr('class') !== 'active') {
      setButtonActive($target);

      // Calculate the active range
      const pageNumber = parseInt($target.text());
      let end = pageNumber * itemsPerPage;
      if(pageNumber === this.numPages) {
        end -= (itemsPerPage - this.numStudents % itemsPerPage);
      }
      const start = (pageNumber * itemsPerPage) - itemsPerPage;
      // Set the active items based on the range
      setItemActive(ev.data.$itemList, start, end);
      const $active = ev.data.$itemList.filter('.active');
      // Display results
      showActiveItems($active);
    }
  };

  // PUBLIC METHODS //

  // EFFECTS: initializes pagination functionality
  let init = () => {
    // Add the container HTML for page buttons
    addPaginationContainer();
    // Add the appropriate buttons and listeners
    paginate($items);
  };

  // EFFECTS: Adds the appropriate buttons and listeners for pagination functionality
  let paginate = ($itemList) => {
    setNumStudents($itemList.length);

    setNumPages( this.numStudents / itemsPerPage );

    // Set active students from beginning
    setItemActive($itemList, 0, itemsPerPage);

    // Show initial active students
    showActiveItems($itemList.filter('.active'));

    // Add pagination buttons only if the number of pages is greater than 1
    if(this.numPages > 1) {
      for(let i = 1; i <= this.numPages; i++) {
        addPageButton(i);
      }

      // Set button 1 to active
      $('.pagination ul li:first-child a').addClass('active');
      // Add event listener
      $('.pagination ul').on('click', 'li', {$itemList: $itemList}, buttonClick);
    }
  };

  // EFFECTS: removes page buttons, listeners, and all active students
  let destroy = () => {
    $('.pagination ul').off('click', 'li', buttonClick)
    $('.pagination ul li').remove();
    $items.removeClass('active');
  };

  // PUBLIC API: //
  return {
    init: init,
    paginate: paginate,
    destroy: destroy
  }

})();

// Enable pagination on the page
Pagination.init();
