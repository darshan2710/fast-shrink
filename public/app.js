document.getElementById("shortenBtn").addEventListener("click", async () => {
    const longUrl = document.getElementById("longUrl").value.trim();
    if (!longUrl) {
        alert("Please enter a URL to shorten!");
        return;
    }

    // This is the new part that calls your backend API
    try {
        const response = await fetch('https://fast-shrink.onrender.com/api/shorten', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                originalUrl : longUrl
            })
        });

        if (!response.ok) {
            // If the server sends back an error, display it
            const errorData = await response.json();
            throw new Error(errorData.error || 'Something went wrong');
        }

        const data = await response.json();

        // --- Update the page with the real data from the server ---

        // Show the result box
        document.getElementById("result").classList.remove("hidden");

        // Update the short URL link
        const shortUrlElem = document.getElementById("shortUrl");
        shortUrlElem.href = data.shortUrl;
        shortUrlElem.innerText = data.shortUrl.replace(/^https?:\/\//, ''); // Display without http://

        // Set the QR code image source from the server's response
        // IMPORTANT: Make sure you have an <img id="qrImage"> tag in your HTML!
        const qrImageElem = document.getElementById("qrImage");
        qrImageElem.src = data.qrCode;

        // Hide the QR code box until the user clicks the button
        document.getElementById("qrBox").classList.add("hidden");

    } catch (error) {
        console.error("Failed to shorten URL:", error);
        alert(`Error: ${error.message}`);
    }
});

// This function is correct and needs no changes
document.getElementById("copyBtn").addEventListener("click", () => {
    const shortUrl = document.getElementById("shortUrl").href; // Copy the full URL
    navigator.clipboard.writeText(shortUrl).then(() => {
        showToast();
    });
});

// This function is now simpler, as it just shows the pre-loaded QR code
document.getElementById("qrBtn").addEventListener("click", () => {
    document.getElementById("qrBox").classList.toggle("hidden"); // Toggle visibility
});

// This function is correct and needs no changes
function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}