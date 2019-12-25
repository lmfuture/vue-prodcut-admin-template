import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setMenu(token) {
  return Cookies.set('menu', token)
}

export function getMenu() {
  return Cookies.set('menu')
}


// Create a cookie, valid across the entire site:
//Cookies.set('name', 'value');

// Create a cookie that expires 7 days from now, valid across the entire site:
//Cookies.set('name', 'value', { expires: 7 });

// Create an expiring cookie, valid to the path of the current page:
//Cookies.set('name', 'value', { expires: 7, path: '' });
