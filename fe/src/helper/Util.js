import { KEY } from "../common/Const"

export const getToken = () => {
    return localStorage.getItem(KEY.LOCAL_STORAGE.AUTH_TOKEN);
}
export const getUserId = () => {
    return localStorage.getItem(KEY.LOCAL_STORAGE.USER_ID);
}
export const getUserDisplayName = () => {
    return localStorage.getItem(KEY.LOCAL_STORAGE.USER_DISPLAY_NAME);
}
export const logoutAfter = () => {
    localStorage.removeItem(KEY.LOCAL_STORAGE.AUTH_TOKEN);
    localStorage.removeItem(KEY.LOCAL_STORAGE.USER_ID);
    localStorage.removeItem(KEY.LOCAL_STORAGE.USER_DISPLAY_NAME);
}
export const loginAfter = (token, userId, userDisplayName) => {
    localStorage.setItem(KEY.LOCAL_STORAGE.AUTH_TOKEN, token);
    localStorage.setItem(KEY.LOCAL_STORAGE.USER_ID, userId);
    localStorage.setItem(KEY.LOCAL_STORAGE.USER_DISPLAY_NAME, userDisplayName);
}

export function toLocalDatetimeValueWithSeconds(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function timeFormater (date1) {
    const d1 = new Date(date1);
    return to2(d1.getHours()) + ":" + to2(d1.getMinutes()) + " " + to2(d1.getDate()) + "/" + to2(d1.getMonth() + 1) + "/" + d1.getFullYear();
}

function to2(number) {
    if (number < 10) return '0' + number;
    return number;
}