import { useEffect, useState } from 'react'
import './App.css'
import Wrapper from './components/Wrapper'
import Screen from './components/Screen'
import ButtonBox from './components/ButtonBox'
import Button from './components/Button'
import ScientificCalculator from './components/ScientificCalculator'

const btnValues = [
  ['C', 'DEL', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['±', '0', '.', '='],
];

const operatorSymbols = {
  '+': '+',
  '−': '−',
  '×': '×',
  '÷': '÷',
};

const formatDisplay = (value) => {
  const [integer, decimal] = String(value).split('.');
  const sign = integer.startsWith('-') ? '-' : '';
  const digits = sign ? integer.slice(1) : integer;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return `${sign}${grouped}${decimal === undefined ? '' : `.${decimal}`}`;
};

const calculate = (first, second, operator) => {
  switch (operator) {
    case '+': return first + second;
    case '−': return first - second;
    case '×': return first * second;
    case '÷': return second === 0 ? null : first / second;
    default: return second;
  }
};

const App = () => {
  const [mode, setMode] = useState('basic');
  const [angleMode, setAngleMode] = useState('DEG');
  const [scientific, setScientific] = useState({ expression: '', result: null, error: '' });
  const [calc, setCalc] = useState({
    display: '0',
    storedValue: null,
    operator: null,
    waitingForOperand: false,
    expression: '',
    error: false,
  });

  const enterDigit = (digit) => {
    setCalc((current) => {
      const startNew = current.waitingForOperand || current.error || current.display === '0' || current.display === '-0';
      const next = startNew
        ? `${current.display === '-0' && digit !== '0' ? '-' : ''}${digit}`
        : current.display.length < 16 ? `${current.display}${digit}` : current.display;

      return {
        ...current,
        display: next,
        waitingForOperand: false,
        expression: '',
        error: false,
      };
    });
  };

  const enterDecimal = () => {
    setCalc((current) => {
      if (current.error) {
        return { ...current, display: '0.', error: false, waitingForOperand: false, expression: '' };
      }
      if (current.waitingForOperand) {
        return { ...current, display: '0.', waitingForOperand: false, expression: '' };
      }
      if (current.display.includes('.')) return current;

      return { ...current, display: `${current.display}.`, expression: '' };
    });
  };

  const chooseOperator = (operator) => {
    setCalc((current) => {
      if (current.error) return current;

      let storedValue = current.storedValue;
      let display = current.display;

      if (current.operator && !current.waitingForOperand) {
        const result = calculate(current.storedValue, Number(current.display), current.operator);
        if (result === null) {
          return { ...current, display: 'Cannot divide by zero', expression: '', error: true, operator: null, storedValue: null };
        }
        storedValue = Number(result.toPrecision(12));
        display = String(storedValue);
      } else if (current.operator && current.waitingForOperand) {
        display = String(storedValue);
      } else if (storedValue === null) {
        storedValue = Number(current.display);
      }

      return {
        ...current,
        display: '0',
        storedValue,
        operator,
        waitingForOperand: true,
        expression: `${formatDisplay(display)} ${operatorSymbols[operator]}`,
      };
    });
  };

  const evaluate = () => {
    setCalc((current) => {
      if (!current.operator || current.storedValue === null) return current;

      const secondValue = current.waitingForOperand ? current.storedValue : Number(current.display);
      const result = calculate(current.storedValue, secondValue, current.operator);
      if (result === null) {
        return { ...current, display: 'Cannot divide by zero', expression: '', error: true, operator: null, storedValue: null };
      }

      const roundedResult = Number(result.toPrecision(12));
      return {
        ...current,
        display: String(roundedResult),
        storedValue: null,
        operator: null,
        waitingForOperand: true,
        expression: `${formatDisplay(String(current.storedValue))} ${operatorSymbols[current.operator]} ${formatDisplay(String(secondValue))} =`,
      };
    });
  };

  const handleButton = (value) => {
    if (/^\d$/.test(value)) {
      enterDigit(value);
    } else if (value === '.') {
      enterDecimal();
    } else if (value in operatorSymbols) {
      chooseOperator(value);
    } else if (value === '=') {
      evaluate();
    } else if (value === 'C') {
      setCalc({ display: '0', storedValue: null, operator: null, waitingForOperand: false, expression: '', error: false });
    } else if (value === 'DEL') {
      setCalc((current) => {
        if (current.error) return { display: '0', storedValue: null, operator: null, waitingForOperand: false, expression: '', error: false };
        if (current.waitingForOperand) return current;
        const display = current.display.length > 1 ? current.display.slice(0, -1) : '0';
        return { ...current, display: display === '-' ? '0' : display, expression: '' };
      });
    } else if (value === '±') {
      setCalc((current) => {
        if (current.error) return current;
        const number = Number(current.display) * -1;
        return { ...current, display: Object.is(number, -0) ? '-0' : String(number), waitingForOperand: false, expression: '' };
      });
    } else if (value === '%') {
      setCalc((current) => {
        if (current.error) return current;
        const result = Number(current.display) / 100;
        return { ...current, display: String(result), waitingForOperand: false, expression: '' };
      });
    }
  };

  const evaluateScientific = async () => {
    try {
      const { evaluateScientificExpression } = await import('./math/scientific');
      const result = evaluateScientificExpression(scientific.expression, angleMode);
      setScientific((current) => ({ ...current, result, error: '' }));
    } catch {
      setScientific((current) => ({ ...current, result: null, error: 'Check expression' }));
    }
  };

  const handleScientificButton = (value) => {
    if (value === 'ANGLE') {
      setAngleMode((current) => current === 'DEG' ? 'RAD' : 'DEG');
      return;
    }
    if (value === 'C') {
      setScientific({ expression: '', result: null, error: '' });
      return;
    }
    if (value === '=') {
      evaluateScientific();
      return;
    }

    setScientific((current) => {
      const binaryOperator = ['+', '-', '*', '/', '^'].includes(value);
      const expression = current.result !== null && binaryOperator
        ? String(current.result)
        : current.result !== null && /^\d$/.test(value)
          ? ''
          : current.result !== null
            ? String(current.result)
            : current.expression;

      if (value === 'DEL') {
        return { expression: expression.slice(0, -1), result: null, error: '' };
      }

      return {
        expression: appendScientificInput(expression, value),
        result: null,
        error: '',
      };
    });
  };

  const handleScientificChange = (expression) => {
    setScientific({ expression, result: null, error: '' });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (mode === 'scientific' && event.target instanceof HTMLInputElement) return;

      const keyMap = {
        Enter: '=',
        '=': '=',
        Backspace: 'DEL',
        Escape: 'C',
        '*': '×',
        x: '×',
        X: '×',
        '/': '÷',
        '-': '−',
      };
      const value = keyMap[event.key] || event.key;

      if (mode === 'scientific') {
        const scientificKey = { '−': '-', '×': '*', '÷': '/' }[value] || value;
        if (/^\d$/.test(value) || ['.', '+', '-', '*', '/', '^', '(', ')'].includes(scientificKey)) {
          event.preventDefault();
          handleScientificButton(scientificKey);
        }
        return;
      }

      if (/^\d$/.test(value) || ['.', '%', '+', '−', '×', '÷', '=', 'DEL', 'C'].includes(value)) {
        event.preventDefault();
        handleButton(value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

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
      <div className="calculator-panel" key={mode}>
        {mode === 'basic' ? (
          <Wrapper>
            <Screen value={calc.error ? calc.display : formatDisplay(calc.display)} expression={calc.expression} />
            <ButtonBox>
              {btnValues.flat().map((button) => {
                const classNames = [
                  ['+', '−', '×', '÷'].includes(button) ? 'operator' : '',
                  button === '=' ? 'equals' : '',
                  ['C', 'DEL', '%', '±'].includes(button) ? 'utility' : '',
                  calc.operator === button ? 'active' : '',
                ].filter(Boolean).join(' ');

                return (
                  <Button
                    key={button}
                    className={classNames}
                    value={button}
                    ariaLabel={button === 'DEL' ? 'Backspace' : button === '±' ? 'Change sign' : button}
                    onClick={() => handleButton(button)}
                  />
                );
              })}
            </ButtonBox>
          </Wrapper>
        ) : (
          <Wrapper className="scientific-wrapper">
            <ScientificCalculator
              expression={scientific.expression}
              result={scientific.result}
              error={scientific.error}
              angleMode={angleMode}
              onAngleModeChange={() => handleScientificButton('ANGLE')}
              onExpressionChange={handleScientificChange}
              onButton={handleScientificButton}
            />
          </Wrapper>
        )}
      </div>
    </main>
  );
};

const appendScientificInput = (expression, value) => {
  const endsWithValue = /(?:\d|\)|pi|e)$/i.test(expression.trim());
  const multiplication = endsWithValue ? '*' : '';

  if (['sin', 'cos', 'tan', 'ln', 'log', '√'].includes(value)) {
    const functionName = value === '√' ? 'sqrt' : value;
    if (expression && endsWithValue) return `${functionName}(${expression})`;
    return `${expression}${multiplication}${functionName}(`;
  }
  if (value === 'π' || value === 'e') return `${expression}${multiplication}${value === 'π' ? 'pi' : 'e'}`;
  if (value === 'x²') return expression ? `(${expression})^2` : '0^2';
  if (value === 'xʸ') return `${expression}^`;
  if (value === '1/x') return expression ? `1/(${expression})` : '1/(';
  if (value === '±') return expression ? `-(${expression})` : '-';
  if (value === '%') return expression ? `(${expression})/100` : '0.01';
  if (value === '.') {
    const currentNumber = expression.match(/(?:^|[+\-*/^(])\s*(\d*\.)?\d*$/);
    if (currentNumber?.[0].includes('.')) return expression;
    return `${expression}${endsWithValue ? '*' : ''}0.`;
  }
  if (/^\d$/.test(value) && /(?:\)|pi|e)$/i.test(expression.trim())) return `${expression}*${value}`;
  if (value === ')' && (expression.match(/\(/g) || []).length <= (expression.match(/\)/g) || []).length) return expression;
  return `${expression}${value}`;
};

export default App;
