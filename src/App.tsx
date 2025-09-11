// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CustomThemeProvider } from './theme/ThemeProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext'; // ← import
import i18n from './i18n/i18n';
import FontStyles from './theme/fonts';
import Home from './Profile/Home';
import AuthLogin from './Users/AuthLogin';
import './App.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <CustomThemeProvider>
          <AuthProvider> {/* ← wrap everything that needs useAuth */}
            <FontStyles />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AuthLogin />} />
                <Route path="/*" element={<Home />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </CustomThemeProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App;
