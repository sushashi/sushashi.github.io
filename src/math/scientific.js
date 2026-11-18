import { all, create } from 'mathjs'

const math = create(all, { number: 'number' })
const allowedNames = new Set(['sin', 'cos', 'tan', 'sqrt', 'ln', 'log', 'pi', 'e'])

export const evaluateScientificExpression = (expression, angleMode = 'DEG') => {
  if (typeof expression !== 'string' || expression.trim() === '' || expression.length > 160) {
    throw new Error('Invalid expression')
  }

  const normalized = expression
    .replaceAll('×', '*')
    .replaceAll('÷', '/')
    .replaceAll('−', '-')
    .replaceAll('π', 'pi')

  if (!/^[\d\s.+\-*/^(),a-zA-Z]*$/.test(normalized)) {
    throw new Error('Invalid expression')
  }

  const names = normalized.match(/[a-zA-Z]+/g) || []
  if (names.some((name) => !allowedNames.has(name.toLowerCase()))) {
    throw new Error('Unknown function')
  }

  const angleScale = angleMode === 'DEG' ? Math.PI / 180 : 1
  const scope = {
    sin: (value) => math.sin(value * angleScale),
    cos: (value) => math.cos(value * angleScale),
    tan: (value) => math.tan(value * angleScale),
    ln: (value) => math.log(value),
    log: (value) => math.log10(value),
  }
  const result = math.evaluate(normalized, scope)

  if (typeof result !== 'number' || !Number.isFinite(result)) {
    throw new Error('Result is not a finite real number')
  }

  return Number(result.toPrecision(12))
}