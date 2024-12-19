// form_script.js

// If one selects programming experience then show the bar to select the level of experience
function toggleExperienceLevel(show) {
    const experienceLevelDiv = document.getElementById("experienceLevel");
    experienceLevelDiv.style.display = show ? "block" : "none";
}

//Handles form submission
document.getElementById("demographicsForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents page reload

    const age = document.getElementById("age").value;
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const level = experience === "yes" ? document.getElementById("level").value : "none";
    const familiarity = document.querySelector('input[name="familiarity"]:checked').value;

    // Store demographics in localStorage or send to a backend server if needed
    localStorage.setItem("age", age);
    localStorage.setItem("experience", experience);
    localStorage.setItem("level", level);
    localStorage.setItem("familiarity", familiarity);

    // Redirect to the experiment page
    window.location.href = "experiment.html";
});
