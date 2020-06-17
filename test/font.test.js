import test from 'ava'
import Font from '../src/font'

test('font defaults', t => {
  const font = Font()
  t.is(font.family, 'monospace')
  t.is(font.weight, 'normal')
  t.is(font.size, 16)
  t.is(font.toCSS(), 'normal 16px monospace')
})

test('set family', t => {
  const font = Font('Letter Gothic')
  t.is(font.family, 'Letter Gothic')
  t.is(font.weight, 'normal')
  t.is(font.size, 16)
  t.is(font.toCSS(), 'normal 16px Letter Gothic')
})

test('set weight', t => {
  const font = Font(null, 'bold')
  t.is(font.family, 'monospace')
  t.is(font.weight, 'bold')
  t.is(font.size, 16)
  t.is(font.toCSS(), 'bold 16px monospace')
})

test('set size', t => {
  const font = Font(null, null, 18)
  t.is(font.family, 'monospace')
  t.is(font.weight, 'normal')
  t.is(font.size, 18)
  t.is(font.toCSS(), 'normal 18px monospace')
})
