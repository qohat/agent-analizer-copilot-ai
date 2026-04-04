/**
 * Debug test to understand navigation issues
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MultiStepForm } from '@/components/MultiStepForm'
import '@testing-library/jest-dom'

describe('Debug Navigation', () => {
  it('should be able to fill Step 1 and navigate', async () => {
    render(<MultiStepForm />)

    // Verify we start on Step 1
    expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()

    // Fill required fields
    const montoInput = screen.getByLabelText(/monto del crédito solicitado/i)
    const plazoSelect = screen.getByLabelText(/plazo del crédito/i)
    const destinoTextarea = screen.getByLabelText(/destino del crédito/i)
    const frecuenciaRadio = screen.getByRole('radio', { name: /mensual/i })

    fireEvent.input(montoInput, { target: { value: '5000000' } })
    fireEvent.change(plazoSelect, { target: { value: '12' } })
    fireEvent.change(destinoTextarea, {
      target: { value: 'Capital de trabajo para compra de inventario' },
    })
    fireEvent.click(frecuenciaRadio)

    // Wait for all values to be set
    await waitFor(() => {
      expect(montoInput).toHaveValue('5000000')
    })

    // Click next button
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    fireEvent.click(nextButton)

    // Wait for navigation with longer timeout
    await waitFor(
      () => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      },
      { timeout: 10000 }
    )
  }, 15000) // Increase Jest timeout
})
