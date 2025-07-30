import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TranslationProvider } from './contexts/TranslationContext.tsx'
import { RecitationProvider } from './contexts/RecitationContext.tsx'

createRoot(document.getElementById("root")!).render(
  <TranslationProvider>
    <RecitationProvider>
      <App />
    </RecitationProvider>
  </TranslationProvider>
);