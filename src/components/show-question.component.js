import{ Component } from "react";
import QuestionDataService from "../services/question.service.js"

const msg = require("../config/msg.config");
const sys = require("../config/sys.config");

export default class ShowQuestion extends Component {
  constructor(props) {
    super(props);
    // clone the question received from the questions list into a state object
    // preserve the received question for form reset
    this.state = Object.assign({}, props.question);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.onChangeQuestionText = this.onChangeQuestionText.bind(this);
    this.onChangeQuestionCategory = this.onChangeQuestionCategory.bind(this);
    this.onChangeNumAnswers = this.onChangeNumAnswers.bind(this);
    this.onChangeNumCorrectAnswers = this.onChangeNumCorrectAnswers.bind(this);
    this.onChangeQuestionDifficulty = this.onChangeQuestionDifficulty.bind(this);
    this.onChangeQuestionComment = this.onChangeQuestionComment.bind(this);  
    this.onChangeCorrectAnswer = this.onChangeCorrectAnswer.bind(this);
    this.onChangeIncorrectAnswer = this.onChangeIncorrectAnswer.bind(this); 
    this.close = this.close.bind(this);
  }

  handleFormSubmit (e) {
    e.preventDefault();

    if (e.target.checkValidity()) {
      this.saveQuestion(this.state);
    } 
    e.target.classList.add('was-validated');
  }

  resetForm() {
    this.setState({
      question: Object.assign({}, this.props.question.question),
      answers: Object.assign({}, this.props.question.answers)
    });
    this.form.reset();
    this.form.classList.remove('was-validated');
    for (let name in this.form.controls) {
      this.form.controls(name).setErrors(null);
    }
  }

  saveQuestion() {
    const data = this.state;
    QuestionDataService.update(data.question.id, data)
      .then(response => {
        window.alert(response.data.message);
        this.props.updateQuestionToList(data);
        
      })
      .catch(e => {
        window.alert("Greska: " + e.response.data.message);
      });
  }

  close() {
    this.props.closeMe(this.state);
  }

  onChangeQuestionCategory(e) {
    if (e.target.value) {
      const newQuestion = this.state.question;
      newQuestion.questionCategoryId = e.target.value;
      this.setState( {
        question: newQuestion
      })
    }
  }

  onChangeQuestionDifficulty(e) {
    if (e.target.value) {
      const newQuestion = this.state.question;
      newQuestion.difficultyLevelId = e.target.value;
      this.setState( {
        question: newQuestion
      })
    }
  }

  onChangeQuestionText(e) {
    if (e.target.value) {
      const newQuestion = this.state.question;
      newQuestion.question = e.target.value;
      this.setState( {
        question: newQuestion
      })
    }
  }

  onChangeQuestionComment(e) {
    if (e.target.value) {
      const newQuestion = this.state.question;
      newQuestion.comment = e.target.value;
      this.setState( {
        question: newQuestion
      })
    }
  }

  onChangeNumAnswers(e) {
    if (e.target.value) {
      const value = parseInt(e.target.value);
      const newQuestion = this.state.question;
      newQuestion.numberOfAnswers = value;
      newQuestion.numCorrectAnswers = 1;
      this.setState( {
        question: newQuestion,
        answers: [],
      })
    }
  }

  onChangeNumCorrectAnswers(e) {
    if (e.target.value) {  
      const newQuestion = this.state.question;
      newQuestion.numCorrectAnswers = parseInt(e.target.value);
      this.setState( {
        question: newQuestion
      })
  }
}

  onChangeCorrectAnswer(e) {
    if (e.target.value) {
      let newAnswers = this.state.answers;
      let ansIndex;
      switch (e.target.id) {
       case "inputCorrectAnswer1" :
          ansIndex = 1;
          break
       case "inputCorrectAnswer2" :
          ansIndex = 2;
          break
       default:
      };
      newAnswers[ansIndex- 1] = {
        id: newAnswers[ansIndex- 1].id,
        localId: ansIndex,
        answer: e.target.value,
        correct: true
      };
      this.setState( {
        answers: newAnswers
      })
    }
  }

  onChangeIncorrectAnswer(e) {
    if (e.target.value) {
      let newAnswers = this.state.answers;
      let ansIndex;
      switch (e.target.id) {
       case "inputIncorrectAnswer1" :
          ansIndex = this.state.question.numCorrectAnswers + 1;
          break
       case "inputIncorrectAnswer2" :
          ansIndex =  this.state.question.numCorrectAnswers + 2;
          break
       case "inputIncorrectAnswer3" :
          ansIndex = 4;
          break
       default:
      }
      newAnswers[ansIndex - 1] = {
        id: newAnswers[ansIndex- 1].id,
        localId: ansIndex,
        answer: e.target.value,
        correct: false
      };
      this.setState( {
        answers: newAnswers
      })
    }
  }

