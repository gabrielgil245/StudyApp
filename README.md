# StudyApp

A lightweight, browser-based study and quiz application built with **Angular 16.2.16** and styled using **Bootstrap 5.3.8**.
This app allows users to upload their own JSON-formatted quiz files and dynamically generate quizzes directly in the browser — no backend required.

This project is deployed to GitHub Pages using **angular-cli-ghpages v2.0.3**.

> **Note:** This repository is primarily a personal project and part of a growing portfolio, but contributions are still welcome.

---

## Live Demo (GitHub Pages)

**URL:** [https://gabrielgil245.github.io/StudyApp/quiz-selection](https://gabrielgil245.github.io/StudyApp/quiz-selection)

---

## Features

### Quiz Workflow
- **Single-page application with three lazy-loaded views:**
  - **Quiz Selection:** upload and manage one or more JSON quiz files
  - **Quiz:** answer multiple-choice or true/false questions with navigation and timing
  - **Results:** review answers, explanations, and final score
- Automatic routing between stages based on quiz state
- Ability to end a quiz early without refreshing the page
- Supports code-based multiple-choice questions with formatted code blocks

---

### Flexible Quiz Input
- Upload **one or multiple JSON files** at once
- Automatically merges questions from multiple files into a single quiz
- Displays selected files prior to quiz start
- Remove individual files (and their questions) before starting the quiz

---

### Enhanced Navigation
- Dedicated **question navigation component** for quick question access
- Navigation reused across both Quiz and Results views
- Forward/back controls supplemented by direct question selection
- Scroll-to-top button on results page for improved usability

---

### Timer & Challenge Mode
- Countdown timer to increase quiz difficulty
- Customizable quiz duration with configurable minimum and maximum values:
  - Minimum: 5 minutes
  - Maximum: 120 minutes (2 hours)
- Automatic quiz submission when time expires
- Time displayed in `hh:mm:ss` format
- Timer automatically starts when a quiz becomes active
- Automatic quiz submission when time expires

---

### User Feedback & Review
- Color-coded question prompts indicating correct vs incorrect answers in Results view
- Shared prompt component reused in Quiz and Results views
- Modal confirmation when attempting to finish with unanswered questions
- Option to review unanswered questions before submitting
- Detailed results view including explanations

---

### UI & UX Enhancements
- Responsive layout styled with Bootstrap
- Reusable shared components for consistent UI
- Modal dialogs for confirmations and warnings
- Clean visual separation between quiz states
- Lightweight SVG icons served locally to reduce bundle size

---

### Architecture & Design
- Each primary page (Quiz Selection, Quiz, Results) is **lazy-loaded**
- Ensures only required components are loaded per route
- Reduces initial bundle size and improves performance
- Prevents unnecessary coupling between feature components

---

### State Management & Core Components

- A persistent **header component** acts as a core UI element and remains visible across routes
- Quiz state is communicated using BehaviorSubjects and subscriptions
- Enables:
  - Conditional display of the timer
  - Visibility of the “End Quiz” action
  - Centralized control of quiz activity status
- Avoids tight coupling between feature modules

---

### Modular Angular Design

- Feature modules for each major view
- SharedModule for reusable components and common capabilities
- Clear separation between core, shared, and feature-specific logic
- Fully browser-based — no backend required

---

## Dependencies

This project includes the following major frontend dependencies:

### **Core UI & Styling**

* **Bootstrap 5.3.8** — main UI framework
* **@popperjs/core 2.11.6** — required for Bootstrap tooltips, dropdowns, and popovers
* **@ng-bootstrap/ng-bootstrap 15.1.2** — Bootstrap components for Angular (modals, alerts, etc.)

### **Angular & Tooling**

* **Angular 16.2.16** — main application framework
* **Node.js 22.12.0** — JavaScript runtime required for Angular tooling
* **npm 10.9.0** — package manager used for installing project dependencies
* **angular-cli-ghpages 2.0.3** — deployment utility for GitHub Pages

### Icons
- SVG icons sourced from Font Awesome Free and included as local assets to reduce bundle size and external dependencies.

---

## Testing

This project includes unit tests written with **Jasmine** and **Karma**.
The focus of testing was to validate core business logic, component behavior, and edge cases.

### Coverage Summary

- Statements : 100% (340 / 340)
- Branches : 94.53% (121 / 128)
- Functions : 100% (93 / 93)
- Lines : 100% (310 / 310)

### Notes on Coverage


### Notes on Coverage

- **100% coverage** achieved for statements, functions, and lines
- Branch coverage remains slightly below 100% due to intentionally untested defensive branches and unreachable edge cases
- Models and simple data structures are tested where meaningful behavior exists
- Asynchronous logic (timers, file uploads, subscriptions) is covered using controlled mocks and spies

### Running Tests

```bash
ng test
```

### Generating Coverage Report

```bash
ng test --code-coverage
```

The coverage report is generated in the `/coverage` directory can be viewed by opening `index.html` in a browser.

---

## Installation Instructions

To install and run the project locally:

### **1. Clone the repository**

```bash
git clone https://github.com/gabrielgil245/StudyApp.git
cd StudyApp
```

### **2. Install dependencies**

Make sure you have Node.js, npm, and Angular CLI installed.

Then run:

```bash
npm install
```

This installs all required dependencies listed in `package.json`.

---

## Running the Project Locally

To start the local development server:

```bash
ng serve
```

Then open a browser and navigate to:

```
http://localhost:4200/
```

The app will automatically reload when you save code changes.

---

## Deploying to GitHub Pages

This project includes an npm script that builds and deploys the application with a single command.

### **Custom Deploy Script**

In `package.json`, you may have something like:

```json
"scripts": {
  "deploy-study-app": "ng build --configuration production && ng deploy --base-href=/StudyApp/ --dir=dist/study-app/browser"
}
```

### **How It Works**

* **ng build --configuration production**
  Generates an optimized production build under:
  `dist/study-app/browser`

* **ng deploy**
  Uses `angular-cli-ghpages` to publish the build to GitHub Pages (`gh-pages` branch`).

### **To deploy:**

```bash
npm run deploy-study-app
```

After ~1–2 minutes, GitHub Pages will update the live site.

---

## JSON File Format

Your uploaded JSON file should follow this structure:

```json
{
  "questions": [
    {
      "id": "1",
      "prompt": "What is HTML5?",
      "code": "",
      "options": [
        "A programming language",
        "A markup language for structuring and presenting content on the web",
        "A database management system",
        "A web server software"
      ],
      "answer": "A markup language for structuring and presenting content on the web",
      "category": "Technology",
      "difficulty": "Easy",
      "explanation": "HTML5 is the latest version of the Hypertext Markup Language used for structuring and presenting content on the web.",
      "response": ""
    }
  ]
}
```

---

## Project Purpose

This application was built:

* As a personal study tool for repeated self-assessment
* To explore Angular routing, state management, and modular design
* To demonstrate real-world frontend architecture decisions
* As a polished portfolio project, not a tutorial exercise

While public, contributions are optional and not expected.