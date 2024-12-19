// Global variables
let startTime;
let correctIdentifier;
let results = []; // To store results for CSV export
const numTasks = 20; // Total number of tasks
let currentTask = 0;
let timerInterval; // Variable to store the interval ID for the timer

//For the expeirment we use 10 different identifiers
const sentences = [
    "move south", "jump high", "read book", "play game",
    "open door", "close window", "run fast", "write code",
    "test function", "debug issue"
];
const styles = ["camelCase", "kebab-case"];

// We have to ensure that each identifier si showed once in kebab-case and once in cameCase
let tasks = sentences.flatMap(sentence => [
    { sentence, style: "camelCase" },
    { sentence, style: "kebab-case" }
]);

// We want ot make sure that the two representations of the same identifier are spaced between each other
const spacedTasks = [];
const halfLength = tasks.length / 2;
for (let i = 0; i < halfLength; i++) {
    spacedTasks.push(tasks[i]);
    spacedTasks.push(tasks[i + halfLength]);
}

// Shuffle tasks
tasks = spacedTasks.sort(() => Math.random() - 0.5);

// Data about the user
const demographics = {
    age: localStorage.getItem("age"),
    experience: localStorage.getItem("experience"),
    level: localStorage.getItem("level"),
    familiarity: localStorage.getItem("familiarity")
};

function generateIdentifiers(sentence, style) {
    const words = sentence.split(" ");

    // Generate the correct identifier
    const correct = style === "camelCase"
        ? words[0] + words[1][0].toUpperCase() + words[1].slice(1)
        : words.join("-");

    const distractors = new Set();

    // generate distracotrs
    while (distractors.size < 3) {
        let distractor = correct;

        if (style === "camelCase") {
            // Change one letter
            const randomIndex = Math.floor(Math.random() * distractor.length);
            const char = distractor[randomIndex];
            distractor = distractor.replace(char, String.fromCharCode(char.charCodeAt(0) + 1));
        } else if (style === "kebab-case") {
            // change one letter but keep dashes
            const parts = correct.split("-");
            const randomWord = Math.floor(Math.random() * parts.length);
            const word = parts[randomWord];
            const randomIndex = Math.floor(Math.random() * word.length);
            const char = word[randomIndex];
            parts[randomWord] = word.replace(char, String.fromCharCode(char.charCodeAt(0) + 1));
            distractor = parts.join("-");
        }

        //The followoing condition is just make sure that the separator has not been changed
        if (distractor !== correct && /^[a-zA-Z\-]+$/.test(distractor)) {
            distractors.add(distractor);
        }
    }

    return { correct, distractors: Array.from(distractors) };
}

function startTask() {
    if (currentTask >= numTasks) {
        endExperiment();
        return;
    }

    document.getElementById("choices").innerHTML = "";
    document.getElementById("submitBtn").disabled = true;

    const { sentence, style } = tasks[currentTask];
    const { correct, distractors } = generateIdentifiers(sentence, style);

    correctIdentifier = correct;

    document.getElementById("sentence").textContent = sentence;

    //display identifiers
    const identifiers = [...distractors, correct].sort(() => Math.random() - 0.5);
    const choicesDiv = document.getElementById("choices");

    identifiers.forEach((identifier) => {
        const btn = document.createElement("button");
        btn.textContent = identifier;
        btn.className = "choice-button";
        btn.onclick = () => {
            document.querySelectorAll("#choices button").forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
            document.getElementById("submitBtn").disabled = false;
        };
        choicesDiv.appendChild(btn);
    });

    startTime = new Date();
}

//update elapsed time every second
timerInterval = setInterval(() => {
    if (startTime) {
        const elapsedTime = ((new Date() - startTime) / 1000).toFixed(2);
        document.getElementById("timeElapsed").textContent = elapsedTime;
    }
}, 100);

function endExperiment() {
    alert("Experiment completed! Thank you for participating.");
    clearInterval(timerInterval);
    downloadJSON();
    downloadCSV();
}

// Record response and proceed
document.getElementById("submitBtn").onclick = () => {
    const selected = document.querySelector("#choices .selected")?.textContent;
    const isCorrect = selected === correctIdentifier;
    const timeTaken = (new Date() - startTime) / 1000;

    //store result
    results.push({
        task: currentTask + 1,
        sentence: document.getElementById("sentence").textContent,
        selected,
        correct: correctIdentifier,
        isCorrect,
        timeTaken
    });

    currentTask++;

    startTask();
};

function downloadJSON() {
    const data = {
        tasks: results,
        demographics,
        metadata: {
            totalTasks: results.length,
            completedOn: new Date().toISOString()
        }
    };

    const jsonContent = JSON.stringify(data, null, 2); // Pretty print with indentation
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experiment_results.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Download results as CSV with metadata at the top
function downloadCSV() {
    const metadata = [
        ["Age", demographics.age],
        ["Experience", demographics.experience],
        ["Programming Level", demographics.level],
        ["Familiarity with camelCase/kebab-case", demographics.familiarity],
    ]
        .map(row => row.join(": "))
        .join("\n");

    const taskHeader = ["Task", "Sentence", "Selected Identifier", "Correct Identifier", "Is Correct", "Time Taken"];
    const taskRows = results.map(r => [
        r.task, r.sentence, r.selected, r.correct, r.isCorrect, r.timeTaken,
    ]);

    const csvContent = [
        metadata, // Add metadata at the top
        "", // Empty line for separation
        taskHeader.join(","), // Task header
        ...taskRows.map(row => row.join(",")), // Task data
    ].join("\n");

    // Create and download the CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experiment_results.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// Start the experiment on page load
window.onload = startTask;
