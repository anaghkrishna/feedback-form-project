document.getElementById("feedbackForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const course = document.getElementById("course").value;
    const department = document.getElementById("department").value;
    const faculty = document.getElementById("faculty").value;
    const rating = document.getElementById("rating").value;
    const message = document.getElementById("message").value;

    // Use the URL from your latest Render dashboard screenshot
    fetch("https://feedback-form-project-bmid.onrender.com/api/feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            course,
            department,
            faculty,
            rating,
            message
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.text();
    })
    .then(data => {
        alert("Feedback saved successfully ✅");
        document.getElementById("feedbackForm").reset();
    })
    .catch(err => {
        console.error(err);
        alert("Error sending data ❌");
    });
});