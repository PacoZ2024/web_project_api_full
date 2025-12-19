import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoAround from '../../assets/images/Logo.svg';
import HamburgerMenu from './HamburgerMenu/HamburgerMenu';

export default function Header({ link, text, userEmail, onSignOut }) {
  const [toggledIsOpen, setToggledIsOpen] = useState(false);
  if (link && text)
    return (
      <header className='header'>
        <div className='header__line'>
          <img
            className='header__logo'
            src={LogoAround}
            alt='Logo Around The U.S.'
          />
          <div className='header__content_link'>
            <Link className='header__link' to={link}>
              {text}
            </Link>
          </div>
        </div>
      </header>
    );
  return (
    <>
      <div className={`${toggledIsOpen ? 'header-toggled-open' : ''}`}></div>
      <header className='header'>
        <div className='header__line'>
          <img
            className='header__logo'
            src={LogoAround}
            alt='Logo Around The U.S.'
          />
          <div className='header__data'>
            <p className='header__email'>{userEmail}</p>
            <div className='header__content_link'>
              <Link className='header__link_close-session' onClick={onSignOut}>
                Cerrar sesión
              </Link>
            </div>
          </div>
          <HamburgerMenu
            userEmail={userEmail}
            onSignOut={onSignOut}
            toggledIsOpen={toggledIsOpen}
            setToggledIsOpen={setToggledIsOpen}
          />
        </div>
      </header>
    </>
  );
}
