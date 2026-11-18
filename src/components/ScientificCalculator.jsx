import Button from './Button'
import './ScientificCalculator.css'

const keys = [
  ['ANGLE', '(', ')', 'DEL', 'C'],
  ['sin', 'cos', 'tan', 'ln', 'log'],
  ['√', 'x²', 'xʸ', '1/x', 'π'],
  ['7', '8', '9', '÷', 'e'],
  ['4', '5', '6', '×', '%'],
  ['1', '2', '3', '−', '±'],
  ['0', '.', '+', '='],
]

const labels = {
  ANGLE: 'Toggle degrees or radians',
  '√': 'Square root',
  'x²': 'Square',
  'xʸ': 'Power',
  '1/x': 'Reciprocal',
  'π': 'Pi',
  DEL: 'Delete last character',
  '±': 'Change sign',
}

const ScientificCalculator = ({
  expression,
  result,
  error,
  angleMode,
  onAngleModeChange,
  onExpressionChange,
  onButton,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onButton('=')
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onButton('C')
    }
  }

  return (
    <div className="scientific-calculator">
      <div className="scientific-display">
        <label htmlFor="scientific-expression">EXPRESSION / {angleMode}</label>
        <input
          id="scientific-expression"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck="false"
          value={expression}
          onChange={(event) => onExpressionChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an expression"
          aria-label="Scientific expression"
        />
        <output className={error ? 'scientific-result error' : 'scientific-result'} aria-live="polite">
          {error || (result !== null ? `= ${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12 }).format(result)}` : '')}
        </output>
      </div>
      <div className="scientific-keypad">
        {keys.flat().map((key) => {
          const value = key === 'ANGLE' ? angleMode : key
          const classNames = [
            ['+', '−', '×', '÷', 'xʸ'].includes(key) ? 'operator' : '',
            key === '=' ? 'equals' : '',
            ['ANGLE', 'DEL', 'C', '%', '±'].includes(key) ? 'utility' : '',
            ['sin', 'cos', 'tan', 'ln', 'log', '√', 'x²', 'xʸ', '1/x', 'π', 'e'].includes(key) ? 'function' : '',
            key === '0' ? 'zero' : '',
          ].filter(Boolean).join(' ')

          return (
            <Button
              key={key}
              className={classNames}
              value={value}
              ariaLabel={labels[key] || key}
              onClick={() => key === 'ANGLE' ? onAngleModeChange() : onButton(key === '÷' ? '/' : key === '×' ? '*' : key === '−' ? '-' : key)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ScientificCalculator