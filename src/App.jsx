import { useState } from 'react'
import './App.css'
import Wrapper from './components/Wrapper'
import BasicCalculator from './components/BasicCalculator'
import ScientificCalculator from './components/ScientificCalculator'

const App = () => {
  const [mode, setMode] = useState('basic')

  return (
    <main className="app-shell">
      <header className="app-heading">
        <p className="app-kicker"><span className="heading-mark" /> DAILY TOOL / 01</p>
        <h1>Calculator</h1>
      </header>
      <nav className="mode-switch" aria-label="Calculator mode">
        {['basic', 'scientific'].map((option) => (
          <button
            key={option}
            className={mode === option ? 'selected' : ''}
            type="button"
            aria-pressed={mode === option}
            onClick={() => setMode(option)}
          >
            {option === 'basic' ? 'Basic' : 'Scientific'}
          </button>
        ))}
      </nav>
      <div className={`calculator-panel ${mode === 'basic' ? 'is-active' : 'is-hidden'}`}>
        <Wrapper>
          <BasicCalculator active={mode === 'basic'} />
        </Wrapper>
      </div>
      <div className={`calculator-panel ${mode === 'scientific' ? 'is-active' : 'is-hidden'}`}>
        <Wrapper className="scientific-wrapper">
          <ScientificCalculator active={mode === 'scientific'} />
        </Wrapper>
      </div>
    </main>
  )
}

export default App
