import SubmissionDto from "./submission.dto.js";

export default class SubmissionResponse {
    constructor(code, message, submission) {
        this.code = code;
        this.message = message;
        this.submission = submission; 
    }

    static fromJotform(data) {
        const submission = data.content ? SubmissionDto.fromJotform(data.content) : null;
        return new SubmissionResponse(
            data.responseCode,
            data.message,  
            submission,
        );
    }
}