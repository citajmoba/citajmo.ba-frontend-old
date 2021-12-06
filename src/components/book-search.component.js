import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BookDataService from "../services/book.service";
import ShowBook from "./show-book.component";
import ShowQuestionList from "./show-question-list.component";

const msg = require("../config/msg.config.js");

export default class BookSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formRendered: "bookSearch", //the other values are "bookDetails" and "showQuestions"
      books: [],
      currentBook: null,
      currentIndex: -1,
      searchQuery: {}
    };
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAuthor = this.onChangeAuthor.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveBook = this.setActiveBook.bind(this);
    this.searchBook = this.searchBook.bind(this);
    this.showBookDetails = this.showBookDetails.bind(this);
    this.showBookSearch = this.showBookSearch.bind(this);
    this.showQuestions = this.showQuestions.bind(this);
  }

  componentDidMount() {

  }

  onChangeTitle(e) {
      const searchQuery = this.state.searchQuery;
      searchQuery.title = e.target.value;
      this.setState({searchQuery: searchQuery});
  };

  onChangeAuthor(e) {
    const searchQuery = this.state.searchQuery;
    searchQuery.author = e.target.value;
    this.setState({searchQuery: searchQuery});
  };

  refreshList() {
    this.retrieveBooks();
    this.setState({
      currentBook: null,
      currentIndex: -1
    });
  }

  setActiveBook(book, index) {
    this.setState({
      currentBook: book,
      currentIndex: index
    });
  }

  showBookDetails() {
    this.setState({
      formRendered: "bookDetails"
    })
  }

  showQuestions() {
    this.setState({
      formRendered: "showQuestions"
    })
  }

  showBookSearch(book, index) {
    this.setActiveBook(book, index);
    this.setState({
      formRendered: "bookSearch"
    })
  }

  searchBook(e) {
    e.preventDefault();
    BookDataService.findAll(this.state.searchQuery)
      .then(response => {
        // format the associations into arrays of strings
        // since they are formatted as arrays of objects
        response.data.forEach(function(el_book, index, arr) {
            for (const attr of ['periods', 'genres', 'locations','bookNationalities']) {
                arr[index][attr] = el_book[attr].map(el_2 => el_2.name);
            };
        });

        this.setState({
          books: response.data,
          currentBook: null
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
        
      <div>
      { this.state.formRendered === "bookSearch" ?
      ( <div>
        {/* book search form*/}
          <form className="mt-4 mb-4" onSubmit={this.searchBook}>
              <div className="row">
                <div className="col-md-5">
                  <input
                    type="text" className="form-control" 
                    id="inputTitle" placeholder={msg.MSG_TITLE}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="col-md-4">
                  <input 
                    type="text" className="form-control" 
                    id="inputAuthor" placeholder={msg.MSG_AUTHOR}
                    onChange={this.onChangeAuthor}  
                  />
                </div>
                <div className="col">
                  <button 
                    type="submit" 
                    id="buttonSubmit"
                    className="btn btn-primary"> 
                    {msg.MSG_SEARCH}
                  </button>
                </div>
              </div>
            </form>
            {/* list of search results*/}
            {this.state.books.length ? (
              <div className="list row">
                <div className="col-md-6">
            
                  <h5>{msg.MSG_SEARCH_RESULTS}</h5>

                    <ul className="list-group">
                      {this.state.books &&
                        this.state.books.map((book, index) => (
                          <li
                            className={
                              "list-group-item " +
                              (index === this.state.currentIndex ? "active" : "")
                            }
                            onClick={() => this.setActiveBook(book, index)}
                            key={index}
                          >
                            {book.title}
                          </li>
                        ))}
                    </ul>
                </div>
                
                {/* book details on the side of the list */}
                  <div className="col-md-5">
                      {this.state.currentBook ? (
                        <div>
                          <h5>{msg.MSG_BOOK}</h5>
                          <div>
                            <label>
                              <strong>{msg.MSG_TITLE}:</strong>
                            </label>{" "}
                            {this.state.currentBook.title}
                          </div>
                          <div>
                            <label>
                              <strong>{msg.MSG_AUTHOR}:</strong>
                            </label>{" "}
                            {this.state.currentBook.author}
                          </div>
                          <div>
                            <label>
                              <strong>{msg.MSG_SUMMARY}:</strong>
                            </label>{" "}
                            {this.state.currentBook.summary}
                          </div>
                          <div>
                            <label>
                              <strong>Status:</strong>
                            </label>{" "}
                            {this.state.currentBook.published ? msg.MSG_PUBLISHED : msg.MSG_PENDING}
                          </div>
                          <button 
                            type="button"
                            onClick={this.showBookDetails}
                            className="badge badge-edit btn-primary my-4">{msg.MSG_DETAILS}
                          </button>
                          <button 
                            type="button"
                            onClick={this.showQuestions}
                            className="badge badge-questions btn-primary my-4">{msg.MSG_QUESTIONS}
                          </button>
                      </div>
                    ) : (
                          <div>
                            <br />
                            <p>{msg.MSG_PLS_CLICK_ON_BOOK}</p>
                          </div>
                        )
                      }
                  </div>
                </div>
              ) : (null)
            }
        </div>) 
         :
        (this.state.formRendered === "bookDetails") ? 
          (<ShowBook 
            book={this.state.currentBook} 
            index={this.state.currentIndex} 
            closeMe={this.showBookSearch}
          />) : 
          (<ShowQuestionList
            newBook={false} 
            book={this.state.currentBook} 
            index={this.state.currentIndex} 
            closeMe={this.showBookSearch}
          />)
  
      }
      </div> // main div
    
    ) //return closing paranthesis
  }  //render closing bracket
}