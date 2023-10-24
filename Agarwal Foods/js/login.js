function login() {

    // Retrieve the values entered by the user
    const username = document.getElementById('login-name').value;
    const password = document.getElementById('login-password').value;
    // You can also send this data to a server or perform any other desired actions.

    const data = {
        "email": username,
        "password": password
    };

    // Configuration for the POST request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(data), // Convert data to JSON format
    };

    const url = 'http://localhost:3000/user/login';

    // Make the POST request
    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            // Handle the response data here
            window.location.href = 'http://127.0.0.1:5501/index.html';
            getCartData()
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });


};


// function getCartData() {
//     const apiUrl = 'http://localhost:3000/cart'; // Replace with the actual API URL

//     // Configuration for the GET request
//     const requestOptions = {
//         method: 'GET',
//         headers: {
//             // You can add headers here if necessary
//             // For example, to include an API key:
//             // 'Authorization': 'Bearer YOUR_API_KEY'
//         },
//     };

//     // Make the GET request
//     fetch(apiUrl, requestOptions)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json(); // Parse the response body as JSON
//         })
//         .then(data => {
//             // Handle the response data here
//             console.log('Response data:', data);
//         })
//         .catch(error => {
//             // Handle any errors that occurred during the fetch
//             console.error('Fetch error:', error);
//         });
// }