export class PromptPayload {
    response: string;
    retrievePreviousQuestion: boolean;
    clearResponse?: boolean;

    constructor(data: any) {
        this.response = data.response ?? '';
        this.retrievePreviousQuestion = data.retrievePreviousQuestion ?? false;
        this.clearResponse = data.clearResponse ?? false;
    }
}