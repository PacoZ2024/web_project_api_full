const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

export async function register(email, password) {
  return await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  }).then((res) => {
    return res.ok
      ? res.json()
      : res.status === 400
      ? Promise.reject('Uno de los campos se rellenó de forma incorrecta')
      : Promise.reject(`Error: ${res.status}`);
  });
}

export async function authorize(email, password) {
  return await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  }).then((res) => {
    return res.ok
      ? res.json()
      : res.status === 400
      ? Promise.reject('No se ha proporcionado uno o más campos')
      : res.status === 401
      ? Promise.reject(
          'No se ha encontrado al usuario con el correo electrónico especificado'
        )
      : Promise.reject(`Error: ${res.status}`);
  });
}

export async function checkToken(token) {
  return await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    return res.ok
      ? res.json()
      : res.status === 400
      ? Promise.reject(
          'Token no proporcionado o proporcionado en el formato incorrecto'
        )
      : res.status === 401
      ? Promise.reject('El token provisto es inválido')
      : Promise.reject(`Error: ${res.status}`);
  });
}
