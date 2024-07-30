import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(res => res.data);
}

const addPerson = newPerson => {
  const request = axios.post(baseUrl, newPerson);
  return request.then(res => res.data);
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
}

export default {addPerson, getAll, deletePerson }