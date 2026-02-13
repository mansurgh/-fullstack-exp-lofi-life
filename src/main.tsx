import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QuranAudioProvider } from './contexts/QuranAudioContext'
import { RecitationProvider } from './contexts/RecitationContext'
import { SoundProvider } from './contexts/SoundContext'
import { TranslationProvider } from './contexts/TranslationContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TranslationProvider>
      <RecitationProvider>
        <SoundProvider>
          <QuranAudioProvider>
            <App />
          </QuranAudioProvider>
        </SoundProvider>
      </RecitationProvider>
    </TranslationProvider>
  </React.StrictMode>,
)
