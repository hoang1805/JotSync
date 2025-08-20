export default class AnswerDto {
  constructor(name, type, text, answer, prettyFormat) {
    this.name = name;
    this.type = type;
    this.text = text;
    this.answer = answer;
    this.prettyFormat = prettyFormat;
  }

  static fromJotform(data) {
    return new AnswerDto(
      data.name,
      data.type,
      data.text,
      data.answer || null,
      data.prettyFormat || null
    );
  }

  release() {
    if (!this.answer && !this.prettyFormat) {
      return null;
    }

    return {
        name: this.name,
        value: this.prettyFormat || this.answer,
        raw: this.answer,
    }
  }
}