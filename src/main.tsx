import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TranslationProvider } from './contexts/TranslationContext.tsx'
import { RecitationProvider } from './contexts/RecitationContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <TranslationProvider>
      <RecitationProvider>
        <App />
      </RecitationProvider>
    </TranslationProvider>
  </AuthProvider>
);