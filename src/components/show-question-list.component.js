import{ Component } from "react";
import AuthService from "../services/auth.service";
import CreateQuestion from "./create-question.component";
import ShowQuestion from "./show-question.component";
import QuestionDataService from "../services/question.service";

//import BookDataService from "../services/book.service";
const msg = require("../config/msg.config");
const sys = require("../config/sys.config");

export default class ShowQuestionList extends Component {
  constructor(props) {
      super(props);
      this.state = {
          book : this.props.book,
          userId: AuthService.getCurrentUser().id,

          // questionsArr property is an array of question objects {question: {}, answers: [{}]}
          questionsArr: [],

          // questionCategoryCount property is an array where each element with index i 
          // provides the number of question of category i
          questionCategoryCount: [],

          //parameters for handling the dispalyed list of questions
          currentListedQuestion: null,
          currentListedQuestionIndex: -1,

          questionFormRendered: props.newBook ? "createQuestionForm" : null, //the other two values are "newQuestionForm" and "updateQuestionForm"
      }

      this.setActiveQuestion = this.setActiveQuestion.bind(this);
      this.addQuestionToList = this.addQuestionToList.bind(this);
      this.updateQuestionToList = this.updateQuestionToList.bind(this);
      this.hideQuestionsForm = this.hideQuestionsForm.bind(this);
      this.showCreateQuestionForm = this.showCreateQuestionForm.bind(this);
      this.showUpdateQuestionForm = this.showUpdateQuestionForm.bind(this);
      this.close=this.close.bind(this);

    }

  componentDidMount() {
    // for existing book, fetch the questions
    if (!this.props.newBook) {
      QuestionDataService.find(this.state.book.id)
        .then(response => {
          //compute the breakdown of quesitons per question category
          //compute the number of correct answers for each question
          const questionCategoryCountArr = new Array(sys.NO_QUESTION_CATEGORIES).fill(0);
          response.data.forEach((el, index, arr) => {
            questionCategoryCountArr[el.question.questionCategoryId-1]+=1;
            arr[index].question.numCorrectAnswers = el.answers.filter(e => e.correct === true).length;
          })
          this.setState({
            questionsArr: response.data,
            questionFormRendered: response.data.length ? null : "createQuestionForm",
            questionCategoryCount: questionCategoryCountArr
        });
      })
      .catch(e => {console.log(e)});
    }
  }

  // callback sent as prop to the child CreateQuestion component
  // so when CreateQuestion creates a new question it is added to the list
  addQuestionToList(newQuestion) {
    this.setState(prevState => ({
      questionsArr: [...prevState.questionsArr, newQuestion],
      questionFormRendered: null
    }))
  }

  // callback sent as prop to the ShowQuestion component
  // so when ShowQuestion upates a question it is updated in the question list
  updateQuestionToList(question) {
    const arr = this.state.questionsArr;
    this.setState({
      questionsArr: arr.map((e, idx) => {return (idx === this.state.currentListedQuestionIndex ?
        question : e)}),
      questionFormRendered: null
    })
  }

  hideQuestionsForm() {
    this.setState({
      questionFormRendered: null
    })
  }

  showCreateQuestionForm() {
    this.setState( {
      questionFormRendered: "createQuestionForm"
    })
  }

  showUpdateQuestionForm() {
    this.setState( {
      questionFormRendered: "updateQuestionForm"
  })
  }

  close() {
    this.props.closeMe(this.props.book, this.props.index)
  }

  setActiveQuestion(question, index) {
    this.setState({
      currentListedQuestion: question,
      currentListedQuestionIndex: index
    });
  }

  render () {
    const { book, questionsArr, questionCategoryCount, currentListedQuestion, currentListedQuestionIndex} = this.state;
    return (
      <div>
        <h4>{msg.MSG_QUESTION_FORM_HEADER}{book.title} ({book.author})</h4>
        <hr></hr>
        {
          this.state.questionFormRendered === "createQuestionForm" ? 
            (
              /* render create-question component  */
              <div>
             <p>{msg.MSG_QUESTIONS_NOT_EXIST}</p>
                {msg.MSG_ENTER_QUESTION}
                <CreateQuestion 
                  book={book} 
                  addQuestionToList={this.addQuestionToList}
                  closeMe={this.hideQuestionsForm}/>        
              </div>
            ) : 
            this.state.questionFormRendered === "updateQuestionForm" ? 
            (
              /* render show-question component  */
              <div>
             <p>{msg.MSG_QUESTIONS_NOT_EXIST}</p>
                {msg.MSG_ENTER_QUESTION}
                <ShowQuestion 
                  question={currentListedQuestion}
                  updateQuestionToList={this.updateQuestionToList}
                  closeMe={this.hideQuestionsForm}/>        
              </div>
            ) : 
            questionsArr.length ? 
            (
              /* show list of questions if not empty  */
              <div>
              {/* show question breakdown per question type */}
              <div className="row">
                <div>                 
                  <div>
                    <label>
                      <strong>{msg.MSG_QUESTION_CATEGORY_BREAKDOWN}:</strong>
                    </label>
                  </div>
                  <div>
                    {/* show breakddown of the number of questions per question category */}
                    <ul className="list-group list-group-horizontal">
                      {[...Array(sys.NO_QUESTION_CATEGORIES).keys()].map((el, index) => (
                          <li
                            className="questionCategory-list-group-item"
                            key={index}
                          >
                            {msg[`MSG_QUESTION_CATEGORY_${el+1}`]}: {questionCategoryCount[index]}&nbsp;
                            {questionCategoryCount[index]>=sys[`MIN_NO_QUESTIONS_CATEGORY_${el+1}`] ? 
                              (<span>&#10003;</span>):("")}&nbsp;&nbsp;&nbsp;&nbsp; 
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>   
              <div className="list row">
                <div className="col-md-7">

                  {/*list existing questions*/}

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
                
                {/* show question details for the selected question */}
                <div className={currentListedQuestion ? "question-details-nonempty col-md-4" : "col-md-3"}>
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
                                        {`${index+1}. `}{answer.answer} {answer.correct ? (<span>&#10003;</span>) : ("")}
                                      </li>
                                    ))}
                                </ul>
                              ) 
                              : 
                              ("None")}
                          </div>
                          
                          <span className="details-link" onClick={this.showUpdateQuestionForm}>
                            {msg.MSG_DETAILS}
                          </span>
                      </div>
                    ) : (
                      <div>
                        <p>{msg.MSG_PLS_CLICK_ON_QUESTION_OR_CREATE_QUESTION}</p>
                      </div>
                    )}
                </div>

              </div>
                  
              <div className="row show-question-buttons mb-3">
                <div className="col-md-7">
                  <button type="button"
                    className="btn btn-primary" 
                    onClick={this.showCreateQuestionForm}
                  >
                    {msg.MSG_ADD_QUESTIONS}
                  </button>
                  {this.props.closeMe ? 
                  (
                    <button type="button"
                      className="btn btn-secondary" 
                      onClick={this.close}
                    >
                      {msg.MSG_CLOSE}
                  </button>
                  ) : ("")}
                </div>
              </div>
            </div>
            ) : 
            (
              <div>
                <p> {msg.MSG_WAIT_UNTIL_QUESTIONS_LOAD}</p>
              </div>
            )
          
        }
      </div>                     
    ) //return paranthesis
  } // render brackets
} //component brackets