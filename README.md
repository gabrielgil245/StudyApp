# StudyApp

A lightweight, browser-based study and quiz application built with **Angular 16.2.16** and styled using **Bootstrap 5.3.8**.
This app allows users to upload their own JSON-formatted quiz files and dynamically generate quizzes directly in the browser — no backend required.

This project is deployed to GitHub Pages using **angular-cli-ghpages v2.0.3**.

> **Note:** This repository is primarily a personal project and part of a growing portfolio, but contributions are still welcome.

---

## 🚀 Live Demo (GitHub Pages)

**URL:** [https://gabrielgil245.github.io/StudyApp/quiz-selection](https://gabrielgil245.github.io/StudyApp/quiz-selection)

---

## 📦 Dependencies

This project includes the following major frontend dependencies:

### **Core UI & Styling**

* **Bootstrap 5.3.8** — main UI framework
* **@popperjs/core 2.11.6** — required for Bootstrap tooltips, dropdowns, and popovers
* **@fortawesome/fontawesome-free 7.1.0** — icon library
* **@ng-bootstrap/ng-bootstrap 15.1.2** — Bootstrap components for Angular (modals, alerts, etc.)

### **Angular & Tooling**

* **Angular 16.2.16** — main application framework
* **Node.js 22.12.0** — JavaScript runtime required for Angular tooling
* **npm 10.9.0** — package manager used for installing project dependencies
* **angular-cli-ghpages 2.0.3** — deployment utility for GitHub Pages

---

## 🛠 Installation Instructions

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

## ▶ Running the Project Locally

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

## 🌐 Deploying to GitHub Pages

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

## 📂 JSON File Format

Your uploaded JSON file should follow this structure:

```json
{
  "questions": [
    {
      "id": "1",
      "prompt": "What is HTML5?",
      "options": [
        "A programming language",
        "A markup language for structuring and presenting content on the web",
        "A database management system",
        "A web server software"
      ],
      "answer": "A markup language for structuring and presenting content on the web",
      "category": "Technology",
      "difficulty": "Easy",
      "explanation": "HTML5 is the latest version of the Hypertext Markup Language used for structuring and presenting content on the web."
    }
  ]
}
```

---

## 📌 Project Purpose

This application was built:

* As a **personal tool** for studying and quiz generation
* To practice and demonstrate **Angular**, **Bootstrap**, and **frontend architecture**
* As part of a growing **portfolio of development projects**

While public, contributions are optional and not expected.