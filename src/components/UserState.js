let currentUser = null;

const setUser = (user) => {
  currentUser = user;
};

const getUser = () => {
  return currentUser;
};

export { setUser, getUser };
