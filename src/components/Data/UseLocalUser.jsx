export default function useLocalUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}
