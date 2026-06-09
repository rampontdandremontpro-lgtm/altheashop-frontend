import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { I18nProvider } from "./context/I18nContext";

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;