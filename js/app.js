// Create the XMLHttpRequest object.
const xhr = new XMLHttpRequest();
// Initialize the request
xhr.open("GET", 'http://127.0.0.1:5500/test/data.json');
// Send the request
xhr.send();
// Fired once the request completes successfully 
xhr.onload = function(e) {
    // Check if the request was a success
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        // Get and convert the responseText into JSON
        var response = JSON.parse(xhr.responseText);
        console.log(response);
    }
}