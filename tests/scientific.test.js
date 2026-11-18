import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateScientificExpression } from '../src/math/scientific.js'

test('evaluates precedence and parentheses', () => {
  assert.equal(evaluateScientificExpression('2 + 3 * (4 - 1)'), 11)
})

test('evaluates degree and radian trigonometry', () => {
  assert.equal(evaluateScientificExpression('sin(30)', 'DEG'), 0.5)
  assert.equal(evaluateScientificExpression('sin(pi / 2)', 'RAD'), 1)
})

test('evaluates scientific functions and constants', () => {
  assert.equal(evaluateScientificExpression('sqrt(81) + log(100) + ln(e)'), 12)
  assert.equal(evaluateScientificExpression('pi * 2'), Number((Math.PI * 2).toPrecision(12)))
})

test('rejects empty, non-finite, and unsupported expressions', () => {
  assert.throws(() => evaluateScientificExpression(''))
  assert.throws(() => evaluateScientificExpression('1 / 0'))
  assert.throws(() => evaluateScientificExpression('sqrt(-1)'))
  assert.throws(() => evaluateScientificExpression('import("fs")'))
})