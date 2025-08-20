import AnswerDto from "./answer.dto.js";

export default class SubmissionDto {
   constructor(id, formId, answers) {
    this.id = id;
    this.formId = formId;
    this.answers = answers; 
  }

  static fromJotform(data) {
    const rawAnswers = data.answers || {};
    const answers = [];
    for (const [_, value] of Object.entries(rawAnswers)) {
      answers.push(AnswerDto.fromJotform(value));
    }

    return new SubmissionDto(
        data.id,
        data.form_id,
        answers,
    );
  }

  release() {
    const answers = this.answers.map(answer => answer.release())
                        .filter(answer => answer != null)
                        .reduce((acc, answer) => {
                            acc[answer.name] = {value: answer.value, raw: answer.raw};
                            return acc;
                        }, {});
    return {
      id: this.id,
      formId: this.formId,
      answers: answers
    };
  }
}