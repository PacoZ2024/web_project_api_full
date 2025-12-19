import { Squash as Hamburger } from 'hamburger-react';
import { Link } from 'react-router-dom';

export default function HamburgerMenu({
  userEmail,
  onSignOut,
  toggledIsOpen,
  setToggledIsOpen,
}) {
  return (
    <div className='menu-container'>
      <Hamburger size='24' toggled={toggledIsOpen} toggle={setToggledIsOpen} />
      {toggledIsOpen && (
        <ul className='menu-list'>
          <li className='menu-items'>
            <p className='menu-item-email'>{userEmail}</p>
          </li>
          <li className='menu-items'>
            <Link className='menu-item-close-session' onClick={onSignOut}>
              Cerrar sesión
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