  render () {
    const { numberOfAnswers, numCorrectAnswers} = this.state.question;
    const numIncorrectAnswers = numberOfAnswers - numCorrectAnswers;
    return (
      <div>
        
        {/*form to add new question*/}
        <form className="form-add-question form-group row border my-2 py-2" 
          id="form"
          noValidate onSubmit={this.handleFormSubmit}
          ref={e => this.form = e}
        >

          <h5>{msg.MSG_NEW_QUESTION}</h5>
          <div className="form-group col-md-6 mb-2">
          
            <label htmlFor="inputSelectQuestionCategory">{msg.MSG_QUESTION_CATEGORY}</label>
            <select className="form-select required" 
              id={"inputSelectQuestionCategory"}
              defaultValue={this.state.question.questionCategoryId}
              required
              disabled={this.props.question} //category can only be set for a new question 
              onChange={this.onChangeQuestionCategory}
            >
              <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE}</option>
              {[...Array(sys.NO_QUESTION_CATEGORIES).keys()].map(idx =>
              (
                  <option key={`${idx+1}`} value={`${idx+1}`}>{msg[`MSG_QUESTION_CATEGORY_${idx+1}`]}</option>
              )
              )}
            </select>
            <div className="invalid-feedback">
                {msg.MSG_INVALID_QUESTION_TYPE}
            </div>
          </div>

          <div className="form-group col-md-6 mb-2">
          
          <label htmlFor="inputSelectQuestionDifficulty">{msg.MSG_DIFFICULTY_LEVEL}</label>
          <select className="form-select required" 
            id={"inputSelectQuestionDifficulty"}
            defaultValue={this.state.question.difficultyLevelId}
            required
            onChange={this.onChangeQuestionDifficulty}
        >
            <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE}</option>
            {[...Array(msg.MSG_NO_DIFFICULTY_LEVELS).keys()].map(idx =>
            (
                <option key={`${idx+1}`} value={`${idx+1}`}>{msg[`MSG_DIFFICULTY_LEVEL_${idx+1}`]}</option>
            )
            )}
          </select>
          <div className="invalid-feedback">
              {msg.MSG_INVALID_DIFFICULTY_LEVEL}
          </div>
        </div>

        <div className="form-group col-md-12 mb-2">
            <label htmlFor="questionTextarea">{msg.MSG_QUESTION}</label>
            <textarea className="form-control required" id="questionTextarea" rows="1"
              placeholder={msg.MSG_ENTER_QUESTION_NO_QUESTION_MARK}
              defaultValue={this.state.question.question}
              required
              onChange={this.onChangeQuestionText}
            ></textarea>
            <div className="invalid-feedback">
              {msg.MSG_ENTER_QUESTION}
          </div>
        </div>

          <div className="form-group col-md-12 mb-2">
            <label htmlFor="commentTextarea">{msg.MSG_COMMENT}</label>
            <textarea className="form-control" id="commentTextarea" rows="1"
              placeholder={msg.MSG_OPTIONAL}
              defaultValue={this.state.question.comment}
              onChange={this.onChangeQuestionComment}
            ></textarea>
          </div>

          <div className="form-group col-md-6 mb-2">
          
            <label htmlFor="inputSelectnumAnswers">{msg.MSG_NO_ANSWERS}</label>
            <select className="form-select required" 
              id={"inputSelectnumAnswers"}
              defaultValue={numberOfAnswers}
              disabled={this.props.question} 
            >
                <option key={"numAnswers0"} value={""} disabled>{msg.MSG_CHOOSE}</option>
                <option key={"numAnswers1"} value={2}>2</option>
                <option key={"numAnswers2"} value={4}>4</option>
            </select>
            <div className="invalid-feedback">
                {msg.MSG_INVALID_NO_ANSWERS}
            </div>
          </div>

          {(numberOfAnswers === 4) ? (
            <div className="form-group col-md-6 mb-2">
            
              <label htmlFor="inputSelectCorrectAnswers">{msg.MSG_NO_CORRECT_ANSWERS}</label>
              <select className="form-select required" 
                id={"inputSelectCorrectAnswers"}
                defaultValue = {numCorrectAnswers || 1}
                required
                disabled
              >
                <option key={"numCorrectAnswers1"} value={1}>1</option>
                <option key={"numCorrectAnswers2"} value={2}>2</option>
              </select>

            
            </div>
          ) : (null)}

