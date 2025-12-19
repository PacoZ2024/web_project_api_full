import { useContext } from 'react';
import { CurrentUserContext } from '../../../../../../contexts/CurrentUserContext.js';

export default function WithConfirmation(props) {
  const { handleCardDelete } = useContext(CurrentUserContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCardDelete(props.card);
  };

  return (
    <form
      className='form'
      id='form__delete-confirmation'
      name='formDeleteConfirmation'
      noValidate
    >
      <fieldset className='form__content'>
        <legend className='form__title form__title-delete-confirmation'>
          ¿Estas seguro/a?
        </legend>
        <button className='form__button' type='submit' onClick={handleSubmit}>
          Si
        </button>
      </fieldset>
    </form>
  );
}
