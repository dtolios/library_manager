const Search = (() => {

  const $items = $('tbody > tr');

  /**
   * Appends the required search html to the supplied element
   */
  const addSearch = (el) => {
    let searchHTML = '<div class="search"><input placeholder="Search..."><button>Search</button></div>';
    $(el).before(searchHTML);
  };

  /**
   * Removes all matched students and any search errors
   */
  const reset = () => {
    if ($('.search-error').length) {
      removeError();
    }
    $items.removeClass('matched');
  };

  /**
   * Returns the user input from the search field
   * @returns {*|jQuery}
   */
  const getQuery = () => {
    return $('.search input').val();
  };

  /**
   * Appends an error message as a list item to the student list
   */
  const appendError = () => {
    let $error = $('<td class="search-error">No Matches Found</td>');
    $('tbody').append($error);
  };

  /**
   * Removes the error message from the student list
   */
  let removeError = () => {
    $('.search-error').remove();
  };

  /**
   * Toggles the visibility of items based on the query contents
   */
  const filterItems = () => {
    const query = getQuery().toUpperCase();

    reset();

    if (query !== '') {
      const $filteredList = $items.filter((index, node) => {
        const isInCol1 = $('td:first-child', node).text().toUpperCase().includes(query);
        const isInCol2 = $('td:nth-child(2)', node).text().toUpperCase().includes(query);
        const isInCol3 = $('td:nth-child(3)', node).text().toUpperCase().includes(query);
        const isInCol4 = $('td:nth-child(4)', node).text().toUpperCase().includes(query);
        const isInCol5 = $('td:nth-child(5)', node).text().toUpperCase().includes(query);
        return isInCol1 || isInCol2 || isInCol3 || isInCol4 || isInCol5;
      });

      $filteredList.addClass('matched');

      // Display an error if no search results are found
      if ($filteredList.length === 0) {
        appendError();
      }
      // Reset the pagination for the filteredList
      Pagination.destroy();
      Pagination.paginate($filteredList);
    }
    else {
      Pagination.destroy();
      Pagination.paginate($items);
    }
  };

  /**
   * Event handler for searching
   * @param event
   */
  const searchHandler = (event) => {
    event.preventDefault();
    filterItems();
  };

  /**
   * Initializing search functionality by adding proper HTML and adding event listeners
   */
  const init = () => {
    addSearch('table');
    $('.search button').on('click', searchHandler);
    $('.search input').on('keyup', (e) => { if(e.which === 13) searchHandler(e); });
  };

  // PUBLIC API: //
  return {
    init: init
  };
})();

// Enable search on the page
Search.init();
