import{ Component } from "react";
import BookDataService from "../services/book.service";
import ShowQuestinoList from "./show-question-list.component";
import AuthService from "../services/auth.service";
import "bootstrap/dist/css/bootstrap.min.css";

const msg = require("../config/msg.config.js");

export default class CreateBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: {
        id: null,
        title: "",
        author: "",
        summary: "",
        value: "10",
        publication_year: null,
        ageLevelId: null,
        difficultyLevelId: null,
        periods: [],
        genres: [],
        bookNationalities: [],
        locations: ["Sarajevo-1"],
        status: "WIP",
        userId: AuthService.getCurrentUser().id,
      },

      formRendered: "bookForm"
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAuthor = this.onChangeAuthor.bind(this);
    this.onChangeBookText = this.onChangeBookText.bind(this);
    this.onChangePublicationYear = this.onChangePublicationYear.bind(this);
    this.onChangeDifficultyLevel = this.onChangeDifficultyLevel.bind(this);
    this.onChangeAgeLevel = this.onChangeAgeLevel.bind(this);
    this.onChangeGenres = this.onChangeGenres.bind(this);
    this.onChangePeriods = this.onChangePeriods.bind(this);
    this.onChangeNationalities = this.onChangeNationalities.bind(this);
    this.onChangeLocations = this.onChangeLocations.bind(this);

    this.validateForm = this.validateForm.bind(this);
    this.changeForm = this.changeForm.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.saveBook = this.saveBook.bind(this);
  }

  onChangeTitle(e) {
    const newState = this.state.book;
    newState.title = e.target.value;
    this.setState({
        book : newState
      });
  }

  onChangeAuthor(e) {
    const newState = this.state.book;
    newState.author = e.target.value;
    this.setState({
        book : newState
      });
  }

  onChangeBookText(e) {
    const newState = this.state.book;
    newState.summary = e.target.value;
    this.setState({
        book : newState
      });
  }

  onChangePublicationYear(e) {
    const newState = this.state.book;
    newState.publication_year = e.target.value;
    this.setState({
        book : newState
      });
  }

  onChangeAgeLevel(e) {
    const newState = this.state.book;
    newState.ageLevelId = e.target.value;
    this.setState({
        book : newState
      });
  }

  onChangeDifficultyLevel(e) {
    const newState = this.state.book;
    newState.difficultyLevelId = e.target.value;
    this.setState({
        book : newState
      });
  }

  onChangePeriods(e) {
    const newState = this.state.book;
    switch(e.target.id) {
      case "inputSelectPeriod1":
        newState.periods[0] = e.target.options[e.target.selectedIndex].text;
        break;
      case "inputSelectPeriod2":
        newState.periods[1] = e.target.options[e.target.selectedIndex].text;
        break;
      default:
    }
    this.setState({
      book : newState
    });
  }

  onChangeGenres(e) {
    const newState = this.state.book;
    switch(e.target.id) {
      case "inputSelectGenre1":
        newState.genres[0] = e.target.options[e.target.selectedIndex].text;
        break;
      case "inputSelectGenre2":
        newState.genres[1] = e.target.options[e.target.selectedIndex].text;
        break;
      case "inputSelectGenre3":
        newState.genres[2] = e.target.options[e.target.selectedIndex].text;
        break;
      default:
  }
    this.setState({
      book : newState
    });
  }

  onChangeNationalities(e) {
    const newState = this.state.book;
    switch(e.target.id) {
      case "inputSelectNationality1":
        newState.bookNationalities[0] = e.target.options[e.target.selectedIndex].text;
        break;
      case "inputSelectNationality2":
        newState.bookNationalities[1] = e.target.options[e.target.selectedIndex].text;
        break;
      default:
    }
    this.setState({
        book : newState
      });
  }

  onChangeLocations(e) {
    const newState = this.state.book;
    switch(e.target.id) {
      case "inputSelectLocation1":
        newState.locations[0] = e.target.value;
        break;
      case "inputSelectLocation2":
        newState.locations[1] = e.target.value;
        break;
      default:
    }
    this.setState({
        book : newState
      });
  }

  saveBook() {
    const data = this.state.book;
    BookDataService.add(data)
      .then(response => {
        this.setState({
          book: response.data,
          formRendered: "questionForm" // render the question form wehen the bookId is returned from the server
        });
        window.alert("Nova knjiga uspješno sačuvana");
      })
      .catch(e => {
        window.alert(`Greska: ` + e.message);
      });
  }

  changeForm() {
    if (this.state.formRendered === "bookForm") {
      this.setState({formRendered: "questionForm"})
    } else 
    {
      this.setState({formRendered: "bookForm"})
    }
  }

  resetForm() {
    const resetState = {
      title: "",
      author: "",
      summary: "",
      value: "10",
      publication_year: null,
      ageLevelId: null,
      difficultyLevelId: null,
      periods: [],
      genres: [],
      bookNationalities: [],
      locations: ["Sarajevo-1"],
      status: "WIP",
      userId: AuthService.getCurrentUser().id,
    };
    this.setState({
      book: resetState,
      formRendered: "bookForm"
    });
    this.form.reset();
    this.form.classList.remove('was-validated');
    for (let name in this.form.controls) {
      this.form.controls(name).setErrors(null);
    }
  }

  validateForm(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      this.saveBook();
      }
      e.target.classList.add('was-validated');
  }

  render() {

    return (
      <div>
        {this.state.formRendered === "bookForm" ? 
        (
          <form className="form-add-book" noValidate 
                onSubmit={this.validateForm} 
                id="form"
                ref={e => this.form = e}
          >
           
            <p>{msg.MSG_MANDATORY_FIELDS}</p>
           
            <div className="row mb-3">

              <div className="col-md-5">
                <label htmlFor="inputAuthor">{msg.MSG_AUTHOR}</label>
                <input 
                  type="text" className="form-control required" id="inputAuthor" 
                  placeholder={msg.MSG_ENTER_MANDATORY} onChange={this.onChangeAuthor}
                  required
                />
                <div className="invalid-feedback">
                    {msg.MSG_INVALID_AUTHOR}
                </div>
              </div>

              <div className="col-md-4">
                <label htmlFor="inputTitle">{msg.MSG_TITLE}</label>
                <input 
                  type="text" className="form-control required" id="inputTitle" 
                  placeholder={msg.MSG_ENTER_MANDATORY} onChange={this.onChangeTitle}
                   required
                />
                <div className="invalid-feedback">
                    {msg.MSG_INVALID_TITLE}
                </div>
              </div>

            </div>

            <div className="row mb-3">
              <div className="form-group col-md-9 mb-2">
                  <label htmlFor="bookTextarea">{msg.MSG_SUMMARY}</label>
                  <textarea className="form-control required" id="bookTextarea" rows="2"
                    placeholder={msg.MSG_ENTER_BOOK_SUMMARY}
                    required
                    onChange={this.onChangeBookText}
                  ></textarea>
                  <div className="invalid-feedback">
                    {msg.MSG_INVALID_SUMMARY}
                </div>
              </div>
            </div>

            <div className="row mb-3">

              <div className="form-group col-md-3">
                <label htmlFor="inputSelectAgeLevel">{msg.MSG_AGE_LEVEL}</label>
                <select 
                  className="form-select required" id="inputSelectAgeLevel" 
                  defaultValue={""} required onChange={this.onChangeAgeLevel}
                >
                  <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE_MANDATORY}</option>
                  {[...Array(msg.MSG_NO_AGE_LEVELS).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_AGE_LEVEL_${index+1}`]}</option>
                      )
                    )}
                </select>
                <div className="invalid-feedback">
                    {msg.MSG_INVALID_AGE_LEVEL}
                </div>
              </div>

              <div className="form-group col-md-3">
                <label htmlFor="inputSelectDifficulty">{msg.MSG_DIFFICULTY_LEVEL}</label>
                <select 
                  className="form-select required" id="inputSelectDifficulty" 
                  defaultValue={""} onChange={this.onChangeDifficultyLevel} required
                >
                  <option key={"0"} value={""} disabled>{msg.MSG_CHOOSE_MANDATORY}</option>
                  {[...Array(msg.MSG_NO_DIFFICULTY_LEVELS).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_DIFFICULTY_LEVEL_${index+1}`]}</option>
                      )
                    )}
                </select>
                <div className="invalid-feedback">
                    {msg.MSG_INVALID_DIFFICULTY_LEVEL}
                </div>
              </div>

              <div className="form-group col-md-3">
                <label htmlFor="inputPublicationYear">{msg.MSG_PUBLICATION_YEAR}</label>
                <input type="number" className="form-control not-required" id="inputPublicationYear" 
                  placeholder={msg.MSG_ENTER_YEAR} min="1" max="2022" onChange={this.onChangePublicationYear}
                />
                <div className="invalid-feedback">
                    {msg.MSG_INVALID_PUBLICATION_YEAR}
                </div>
              </div>

            </div>

            <div className="row border col-md-9 mb-3 py-2">
              <div className="form-group col-md-4">
                  <label htmlFor="inputSelectGenre1" >{msg.MSG_GENRES}</label>
                  <select 
                    className="form-select required" id="inputSelectGenre1" 
                    defaultValue={""} required onChange={this.onChangeGenres}
                  >
                    <option key={"0"} value={""} disabled>{msg.MSG_GENRE_FIRST}</option>
                    {[...Array(msg.MSG_NO_GENRES).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_GENRE_${index+1}`]}</option>
                      )
                    )}
                  </select>
                  <div className="invalid-feedback">
                    {msg.MSG_INVALID_GENRE}
                </div>
                </div>

                <div className="form-group col-md-4">
                  <label htmlFor="inputSelectGenre2" className="labelsGenre">{msg.MSG_GENRES}</label>
                  <select 
                    className="form-select not-required" id="inputSelectGenre2"
                    defaultValue={""} onChange={this.onChangeGenres}
                  >
                    <option key={"0"} value={""} disabled>{msg.MSG_GENRE_SECOND}</option>
                    {[...Array(msg.MSG_NO_GENRES).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_GENRE_${index+1}`]}</option>
                      )
                    )}
                  </select>
                  
                </div>

                <div className="form-group col-md-4">
                  <label htmlFor="inputSelectGenre3" className="labelsGenre">{msg.MSG_GENRES}</label>
                  <select 
                    className="form-select not-required" id="inputSelectGenre3"
                    defaultValue={""} onChange={this.onChangeGenres}
                  >
                  <option key={"0"} value={""} disabled>{msg.MSG_GENRE_THIRD}</option>
                    {[...Array(msg.MSG_NO_GENRES).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_GENRE_${index+1}`]}</option>
                      )
                    )}
                  </select>
                </div>

              </div>

              <div className="row border col-md-9 mb-3 py-2">
                <div className="form-group col-md-6">
                  <label htmlFor="inputSelectNationality1">{msg.MSG_NATIONALITY}</label>
                  <select 
                    className="form-select required" id="inputSelectNationality1" 
                    defaultValue={""} required onChange={this.onChangeNationalities}
                  >
                    <option key={"0"} value={""} disabled>{msg.MSG_NATIONALITY_FIRST}</option>
                    {[...Array(msg.MSG_NO_NATIONAITIES).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_NATIONALITY_${index+1}`]}</option>
                      )
                    )}
                  </select>
                  <div className="invalid-feedback">
                    {msg.MSG_INVALID_NATIONALITY}
                </div>
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="inputSelectNationality2" className="labelsNationality">{msg.MSG_NATIONALITY}</label>
                <select 
                  className="form-select not-required" id="inputSelectNationality2"
                  defaultValue={""} onChange={this.onChangeNationalities}
                >
                  <option key={"0"} value={""} disabled>{msg.MSG_NATIONALITY_SECOND}</option>
                  {[...Array(msg.MSG_NO_NATIONAITIES).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_NATIONALITY_${index+1}`]}</option>
                      )
                    )}
                  </select>
                </div>
               </div>


              <div className="row border col-md-9 mb-3 py-2">

              <div className="form-group col-md-6">
                <label htmlFor="inputSelectPeriod1" >{msg.MSG_PERIOD}</label>
                <select 
                  className="form-select not-required" id="inputSelectPeriod1" 
                  defaultValue={""} onChange={this.onChangePeriods}
                >
                  <option key={"0"} value={""} disabled>{msg.MSG_PERIOD_FIRST}</option>
                  {[...Array(msg.MSG_NO_PERIODS).keys()].map (index =>
                    (
                      <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_PERIOD_${index+1}`]}</option>
                    )
                  )}
                </select>
              </div>  

                <div className="form-group col-md-6">
                  <label htmlFor="inputSelectPeriod2" id="periodLabel2">{msg.MSG_PERIOD}</label>
                  <select 
                    className="form-select not-required" id="inputSelectPeriod2" 
                    defaultValue={""} onChange={this.onChangePeriods}
                  >
                    <option key={"0"} value={""} disabled>{msg.MSG_PERIOD_SECOND}</option>
                    {[...Array(msg.MSG_NO_PERIODS).keys()].map (index =>
                      (
                        <option key={`${index+1}`} value={`${index+1}`}>{msg[`MSG_PERIOD_${index+1}`]}</option>
                      )
                    )}
                  </select>
                </div>
            </div>
            <div className="border col-md-9 mb-3 py-2">
              <button type="submit"
                      className="btn btn-primary">{msg.MSG_SAVE}
              </button>
              <button type="button"
                      className="btn btn-secondary btn-reset"
                      onClick={this.resetForm}>{msg.MSG_RESET}
              </button>
            </div>
          </form>
        ) :
        (
          <ShowQuestinoList 
            newBook={true}
            book={this.state.book} 
          />
        )
        }
      </div>
    )
  }
}