# Fast Shrink - Simple URL Shortener

Fast Shrink is a simple URL shortener that allows users to shorten long URLs and generate QR codes for easy sharing. This project is built using Node.js, Express.js, and MongoDB for the backend, with a clean and minimal frontend using HTML, CSS, and JavaScript.

## Features

- Shorten long URLs
- Generate QR codes for shortened URLs
- Copy shortened URLs to clipboard
- Track the number of clicks on each shortened URL

## Project Structure

```
fast-shrink
├── public
│   ├── index.html      # Frontend HTML structure
│   ├── style.css       # CSS styles for the frontend
│   └── app.js          # JavaScript for handling user interactions
├── models
│   └── Url.js          # MongoDB schema for URL mapping
├── routes
│   └── url.js          # Backend routes for URL shortening
├── server.js           # Entry point of the application
├── package.json        # npm configuration file
└── README.md           # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fast-shrink.git
   cd fast-shrink
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your MongoDB database and update the connection string in `server.js`.

4. Start the server:
   ```
   node server.js
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

1. Enter a long URL in the input field.
2. Click the "Shorten URL" button to generate a shortened URL.
3. Use the "Copy" button to copy the shortened URL to your clipboard.
4. Click the "Generate QR Code" button to display a QR code for the shortened URL.

## License

This project is licensed under the MIT License. Feel free to modify and use it as you wish!