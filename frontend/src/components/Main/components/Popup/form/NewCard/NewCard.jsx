import { useContext, useState } from 'react';
import { CurrentUserContext } from '../../../../../../contexts/CurrentUserContext.js';

export default function NewCard() {
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [link, setLinkCard] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [nameMessageError, setNameMessageError] = useState('');
  const [linkMessageError, setLinkMessageError] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
    setIsNameValid(event.target.validity.valid);
    setNameMessageError(event.target.validationMessage);
  };

  const handleLinkChange = (event) => {
    setLinkCard(event.target.value);
    setIsLinkValid(event.target.validity.valid);
    setLinkMessageError(event.target.validationMessage);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddPlaceSubmit({ name, link });
  };

  return (
    <form className='form' noValidate>
      <fieldset className='form__content'>
        <legend className='form__title'>Nuevo lugar</legend>
        <input
          onChange={handleNameChange}
          id='title-input'
          className='form__field form__field-title'
          type='text'
          placeholder='Título'
          minLength='2'
          maxLength='30'
          required
        />
        <span className='title-input-error form__field-error'>
          {nameMessageError}
        </span>
        <input
          onChange={handleLinkChange}
          id='link-image'
          className='form__field form__field-link-image'
          type='url'
          placeholder='Enlace a la imagen'
          pattern='https?://.+'
          required
        />
        <span className='link-image-error form__field-error'>
          {linkMessageError}
        </span>
        <button
          className={`form__button ${
            isLinkValid && isNameValid ? '' : 'form__button-disabled'
          }`}
          type='submit'
          onClick={handleSubmit}
          disabled={!(isLinkValid && isNameValid)}
        >
          Crear
        </button>
      </fieldset>
    </form>
  );
}
