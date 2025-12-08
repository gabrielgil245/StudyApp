import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/modules/core/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss']
})
export class QuizSelectionComponent {
  errorMessage: string = '';

  constructor(private quizService: QuizService, private router: Router) {
    this.quizService.setQuestions([]); // Clear any existing quiz data on component initialization
    this.quizService.setIsQuizActive(false);
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files?.length) {
      return;
    }

    this.errorMessage = '';
    const file = input.files[0],
      reader = new FileReader();
    reader.readAsText(file); // Read the selected file as text so that we can parse it as JSON later
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.questions || !Array.isArray(data.questions)) {
          this.errorMessage = 'Invalid quiz format: "questions" property is missing or is not an array.';
          return;
        }
        this.quizService.setQuestions(data.questions);
        this.router.navigate(['/quiz']);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        this.errorMessage = 'Error parsing JSON file. Please upload a valid JSON file.';
      }
    };
  }
}
