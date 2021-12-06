import{ Component } from "react";
import AuthService from "../services/auth.service";
import CreateQuestion from "./create-question.component";

//import BookDataService from "../services/book.service";
const msg = require("../config/msg.config");

export default class ShowQuestions extends Component {
  constructor(props) {
      super(props);
      this.state = {
          book : this.props.book,
          userId: AuthService.getCurrentUser().id,

          // questionsArr property is an array of question objects, each object
          // contains 'question' and 'answers' properties
          questionsArr: [],

          //parameters for handling the dispalyed list of questions
          currentListedQuestion: null,
          currentListedQuestionIndex: -1,

          createQuestionFormRendered: true
      }

      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.setActiveQuestion = this.setActiveQuestion.bind(this);
      this.addQuestionToList = this.addQuestionToList.bind(this);
      this.resetQuestionForm = this.resetQuestionForm.bind(this);
    }
// this is a hack to reset the form in the 
// CreateQuestion component by re-rendering the component.
// This is needed becasue resetting the form from inside the 
// CreateQuestion component does not clear the validation messages
resetQuestionForm () {
  this.setState({
    createQuestionFormRendered: true
  })
}

  // callback sent as prop to the child CreateQuestion component
  // when CreateQuestion creates a new question it is added to the list
  // CreateQuestion component is reset by unrendering it
  addQuestionToList(newQuestion) {
    this.setState(prevState => ({
      questionsArr: [...prevState.questionsArr, newQuestion],
      createQuestionFormRendered: false
    }))
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      this.saveQuestion();
      this.resetFrom();     
    }
    e.target.classList.add('was-validated');
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

  render () {
    const { book, questionsArr, currentListedQuestion, currentListedQuestionIndex} = this.state;
    return (
      <div>
        <h3>{msg.MSG_QUESTION_FORM_HEADER}{book.title} ({book.author})</h3>

        {/* show list of questions if not empty  */}
        { questionsArr.length ? (

          <div className="list row">
            <div className="col-md-8">

              {/*list existing questions*/}
              <h5>{msg.MSG_QUESTIONS_EXISTING}</h5>

                <ul className="list-group">
                  {questionsArr.map((question, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentListedQuestionIndex ? "active" : "")
                        }
                        onClick={() => this.setActiveQuestion(question, index)}
                        key={index}
                      >
                        {`${index+1}. `}{question.question.question}
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
                        {msg[`MSG_QUESTION_CATEGORY_${questionsArr[currentListedQuestionIndex].question.questionCategoryId}`]}
                      </div>

                      <div>
                        <label>
                          <strong>{msg.MSG_ANSWERS}:</strong>
                        </label>{" "}
                        {questionsArr[currentListedQuestionIndex].answers.length ? 
                          (
                            <ul className="list-group">
                              {questionsArr[currentListedQuestionIndex].answers.map((answer, index) => (
                                  <li
                                    className="answer-list-group-item"
                                    key={index}
                                  >
                                    {`${index+1}. `}{answer.answer}
                                  </li>
                                ))}
                            </ul>
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
        (<p> {msg.MSG_ENTER_QUESTION}</p>)
      }
      {this.state.createQuestionFormRendered ? 
        (<CreateQuestion book={this.state.book} addQuestionToList={this.addQuestionToList}/>)
        : (this.resetQuestionForm())
      }
        
      </div>                                            
    )
  } 
}