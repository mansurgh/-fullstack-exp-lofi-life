import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TranslationProvider } from './contexts/TranslationContext'
import { RecitationProvider } from './contexts/RecitationContext'
import { SoundProvider } from './contexts/SoundContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TranslationProvider>
      <RecitationProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </RecitationProvider>
    </TranslationProvider>
  </React.StrictMode>,
)
