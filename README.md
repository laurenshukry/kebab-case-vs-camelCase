# Experimentation and Evaluation: camelCase vs kebab-case

This project was developed as part of the Experimentation and Evaluation course. The goal of the project is to investigate whether reading composed identifiers in `camelCase` or `kebab-case` is faster for participants. This experiment collects demographic data, measures performance through task completion times, and analyzes the results.

## Introduction

Identifiers in code can be written in different styles such as `camelCase` or `kebab-case`. This project explores the hypothesis that one of these styles may be easier and faster to recognize under controlled conditions. The experiment simulates typical programming tasks where participants must select the correct identifier representation from distractors.

## Project Structure

```
project-directory/
├── index.html         # Main entry point for the experiment
├── demographics.html  # Page for collecting demographic data
├── experiment.js      # Core JavaScript logic for the experiment
├── styles.css         # Styling for the experiment
├── results/           # Folder for exported results (JSON/CSV)
├── README.md          # Documentation
```

## How to Run the Experiment

To conduct the experiment, follow these steps:

1. **Download and unzip** the project folder.
2. Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox).
3. Follow the instructions displayed on the pages:
   - **Home Page**: Read the short explanation of the experiment.
   - **Demographics Form**: Provide your age, programming experience, familiarity with identifier styles, etc.
   - **Experiment Page**: Complete 20 tasks where you select the correct identifier from a set of options.

   After completing all tasks, the experiment will automatically generate results files for download in JSON and CSV formats.

## Data Collection

### Inputs
Participants provide the following demographic data:
- Age
- Programming experience (Yes/No)
- Self-rated programming level (Beginner/Intermediate/Advanced)
- Familiarity with `camelCase` and `kebab-case` (Yes/No)

### Tasks
Participants complete 20 tasks, each requiring them to select the correct identifier style from four options. Identifiers are derived from simple sentences, such as `move south` or `write code`, and are presented in both `camelCase` and `kebab-case` styles.

### Outputs
Upon completion, the experiment generates two result files:
- **JSON File**: Contains detailed task results and participant metadata.
- **CSV File**: Provides a tabular summary of the results, including task number, sentence, selected identifier, correctness, and time taken.




