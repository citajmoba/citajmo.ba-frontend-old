import authHeader from "./auth-header";
import axios from "axios";

const API_URL = "http://localhost:8080/api/questions";

class QuestionDataService {

  // find all questions from a book with bookId
  find(bookId) {
    return axios.get(API_URL + `/${bookId}`);
  }

  add(data) {
    return axios.post(API_URL, data, { headers: authHeader()});
  }

 //update question with question id 
  update(id, data) {
    return axios.put(API_URL + `/${id}`, data);
  }
}

export default new QuestionDataService();
