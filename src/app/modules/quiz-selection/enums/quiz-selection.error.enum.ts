export enum QuizSelectionError {
    INVALID_FILE_TYPE = 'Invalid file type. Please upload a JSON file.',
    FILE_ALREADY_UPLOADED = 'This file has already been uploaded.',
    JSON_PARSE_ERROR = 'Error parsing JSON file. Please upload a valid JSON file.',
    INVALID_QUIZ_FORMAT_MISSING_QUESTIONS = 'Invalid quiz format: "questions" property is missing or is not an array.',
    QUIZ_CONTAINS_NO_QUESTIONS = 'The quiz file contains no questions.',
    INVALID_QUIZ_FORMAT_MISSING_PROPERTIES = 'Invalid quiz format: Each question must have "prompt", "options", and "answer" properties.',
    INVALID_QUIZ_FORMAT_INSUFFICIENT_OPTIONS = 'Invalid quiz format: Each question must have at least two options.',
    INVALID_QUIZ_FORMAT_ANSWER_NOT_IN_OPTIONS = 'Invalid quiz format: Each question\'s answer must be one of its options.',
    EXCEEDS_QUESTION_LIMIT = 'Cannot add any more questions: Total number of questions exceeds the limit of ',
    MAX_QUESTIONS_REACHED = 'Cannot add any more questions: Max number of questions has been reached.'
}