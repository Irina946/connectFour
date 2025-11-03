import { ThemeProvider } from './contexts/ThemeContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/main/main'
import { SettingsPage } from './pages/settings/settings'
import { GamePage } from './pages/game/game'
import { LanguageProvider } from './contexts/LanguageContext'


function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <div className='app'>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
