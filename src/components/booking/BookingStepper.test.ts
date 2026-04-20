import { describe, it, expect } from 'vitest'
import { labels } from './bookingConstants'

describe('BookingStepper labels', () => {
  it('tem os labels corretos', () => {
    expect(labels).toEqual(['Serviço', 'Data', 'Horário'])
  })
})
