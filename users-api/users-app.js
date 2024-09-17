const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  // It's just a dummy service - we don't really care for the email
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: 'An email and password needs to be specified!' });
  }

  //return res.status(200).json({ token: `${process.env.AUTH_ADDRESS}`})

  try {
    const hashedPW = await axios.get(`http://${process.env.AUTH_ADDRESS}/hashed-password/` + password);
    // const hashedPW = 'dummy text';
    // since it's a dummy service, we don't really care for the hashed-pw either
    console.log(hashedPW, email);
    res.status(201).json({ message: 'User created!' });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Creating the user failed - please try again later.'+`http://${process.env.AUTH_ADDRESS}/hashed-password/` + password });
  }
});

app.post('/login', async (req, res) => {
  // It's just a dummy service - we don't really care for the email
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: 'An email and password needs to be specified!' });
  }

 // return res.status(response.status).json({ message: 'Logging in failed!'+`http://${process.env.AUTH_SERVICE_SERVICE_HOST}/token/` + hashedPassword + '/' + password });

  // normally, we'd find a user by email and grab his/ her ID and hashed password
  // const hashedPassword = password + '_hash';
  // const response = await axios.get(
  //   `http://${process.env.AUTH_SERVICE_SERVICE_HOST}/token/` + hashedPassword + '/' + password
  // );
  // // const response = { status: 200, data: { token: 'abc' } };
  // if (response.status === 200) {
  //   return res.status(200).json({ token: response.data.token });
  // }

  // try {
  //   const hashedPassword = password + '_hash';
  //   const response = await axios.get(
  //     `http://${process.env.AUTH_SERVICE_SERVICE_HOST}/token/` + hashedPassword + '/' + password
  //   );
  
  //   if (response.status === 200) {
  //     return res.status(200).json({ token: response.data.token });
  //   } else {
  //     return res.status(response.status).json({ message: 'Unexpected response status' });
  //   }
  // } catch (error) {
  //   console.error('Error occurred while fetching token:', error);
  
  //   // Return an appropriate error response to the client
  //   return res.status(500).json({ message: 'Internal server error', error: error.message });
  // }

  try {
    const hashedPassword = password + '_hash';
    
    // Attempt to make the request to the auth service
    const response = await axios.get(
      `http://${process.env.AUTH_ADDRESS}/token/${hashedPassword}/${password}`
    );
    
    // Check the response status
    if (response.status === 200) {
      return res.status(200).json({ token: response.data.token });
    } else {
      return res.status(response.status).json({ message: 'Unexpected response from the auth service' });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error occurred while fetching token:', error);
  
    // Send a 500 response back to the client indicating an internal server error
    return res.status(500).json({ message: 'Failed to fetch token from auth service', error: error.message });
  }
 // return res.status(response.status).json({ message: 'Logging in failed!'+`http://${process.env.AUTH_SERVICE_SERVICE_HOST}/token/` + hashedPassword + '/' + password });
});

app.listen(3002);