          {/* form to add answers to the new question. It shows if the number 
              of answers is set */}
          { numCorrectAnswers ? (
            <div className="form-add-answers row">

                {/* add correct answer(s)*/}
              <div className="form-group col-md-6 border my-2">
                <h5>{msg.MSG_CORRECT_ANSWERS}</h5>

                {/* add first correct answer */}
                <div>
                  <div className="form-group">
                    <label htmlFor={`inputCorrectAnswer1`}>{msg.MSG_CORRECT_ANSWER + " 1"}</label>
                    <textarea className="form-control required" id={`inputCorrectAnswer1`} 
                      placeholder={msg.MSG_ENTER_ANSWER} 
                      defaultValue={this.state.answers[0] ? this.state.answers[0].answer : ""}
                      onChange={this.onChangeCorrectAnswer}
                      rows="1"
                      required
                    />
                  </div>
                  <div className="invalid-feedback">
                      {msg.MSG_ENTER_ANSWER}
                  </div>
                </div>

                {/* add optional second correct answer */}
                {(numCorrectAnswers === 2) ? (
                  <div>
                    <div className="form-group">
                      <label htmlFor={`inputCorrectAnswer2`}>{msg.MSG_CORRECT_ANSWER + " 2"}</label>
                      <textarea className="form-control required" id={`inputCorrectAnswer2`} 
                        placeholder={msg.MSG_ENTER_ANSWER} 
                        onChange={this.onChangeCorrectAnswer}
                        defaultValue={this.state.answers[1] ? this.state.answers[1].answer : ""}
                        rows="1"
                        required
                      />
                    </div>
                    <div className="invalid-feedback">
                        {msg.MSG_ENTER_ANSWER}
                    </div>
                  </div>
                  ) : (null)
                }                      

              </div>

              {/* add incorrect answer(s)*/}

                <div className="form-group col-md-6 border my-2">
                  <h5>{msg.MSG_INCORRECT_ANSWERS}</h5>

                  {/* add first incorrect answer */}
                    <div>
                      <div className="form-group">
                        <label key={`labelIncorrect1`} htmlFor={`inputIncorrectAnswer1`}>{msg.MSG_INCORRECT_ANSWER} {1}</label>
                        <textarea key={`inputIncorrect1`} className="form-control required" id={`inputIncorrectAnswer1`} 
                          placeholder={msg.MSG_ENTER_ANSWER} 
                          defaultValue={this.state.answers[numCorrectAnswers] ? this.state.answers[numCorrectAnswers].answer : ""}
                          onChange={this.onChangeIncorrectAnswer}
                          rows="1"
                          required
                        />
                      </div>
                      <div className="invalid-feedback">
                          {msg.MSG_ENTER_ANSWER}
                      </div>
                    </div>

                    {/* add other incorrect answers */}
                    {(numIncorrectAnswers >= 2) ? (
                      <div>
                        <div className="form-group">
                          <label htmlFor={`inputIncorrectAnswer2`}>{msg.MSG_INCORRECT_ANSWER} {2}</label>
                          <textarea className="form-control required" id={`inputIncorrectAnswer2`} 
                            placeholder={msg.MSG_ENTER_ANSWER} 
                            defaultValue={this.state.answers[numCorrectAnswers+1] ? this.state.answers[numCorrectAnswers+1].answer : ""}
                            onChange={this.onChangeIncorrectAnswer}
                            rows="1"
                            required
                          />
                        </div>
                        <div className="invalid-feedback">
                            {msg.MSG_ENTER_ANSWER}
                        </div>
                      </div>
                  ) : (null)}

                  {(numIncorrectAnswers === 3) ? (
                    <div>
                      <div className="form-group">
                        <label htmlFor={`inputIncorrectAnswer3`}>{msg.MSG_INCORRECT_ANSWER} {3}</label>
                        <textarea className="form-control required" id={`inputIncorrectAnswer3`} 
                          placeholder={msg.MSG_ENTER_ANSWER} 
                          defaultValue={this.state.answers[3] ? this.state.answers[3].answer : ""}
                          onChange={this.onChangeIncorrectAnswer}
                          rows="1"
                          required
                        />
                      </div>
                      <div className="invalid-feedback">
                          {msg.MSG_ENTER_ANSWER}
                      </div>
                    </div>
                  ) : (null)}

                </div>

                
            </div>
            ) : (null)}
            <div className="row">
              <div className="col-md-12 my-2 py-2">
                    <button type="submit"
                            className="btn btn-primary">{msg.MSG_SAVE}
                    </button>
                    <button type="button"
                      className="btn btn-secondary btn-cancel"
                      onClick={this.close}>{msg.MSG_CLOSE}
                    </button>
                    <button type="button"
                            className="btn btn-warning btn-reset"
                            onClick={this.resetForm}>{msg.MSG_RESET}
                    </button>
              </div>
            </div>
            

        </form>                  
      </div>                                            
    )
  } 
}