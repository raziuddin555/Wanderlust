import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthState from "./contextapi/authcontext/AuthState.jsx";
import ListState from "./contextapi/listcontext/ListState.jsx"
import ThemeState from "./contextapi/theme/ThemeState.jsx";
import Elements from "./Element.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthState>
     <ListState>
       <ThemeState>
        <Elements />
      </ThemeState>
     </ListState>
    </AuthState>
       <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="colored"
    />
  </StrictMode>
);
