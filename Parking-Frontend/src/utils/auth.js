export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  console.log('🔑 isLoggedIn() check - Token present:', !!token);
  if (!token) {
    console.warn('⚠️ No token found in localStorage!');
  }
  return !!token;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("selectedLocationId");
};

export const getCurrentUser = () => {
  return {
    userId: localStorage.getItem("userId"),
    email: localStorage.getItem("email"),
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
  };
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const isAdmin = () => {
  return localStorage.getItem("role") === "ADMIN";
};

export const getToken = () => {
  return localStorage.getItem("token");
};
