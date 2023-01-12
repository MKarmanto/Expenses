const app = require("./app");

/**
 * @description Start the server.
 * If the PORT environment variable is not set, default to port 5000.
 * Log a message to the console to let us know the server has started.
 * If there is an error, log the error to the console.
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
