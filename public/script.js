// Wait for the DOM to be ready
$(document).ready(function () {
    // Attach a submit event handler to the filter form
    $('#filterForm').submit(function (event) {
      // Prevent the default form submission
      event.preventDefault();
  
      // Get the values from the form
    //   const title = $('#title').val();
    //   const type = $('#type').val();

      const formData = $(this).serialize();
      console.log('Serialized Form Data:', formData);
  
      // Make an AJAX request to the server for filtering and searching
      $.ajax({
        type: 'GET',
        url: '/games/search', // Update the URL to match your server route for filtering
        data:formData,
        success: function (data) {
          // Replace the content of the game grid with the updated data
          $('#gameGrid').html(data);
          const url = '/games/search?' + formData;
            history.pushState(null, null, url);
        },
        error: function (error) {
          console.error('Error:', error);
        }
      });
    });
  });
  