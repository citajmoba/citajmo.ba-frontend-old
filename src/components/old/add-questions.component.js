import{ Component } from "react";
//import BookDataService from "../services/book.service";
const msg = require("../../config/msg.config.js");

export default class AddQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book : this.props.book,
            //questions is a list of question objects, each object containing a list of answers
            questions: [],
            minNoQuestions: this.props.minNoQuestions,
            activeQuestion: null,


            nextAnswerIndex: 1
        }
        this.close = this.close.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
    }

    close () {
        this.props.closeMe()
    }

    createQuestion(questionId, category, questionText, noAnswers) {
        return {
            questionId,
            category,
            questionText,
            saved: false,
            userId: this.state.book.userId,
            noAnswers,
            answers: []
        }
    }

    createAnswer(questionId, answerId, answerText, answerCorrect) {
        return {
            questionId,
            answerId,
            answerText,
            answerCorrect
        }
    }

    addQuestion () {
        let newIndex = this.state.minNoQuestions;
        newIndex+=1;
        this.setState({
            minNoQuestions : newIndex
        })
    }

    addAnswer () {
        let newIndex = this.state.nextAnswerIndex;
        newIndex+=1;
        this.setState({
            nextAnswerIndex : newIndex
        })
    }

    deleteQuestion () {
        let newIndex = this.state.minNoQuestions;
        newIndex-=1;
        this.setState({
            minNoQuestions : newIndex
        })
    }

    deleteAnswer () {
        let newIndex = this.state.nextAnswerIndex;
        newIndex-=1;
        this.setState({
            nextAnswerIndex : newIndex
        })
    }

    render () {
        return (
        <div>
          <form className="form-add-questions">
            <h5>{msg.MSG_QUESTION_FORM_HEADER}{this.state.book.title} ({this.state.book.author})</h5>
            
          {/* list questions */}
              <ul className="list-group">
                {[...Array(this.state.minNoQuestions).keys()].map (index =>
                  (
                    <li key={index}>
                            
                        <div className="form-group row border my-2">
                            <p> {msg.MSG_QUESTION} {index+1} </p>
                            <div class="form-group col-md-2 mb-2">
                            
                                <label for={`inputSelectQuestionType${index+1}`}>{msg.MSG_QUESTION_CATEGORY}</label>
                                <select className="form-select required" id={`inputSelectQuestionType${index+1}`}
                                    defaultValue={""} onChange={this.onChangeQuestionType}>
                                    <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE}</option>
                                    {[...Array(msg.MSG_NO_QUESTION_CATEGORIES).keys()].map (idx =>
                                      (
                                        <option key={`${idx+1}`} value={`${idx+1}`}>{msg[`MSG_QUESTION_CATEGORY_${idx+1}`]}</option>
                                      )
                                    )}
                                </select>
                            </div>

                            <div class="form-group col-md-10">
                                <label for={`exampleFormControlTextarea${index+1}`}>{msg.MSG_QUESTION}</label>
                                <textarea class="form-control" id={`exampleFormControlTextarea${index+1}`} rows="1"
                                placeholder={msg.MSG_ENTER_QUESTION}></textarea>
                            </div>

                            <button 
                              className="btn-add-questions">{msg.MSG_ADD_QUESTIONS}
                              disabled={this.state.questions[this.state.activeQuestion].validated}
                            </button> 
                        </div>                         
                    </li>
                  )
                )}
                                  
              </ul>
                <button type="button" className="btn btn-primary" onClick={this.close}>{msg.MSG_WRITE}</button>
          </form>                      
        </div>                                            
        )
    } 
}