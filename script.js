document.getElementById("feedbackForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value,
        department: document.getElementById("department").value,
        faculty: document.getElementById("faculty").value,
        rating: document.getElementById("rating").value,
        message: document.getElementById("message").value
    };

    // Updated to your current live service URL
    fetch("https://feedback-form-project-bmid.onrender.com/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return text;
    })
    .then(data => {
        alert("Feedback saved successfully ✅");
        document.getElementById("feedbackForm").reset();
    })
    .catch(err => {
        console.error("Submission Error:", err);
        alert("Error: " + err.message); // This will now show the actual error on your screen
    });
});