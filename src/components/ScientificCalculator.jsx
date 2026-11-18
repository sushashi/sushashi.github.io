import { useEffect, useState } from 'react'
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

const ScientificCalculator = ({ active }) => {
  const [angleMode, setAngleMode] = useState('DEG')
  const [scientific, setScientific] = useState({ expression: '', result: null, error: '' })

  const evaluate = async () => {
    try {
      const { evaluateScientificExpression } = await import('../math/scientific')
      const result = evaluateScientificExpression(scientific.expression, angleMode)
      setScientific((current) => ({ ...current, result, error: '' }))
    } catch {
      setScientific((current) => ({ ...current, result: null, error: 'Check expression' }))
    }
  }

  const handleButton = (value) => {
    if (value === 'ANGLE') {
      setAngleMode((current) => current === 'DEG' ? 'RAD' : 'DEG')
      return
    }
    if (value === 'C') {
      setScientific({ expression: '', result: null, error: '' })
      return
    }
    if (value === '=') {
      evaluate()
      return
    }

    setScientific((current) => {
      const binaryOperator = ['+', '-', '*', '/', '^'].includes(value)
      const expression = current.result !== null && binaryOperator
        ? String(current.result)
        : current.result !== null && /^\d$/.test(value)
          ? ''
          : current.result !== null
            ? String(current.result)
            : current.expression

      if (value === 'DEL') {
        return { expression: expression.slice(0, -1), result: null, error: '' }
      }

      return {
        expression: appendScientificInput(expression, value),
        result: null,
        error: '',
      }
    })
  }

  const handleExpressionChange = (expression) => {
    setScientific({ expression, result: null, error: '' })
  }

  useEffect(() => {
    if (!active) return undefined

    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement) return

      const keyMap = { Enter: '=', '=': '=', Backspace: 'DEL', Escape: 'C', '*': '*', '/': '/', '-': '-' }
      const value = keyMap[event.key] || event.key
      if (/^\d$/.test(value) || ['.', '+', '-', '*', '/', '^', '(', ')', '=', 'DEL', 'C'].includes(value)) {
        event.preventDefault()
        handleButton(value)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleButton('=')
    } else if (event.key === 'Escape') {
      event.preventDefault()
      handleButton('C')
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
          value={scientific.expression}
          onChange={(event) => handleExpressionChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an expression"
          aria-label="Scientific expression"
        />
        <output className={scientific.error ? 'scientific-result error' : 'scientific-result'} aria-live="polite">
          {scientific.error || (scientific.result !== null ? `= ${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12 }).format(scientific.result)}` : '')}
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
              onClick={() => handleButton(key === '÷' ? '/' : key === '×' ? '*' : key === '−' ? '-' : key)}
            />
          )
        })}
      </div>
    </div>
  )
}

const appendScientificInput = (expression, value) => {
  const endsWithValue = /(?:\d|\)|pi|e)$/i.test(expression.trim())
  const multiplication = endsWithValue ? '*' : ''

  if (['sin', 'cos', 'tan', 'ln', 'log', '√'].includes(value)) {
    const functionName = value === '√' ? 'sqrt' : value
    if (expression && endsWithValue) return `${functionName}(${expression})`
    return `${expression}${multiplication}${functionName}(`
  }
  if (value === 'π' || value === 'e') return `${expression}${multiplication}${value === 'π' ? 'pi' : 'e'}`
  if (value === 'x²') return expression ? `(${expression})^2` : '0^2'
  if (value === 'xʸ') return `${expression}^`
  if (value === '1/x') return expression ? `1/(${expression})` : '1/('
  if (value === '±') return expression ? `-(${expression})` : '-'
  if (value === '%') return expression ? `(${expression})/100` : '0.01'
  if (value === '.') {
    const currentNumber = expression.match(/(?:^|[+\-*/^(])\s*(\d*\.)?\d*$/)
    if (currentNumber?.[0].includes('.')) return expression
    return `${expression}${endsWithValue ? '*' : ''}0.`
  }
  if (/^\d$/.test(value) && /(?:\)|pi|e)$/i.test(expression.trim())) return `${expression}*${value}`
  if (value === ')' && (expression.match(/\(/g) || []).length <= (expression.match(/\)/g) || []).length) return expression
  return `${expression}${value}`
}

export default ScientificCalculator