import { useState, useContext } from 'react';
import { CurrentUserContext } from '../../../../../../contexts/CurrentUserContext.js';

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState(currentUser.name);
  const [about, setAbout] = useState(currentUser.about);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isAboutValid, setIsAboutValid] = useState(true);
  const [nameMessageError, setNameMessageError] = useState('');
  const [aboutMessageError, setAboutMessageError] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
    setIsNameValid(event.target.validity.valid);
    setNameMessageError(event.target.validationMessage);
  };

  const handleAboutChange = (event) => {
    setAbout(event.target.value);
    setIsAboutValid(event.target.validity.valid);
    setAboutMessageError(event.target.validationMessage);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateUser({ name, about });
  };

  return (
    <form className='form' noValidate>
      <fieldset className='form__content'>
        <legend className='form__title'>Editar perfil</legend>
        <input
          id='name-input'
          className='form__field form__field-name'
          type='text'
          placeholder='Nombre'
          value={name}
          minLength='2'
          maxLength='40'
          required
          onChange={handleNameChange}
        />
        <span className='name-input-error form__field-error'>
          {nameMessageError}
        </span>
        <input
          id='about-me-input'
          className='form__field form__field-about-me'
          type='text'
          placeholder='Acerca de mí'
          minLength='2'
          maxLength='200'
          value={about}
          required
          onChange={handleAboutChange}
        />
        <span className='about-me-input-error form__field-error'>
          {aboutMessageError}
        </span>
        <button
          className={`form__button ${
            isAboutValid && isNameValid ? '' : 'form__button-disabled'
          }`}
          type='submit'
          onClick={handleSubmit}
          disabled={!(isAboutValid && isNameValid)}
        >
          Guardar
        </button>
      </fieldset>
    </form>
  );
}
