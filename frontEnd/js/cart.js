function getCartData() {
    const apiUrl = 'https://www.zunisha.com/cart'; // Replace with the actual API URL
    // const apiUrl = 'http://localhost:3000/cart'; // Replace with the actual API URL

    // Configuration for the GET request
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTRhNmM5YzY4NmZjOGEyOTQ0Y2JhYzMiLCJmaXJzdE5hbWUiOiJLdW5hbCIsImxhc3ROYW1lIjoiaW0ua3VuYWxtYXRodXJAZ21haWwuY29tIiwiaWF0IjoxNjk5Mzc3ODk2LCJleHAiOjE2OTkzODE0OTZ9.Zgp6yXWfvG0bjrUsGwB75kJYvC73pKxh4g9znOyWAG4'
        },
    };

    // Make the GET request
    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            // Handle the response data here
            console.log('Response data:', data);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}