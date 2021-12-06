import{ Component } from "react";
import AuthService from "../services/auth.service";

//import BookDataService from "../services/book.service";
const msg = require("../config/msg.config");

export default class ShowQuestions extends Component {
  constructor(props) {
      super(props);
      this.state = {
          book : this.props.book,
          userId: AuthService.getCurrentUser().id,
          //questions is a list of question objects, each object containing a list of answers
          questions: [],
          newQuestionNumAnswers: null,
          newQuestionNumCorrectAnswers: null,
          newQuestionNumIncorrectAnswers: null,
          newQuestionType: null,
          newQuestionText: "",
          newQuestionComment: "",
          newQuestionDifficulty: null,
          currentListedQuestion: null,
          currentListedQuestionIndex: -1,
          answers: []
      }

      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.setActiveQuestion = this.setActiveQuestion.bind(this);
      this.onChangeQuestionText = this.onChangeQuestionText.bind(this);
      this.onChangeQuestionType = this.onChangeQuestionType.bind(this);
      this.onChangeNumAnswers = this.onChangeNumAnswers.bind(this);
      this.onChangeNumCorrectAnswers = this.onChangeNumCorrectAnswers.bind(this);
      this.onChangeQuestionDifficulty = this.onChangeQuestionDifficulty.bind(this);
      this.onChangeQuestionComment = this.onChangeQuestionComment.bind(this);  
      this.onChangeAnswer = this.onChangeAnswer.bind(this);  
    }

  handleFormSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      this.saveQuestion();
      this.resetFrom();
      
    }
    e.target.classList.add('was-validated');
  }

  saveQuestion() {
    const newQuestion = {
      bookId: this.props.id,
      userId: this.state.userId,
      numAnswers: this.state.newQuestionNumAnswers,
      numCorrectAnswers: this.state.newQuestionNumCorrectAnswers,
      numIncorrectAnswers: this.state.newQuestionNumIncorrectAnswers,
      categoryId: this.state.newQuestionType,
      question: this.state.newQuestionText,
      comment: this.state.newQuestionComment,
      difficultyLevelId: this.state.newQuestionDifficulty,
      approved: false,
      answers: [],
    }

    let questions = this.state.questions;
    questions.push(newQuestion);

    this.setState({
      questions: questions     
    })
  }

  resetFrom() {
    this.setState({
      newQuestionNumAnswers: null,
      newQuestionNumCorrectAnswers: null,
      newQuestionNumIncorrectAnswers: null,
      newQuestionType: null,
      newQuestionComment: "",
      newQuestionText: "",
      newQuestionDifficulty: null
})
    this.form.reset();

    
  }

  setActiveQuestion(question, index) {
    this.setState({
      currentListedQuestion: question,
      currentListedQuestionIndex: index
    });
  }

  onChangeQuestionType(e) {
    if (e.target.value) {
      this.setState({
        newQuestionType: e.target.value
      })
    }
  }

  onChangeQuestionText(e) {
    if (e.target.value) {
      this.setState({
        newQuestionText: e.target.value
      })
    }
  }

  onChangeQuestionComment(e) {
    if (e.target.value) {
      this.setState({
        newQuestionComment: e.target.value
      })
    }
  }

  onChangeQuestionDifficulty(e) {
    if (e.target.value) {
      this.setState({
        newQuestionDifficulty: e.target.value
      })
    }
  }

  onChangeNumAnswers(e) {
    if (e.target.value) {
      this.setState({
        newQuestionNumAnswers: e.target.value,
        newQuestionNumIncorrectAnswers: this.state.newQuestionNumCorrectAnswers && (e.target.value-this.state.newQuestionNumCorrectAnswers),
      })
    }
  }

  onChangeNumCorrectAnswers(e) {
    this.setState({
      newQuestionNumCorrectAnswers: e.target.value,
      newQuestionNumIncorrectAnswers: this.state.newQuestionNumAnswers && (this.state.newQuestionNumAnswers-e.target.value),
    })
  }

  onChangeAnswer(e) {

  }


  render () {
    const { book, questions, newQuestionNumAnswers, newQuestionNumCorrectAnswers, 
            newQuestionNumIncorrectAnswers, currentListedQuestion, currentListedQuestionIndex} = this.state;
    return (
      <div>
        <h3>{msg.MSG_QUESTION_FORM_HEADER}{book.title} ({book.author})</h3>

        {/* show list of entered questions if not empty  */}
        {questions.length ? (

          <div className="list row">
            <div className="col-md-8">

              {/*list existing questions*/}
              <h5>{msg.MSG_QUESTIONS_EXISTING}</h5>

                <ul className="list-group">
                  {questions.length &&
                    questions.map((question, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentListedQuestionIndex ? "active" : "")
                        }
                        onClick={() => this.setActiveQuestion(question, index)}
                        key={index}
                      >
                        {`${index+1}. `}{question.question}
                      </li>
                    ))}
                </ul>
            </div>
            
            {/* show question details for the selected question in the list */}
            <div className="col-md-4">
                  {currentListedQuestion ? (
                    <div>
                     
                      <div>
                        <label>
                          <strong>{msg.MSG_QUESTION_CATEGORY}:</strong>
                        </label>{" "}
                        {msg[`MSG_QUESTION_CATEGORY_${questions[currentListedQuestionIndex].categoryId}`]}
                      </div>

                      <div>
                        <label>
                          <strong>{msg.MSG_ANSWERS}:</strong>
                        </label>{" "}
                        {questions[currentListedQuestionIndex].answers.length ? (
                            ""
                            ) 
                            : 
                            ("None")}
                      </div>

                  </div>
                ) : (
                  <div>
                    <br />
                    <p>{msg.MSG_PLS_CLICK_ON_QUESTION}</p>
                  </div>
                )}
                </div>
          </div>
        ) : 
        (<p> {msg.MSG_ENTER_QUESTION}</p>)}
        
        {/*form to add new question*/}
        <form className="form-add-question form-group row border my-2 py-2" 
              noValidate onSubmit={this.handleFormSubmit}
              ref={e => this.form = e}
        >

            <h5>{msg.MSG_NEW_QUESTION}</h5>
            <div className="form-group col-md-6 mb-2">
            
              <label htmlFor="inputSelectQuestionType">{msg.MSG_QUESTION_CATEGORY}</label>
              <select className="form-select required" 
                  id={"inputSelectQuestionType"}
                  defaultValue={""}
                  required
                  onChange={this.onChangeQuestionType}
              >
                  <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE}</option>
                  {[...Array(msg.MSG_NO_QUESTION_CATEGORIES).keys()].map(idx =>
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
                defaultValue={""}
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
                  onChange={this.onChangeQuestionComment}
                ></textarea>
            </div>

            <div className="form-group col-md-6 mb-2">
            
              <label htmlFor="inputSelectnewQuestionNumAnswers">{msg.MSG_NO_ANSWERS}</label>
              <select className="form-select required" 
                      id={"inputSelectnewQuestionNumAnswers"}
                      defaultValue={""}
                      required
                      onChange={this.onChangeNumAnswers}
              >
                  <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE}</option>
                  <option key={"1"} value={2}>2</option>
                  <option key={"2"} value={4}>4</option>
              </select>
              <div className="invalid-feedback">
                  {msg.MSG_INVALID_NO_ANSWERS}
              </div>
            </div>

            <div className="form-group col-md-6 mb-2">
            
            <label htmlFor="inputSelectCorrectAnswers">{msg.MSG_NO_CORRECT_ANSWERS}</label>
            <select className="form-select required" 
                    id={"inputSelectCorrectAnswers"}
                    defaultValue={""}
                    required
                    onChange={this.onChangeNumCorrectAnswers}
            >
                <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE}</option>
                {newQuestionNumAnswers ? (<option key={"1"} value={1}>1</option>) :(null)}
                {(newQuestionNumAnswers === "4") ? (<option key={"2"} value={2}>2</option>) : (null)}
            </select>
              <div className="invalid-feedback">
                  {msg.MSG_INVALID_NO_CORRECT_ANSWERS}
              </div>
            
          </div>

            {/* form to add answers to the new question. It shows if number of correct answers is selected*/}
            { newQuestionNumCorrectAnswers ? (
              <div className="form-add-answers row">

                 {/* add correct answer(s)*/}
                <div className="form-group col-md-6 border my-2">
                  <h5>{msg.MSG_CORRECT_ANSWERS}</h5>

                    {[...Array(parseInt(newQuestionNumCorrectAnswers)).keys()].map(idx =>
                      ( <div>
                            <div className="form-group">
                              <label key={`label${idx+1}`} htmlFor={`inputCorrectAnswer${idx+1}`}>{msg.MSG_CORRECT_ANSWER} {idx+1}</label>
                              <textarea key={`input${idx+1}`} className="form-control required" id={`inputCorrectAnswer${idx+1}`} 
                                placeholder={msg.MSG_ENTER_ANSWER} onChange={this.onChangeAnswer}
                                rows="1"
                                required
                              />
                            </div>
                            <div className="invalid-feedback">
                                {msg.MSG_ENTER_ANSWER}
                            </div>
                        </div>
                      )
                      )}
                </div>

                {/* add incorrect answer(s)*/}
                <div className="form-group col-md-6 border my-2">
                 <h5>{msg.MSG_INCORRECT_ANSWERS}</h5>

                    {[...Array(parseInt(newQuestionNumIncorrectAnswers)).keys()].map(idx =>
                      ( <div>
                            <div className="form-group">
                              <label key={`label${idx+1}`} htmlFor={`inputIncorrectAnswer${idx+1}`}>{msg.MSG_INCORRECT_ANSWER} {idx+1}</label>
                              <textarea key={`input${idx+1}`} className="form-control required" id={`inputIncorrectAnswer${idx+1}`} 
                                placeholder={msg.MSG_ENTER_ANSWER} onChange={this.onChangeAnswer}
                                rows="1"
                                required
                              />
                            </div>
                            <div className="invalid-feedback">
                                {msg.MSG_ENTER_ANSWER}
                            </div>
                        </div>
                      )
                      )}
                </div>

                <button className="btn btn-primary" type="submit">
                  {msg.MSG_SAVE}
                </button> 
              </div>
            ) : (null)}

        </form> 
             
      </div>                                            
    )
  } 
}