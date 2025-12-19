import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';

import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

import Popup from '../Main/components/Popup/Popup.jsx';
import InfoTooltip from '../InfoTooltip/InfoTooltip.jsx';
import * as auth from '../../utils/auth.js';
import { setToken } from '../../utils/token.js';
import { validateEmail, validatePassword } from '../../utils/validation.js';

export default function Login({
  popup,
  onOpenPopup,
  onClosePopup,
  setUserEmail,
}) {
  const [data, setData] = useState({ email: '', password: '' });
  const { setIsLoggedIn } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [emailMessageError, setEmailMessageError] = useState('');
  const [passwordMessageError, setPasswordMessageError] = useState('');

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

  async function handleLogin({ email, password }) {
    if (!email || !password) {
      return;
    }

    await auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          setUserEmail(email);
          setIsLoggedIn(true);
          const redirectPath = location.state?.from?.pathname || '/';
          navigate(redirectPath);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsLoggedIn(false);
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
    handleLogin(data);
  }

  return (
    <main className='session'>
      <form className='session__form' onSubmit={handleSubmit} noValidate>
        <legend className='session__form_title'>Inicia sesión</legend>
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
          Inicia sesión
        </button>
        <div className='session__content_form_link'>
          <Link to='/signup' className='session__form_link'>
            ¿Aún no eres miembro? Regístrate aquí
          </Link>
        </div>
      </form>
      {popup && <Popup onClose={onClosePopup}>{popup.children}</Popup>}
    </main>
  );
}
