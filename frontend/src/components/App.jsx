import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

import ProtectedRoute from './ProtectedRoute/ProtectedRoute.jsx';
import Header from './Header/Header.jsx';
import Main from './Main/Main.jsx';
import Footer from './Footer/Footer.jsx';
import Register from './Register/Register.jsx';
import Login from './Login/Login.jsx';

import { api } from '../utils/api.js';
import { getToken, removeToken } from '../utils/token.js';
import * as auth from '../utils/auth.js';

export default function App() {
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

  function handleSignOut() {
    removeToken();
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentUser({});
    setCards([]);
    navigate('/signin');
  }

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  function handleClosePopupRegister() {
    setPopup(null);
    navigate('/signin');
  }

  async function handleUpdateUser(data) {
    await api
      .setUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }

  async function handleUpdateAvatar(data) {
    await api
      .setUserAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }

  async function handleCardLike(card) {
    const isLiked = card.isLiked;

    if (isLiked) {
      await api
        .deleteLiked(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((currentCard) =>
              currentCard._id === card._id ? newCard : currentCard
            )
          );
        })
        .catch((err) => console.log(err));
    } else {
      await api
        .isLiked(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((currentCard) =>
              currentCard._id === card._id ? newCard : currentCard
            )
          );
        })
        .catch((err) => console.log(err));
    }
  }

  async function handleCardDelete(card) {
    await api
      .deleteCard(card._id)
      .then((resp) => {
        setCards((state) =>
          state.filter((currentCard) => {
            return currentCard._id != card._id;
          })
        );
        console.log(resp.message);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }

  async function handleAddPlaceSubmit(card) {
    await api
      .addNewPlace(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    (async () => {
      await auth
        .checkToken(jwt)
        .then(({ data }) => {
          setIsLoggedIn(true);
          setUserEmail(data.email);
        })
        .catch((err) => {
          removeToken();
          setIsLoggedIn(false);
          console.log('Token inválido:', err);
        });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await api
        .getUserInfo()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await api
        .getInitialCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
        handleCardDelete,
      }}
    >
      <Routes>
        <Route
          path='/signin'
          element={
            <ProtectedRoute anonymous>
              <div className='page'>
                <Header link={'/signup'} text={'Registrate'} />
                <Login
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                  setUserEmail={setUserEmail}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <ProtectedRoute anonymous>
              <div className='page'>
                <Header link={'/signin'} text={'Iniciar sesión'} />
                <Register
                  onOpenPopup={handleOpenPopup}
                  onClosePopupRegister={handleClosePopupRegister}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <div className='page'>
                <Header userEmail={userEmail} onSignOut={handleSignOut} />
                <Main
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                  cards={cards}
                  onCardLike={handleCardLike}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path='*'
          element={
            isLoggedIn ? (
              <Navigate to='/' replace />
            ) : (
              <Navigate to='/signin' replace />
            )
          }
        />
      </Routes>
    </CurrentUserContext.Provider>
  );
}
