export class Question {
    id: string;
    prompt: string;
    code: string;
    options: string[];
    answer: string;
    category: string;
    difficulty: string;
    explanation: string;
    response: string;

    constructor(data: any) {
        this.id = data.id ?? '';
        this.prompt = data.prompt ?? '';
        this.code = data.code ?? '';
        this.options = data.options ?? [];
        this.answer = data.answer ?? '';
        this.category = data.category ?? '';
        this.difficulty = data.difficulty ?? '';
        this.explanation = data.explanation ?? '';
        this.response = data.response ?? '';
    }
}