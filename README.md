# StudyApp

A lightweight, browser-based study and quiz application built with **Angular 16.2.16** and styled using **Bootstrap 5.3.8**.  
This app allows users to upload their own JSON-formatted quiz files and dynamically generate quizzes directly in the browser — no backend required.

This project is deployed to GitHub Pages using **angular-cli-ghpages v2.0.3**.

---

## 🚀 Live Demo (GitHub Pages)

**URL:** https://gabrielgil245.github.io/StudyApp/quiz-selection

---

## 📌 Features

- 📁 **Upload your own quiz via JSON file**
- 📝 **Dynamic quiz generation**
- 📊 **Results page with score summary**
- 🎨 **Bootstrap-based responsive UI**
- 🧭 **Three-page workflow:**
  - **Quiz Selection (Landing Page):** user uploads a JSON quiz
  - **Quiz Page:** displays questions one by one with multiple-choice answers
  - **Results Page:** shows score, correct answers, and explanations

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
