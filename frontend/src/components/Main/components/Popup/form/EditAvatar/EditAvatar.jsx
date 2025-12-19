import { useState, useContext } from 'react';
import { CurrentUserContext } from '../../../../../../contexts/CurrentUserContext.js';

export default function EditAvatar() {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  const [avatar, setAvatar] = useState('');
  const [isAvatarValid, setIsAvatarValid] = useState(false);
  const [avatarMessageError, setAvatarMessageError] = useState('');

  const handleAvatarChange = (event) => {
    setAvatar(event.target.value);
    setIsAvatarValid(event.target.validity.valid);
    setAvatarMessageError(event.target.validationMessage);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateAvatar({ avatar });
  };

  return (
    <form className='form' id='form__edit-image-profile' noValidate>
      <fieldset className='form__content'>
        <legend className='form__title'>Cambiar foto de perfil</legend>
        <input
          onChange={handleAvatarChange}
          id='link-image-profile'
          className='form__field form__field-link-image-profile'
          type='url'
          placeholder='Enlace a la imagen'
          required
          pattern='https?://.+'
        />
        <span className='link-image-profile-error form__field-error'>
          {avatarMessageError}
        </span>
        <button
          className={`form__button ${
            isAvatarValid ? '' : 'form__button-disabled'
          }`}
          type='submit'
          onClick={handleSubmit}
          disabled={!isAvatarValid}
        >
          Guardar
        </button>
      </fieldset>
    </form>
  );
}
