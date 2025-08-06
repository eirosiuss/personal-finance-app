// Base URL of our Express backend server
const url = 'http://localhost:5000';

// Function to handle user registration
const registerUser = async (username, password) => {

  // error handling
  try {
    const res = await fetch(`${url}/register`, {
      method: 'POST', // HTTP POST request
      headers: { 'Content-Type': 'application/json' }, // Sending JSON
      body: JSON.stringify({ username, password }) // Payload
    });

    // Check if request was successful
    if (!res.ok) {
      console.error('Registration failed');
      return res.json(); // Still return the error message
    }

    return res.json(); // Return server response (success, token, etc.)
  } catch (err) {
    console.error(err);
  }

};

// Function to handle user login
const loginUser = async (username, password) => {
  // error handling
  try {
    const res = await fetch(`${url}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      console.error('Login failed');
      return res.json(); // return the error message
    }

    return res.json(); // Server sends back token if login successful
  } catch (err) {
    console.error(err) 
  }   
};

// Export both functions so we can use them elsewhere
export { registerUser, loginUser };
