import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ConversationsProvider } from "./context/ConversationsContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FeedPage } from "./pages/FeedPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { SellPage } from "./pages/SellPage";
import { MessagesPage } from "./pages/MessagesPage";
import { ConversationThreadPage } from "./pages/ConversationThreadPage";
import { ProfilePage } from "./pages/ProfilePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/messages/:id" element={<ProtectedRoute><ConversationThreadPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <ConversationsProvider>
            <AppRoutes />
          </ConversationsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
