// src/utils/logout.js
export const handleLogout = (navigate) => {
    // Clear session or localStorage if used
    localStorage.removeItem("isLoggedIn");
  
    // Optional: clear other items
    // localStorage.clear();
  
    // Redirect to login page
    navigate("/");
  };
  