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

    const url = 'https://www.zunisha.com/user/login';
    // const url = 'http://localhost:3000/user/login';

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
            window.location.href = 'https://agarwalfoods.co.in';
            console.log(data);
            localStorage.setItem('accesstoken', data?.token);
            getCartData();
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });

};