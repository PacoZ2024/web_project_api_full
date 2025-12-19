import { Link } from 'react-router-dom';
import { useState } from 'react';
import Popup from '../Main/components/Popup/Popup';
import * as auth from '../../utils/auth.js';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import { validateEmail, validatePassword } from '../../utils/validation.js';

export default function Register({
  popup,
  onOpenPopup,
  onClosePopup,
  onClosePopupRegister,
}) {
  const [data, setData] = useState({ email: '', password: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailMessageError, setEmailMessageError] = useState('');
  const [passwordMessageError, setPasswordMessageError] = useState('');

  function infoTooltipSuccess() {
    return onOpenPopup({
      children: (
        <InfoTooltip
          isSuccess={true}
          message={'¡Correcto! Ya estás registrado.'}
        />
      ),
    });
  }

  function infoTooltipError() {
    return onOpenPopup({
      children: (
        <InfoTooltip
          isSuccess={false}
          message={'Uy, algo salió mal. Por favor, inténtalo de nuevo.'}
        />
      ),
    });
  }

  async function handleRegister({ email, password }) {
    await auth
      .register(email, password)
      .then(() => {
        setIsSuccess(true);
        infoTooltipSuccess();
        setTimeout(() => {
          onClosePopupRegister();
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setIsSuccess(false);
        infoTooltipError();
      });
  }

  function handleChange(e) {
    setEmailMessageError('');
    setPasswordMessageError('');
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const emailValidation = validateEmail(data.email);
    const passwordValidation = validatePassword(data.password);
    const passwordError =
      'La contraseña debe tener entre 8 y 16 caracteres con al menos un dígito, una minúscula y una mayúscula.';

    if (!emailValidation && !passwordValidation) {
      setEmailMessageError('Email inválido');
      setPasswordMessageError(passwordError);
      infoTooltipError();
      return;
    }

    if (!emailValidation) {
      setEmailMessageError('Email inválido');
      infoTooltipError();
      return;
    }

    if (!passwordValidation) {
      setPasswordMessageError(passwordError);
      infoTooltipError();
      return;
    }

    handleRegister(data);
  }

  return (
    <main className='session'>
      <form className='session__form' onSubmit={handleSubmit} noValidate>
        <legend className='session__form_title'>Regístrate</legend>
        <input
          className='session__form_field'
          id='email'
          name='email'
          type='email'
          value={data.email}
          onChange={handleChange}
          placeholder='Correo electrónico'
          required
        />
        <span className='email-input-error form__field-error'>
          {emailMessageError}
        </span>
        <input
          className='session__form_field'
          id='password'
          name='password'
          type='password'
          minLength='8'
          maxLength='16'
          value={data.password}
          onChange={handleChange}
          placeholder='Contraseña'
          required
        />
        <span className='password-input-error form__field-error'>
          {passwordMessageError}
        </span>
        <button className='session__form_button' type='submit'>
          Regístrate
        </button>
        <div className='session__content_form_link'>
          <Link to='/signin' className='session__form_link'>
            ¿Ya eres miembro? Inicia sesión aquí
          </Link>
        </div>
      </form>
      {popup && (
        <Popup onClose={isSuccess ? onClosePopupRegister : onClosePopup}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
