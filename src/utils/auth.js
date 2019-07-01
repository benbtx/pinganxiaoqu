import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const TokenKeyType = 'Admin-Token-type'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getTokenType() {
  return Cookies.get(TokenKeyType)
}

export function setTokenType(tokenType) {
  return Cookies.set(TokenKeyType, tokenType)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
