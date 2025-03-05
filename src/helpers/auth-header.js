import store from '../store/store'

export default function authHeader() {
  if (store.getters.tokenAll) {
    return store.getters.tokenAll;
  } else {
    return null;
  }
}
