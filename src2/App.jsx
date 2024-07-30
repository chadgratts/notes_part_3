import { useState, useEffect } from 'react';
import axios from 'axios';
import personService from './services/notes';

const Filter = ({ filterInput, handleFilterInput }) => {
  return <input value={filterInput} onChange={handleFilterInput}/>;
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>name: <input value={props.newName} onChange={props.handleNameInput}/></div>
      <div>number: <input value={props.newNumber} onChange={props.handleNumberInput}/></div>
      <div><button type="submit">add</button></div>
    </form>
  );
}

const Persons = (props) => {
  return props.filterInput ? props.showFilteredNumbers() : props.showAllNumbers()
}

const DeleteButton = ({ name, id, persons, setPersons }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletePerson(id).then(response => {
        setPersons(persons.filter(p => p.name !== name));
      });
      // axios.delete(`http://localhost:3001/persons/${id}`).then(_ => {
      //   setPersons(persons.filter(p => p.name !== name));
      // });
    }
  }
  return <button onClick={() => handleDelete()}>delete</button>
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterInput, setFilterInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons);
      });
  }, []);

  const handleNameInput = (event) => setNewName(event.target.value);
  const handleNumberInput = (event) => setNewNumber(event.target.value);
  const handleFilterInput = (event) => setFilterInput(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    debugger
    const newPerson = { name: newName, number: newNumber };
    const usedNames = persons.map(person => person.name);

    if (usedNames.includes(newPerson.name)) {
      let id = persons.find(p => p.name === newPerson.name).id;
      axios.put(`http://localhost:3001/persons/${id}`, newPerson).then(response => {
        setPersons(persons.map(p => p.id === id ? response.data : p));
      })
      .catch(error => {
        setErrorMessage(`Information of ${newPerson.name} has already been removed from server`)
      });
      return;
    }

    personService
      .addPerson(newPerson)
      .then(newPersonObj => {
        setPersons(persons.concat(newPersonObj));
        setNewName('');
        setNewNumber('');
        setSuccessMessage(`Added ${newPerson.name}`)
     });
  }

  const showFilteredNumbers = () => {
    let filteredPersons = persons.filter(person => person.name.includes(filterInput));
    return filteredPersons.map(filteredPerson =>
        <div key={filteredPerson.name}>{filteredPerson.name} {filteredPerson.number}</div>
    );
  }

  const showAllNumbers = () => {
    return persons.map(person => {
      return <div key={person.name}>
        {person.name} {person.number} <DeleteButton persons={persons} name={person.name} id={person.id} setPersons={setPersons}>delete</DeleteButton>
      </div>
    }
    );
  }

  const message = () => {
    const successMessageStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    }
    
    const errorMessageStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    }

    if (successMessage) {
      setTimeout(() => setSuccessMessage(''), 3000);
      return <div style={successMessageStyle}>{successMessage}</div>
    } else if (errorMessage) {
      setTimeout(() => setErrorMessage(''), 3000);
      return <div style={errorMessageStyle}>{errorMessage}</div>
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {message()}
      filter <Filter filterInput={filterInput} handleFilterInput={handleFilterInput}/>
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameInput={handleNameInput}
        handleNumberInput={handleNumberInput}
      />
      <h2>Numbers</h2>
      <Persons
        filterInput={filterInput}
        showFilteredNumbers={showFilteredNumbers}
        showAllNumbers={showAllNumbers}
      />
    </div>
  );
}

export default App
