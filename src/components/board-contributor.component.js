import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import BookSearch from "./book-search.component";
import CreateBook from "./create-book.component";
const msg = require("../config/msg.config.js");

export default class BoardContributor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuSelection: "search"
    };
    this.onToggleButtonChange = this.onToggleButtonChange.bind(this);
    this.displayMenuItem = this.displayMenuItem.bind(this);
    this.cancelCreateBook = this.cancelCreateBook.bind(this)
  }

  cancelCreateBook() {
    this.setState({
      menuSelection: "search"
    })
  }

  onToggleButtonChange = (event, newValue) => {
    if (newValue !== null) {
      this.setState({menuSelection: newValue});
    };
  }

  displayMenuItem (){
    let Output; // save the rendered JSX to return

    // eslint-disable-next-line default-case
    switch ( this.state.menuSelection ) {

      // render Type1 with props
      case "search":
        Output = (<BookSearch />);
        break;

      // render Type2 with props
      case "add":  
        Output = (<CreateBook onCancel={this.cancelCreateBook}/>);
        break;

      case "history":
        break;

      case "stats":
        break;
            
    };

    return Output; 
  }

  render() {
    return (
      <div className="contributor-menu">
        <ToggleButtonGroup
          color="primary"
          value={this.state.menuSelection}
          exclusive
          onChange={this.onToggleButtonChange}
        >
          <ToggleButton value="search">{msg.MSG_BOOK_SEARCH}</ToggleButton>
          <ToggleButton value="add">{msg.MSG_ADD_NEW_BOOK}</ToggleButton>
          <ToggleButton value="history">{msg.MSG_CONTINUE}</ToggleButton>
          <ToggleButton value="stats">{msg.MSG_STATS}</ToggleButton>
        </ToggleButtonGroup>

        <this.displayMenuItem />
  </div>
    )
  }
}