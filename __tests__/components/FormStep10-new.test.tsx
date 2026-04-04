/**
 * Tests for FormStep10New Component - Capacidad de Pago
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStep10New } from '@/components/FormSteps6-11'
import { step10CapacidadPagoSchema } from '@/lib/validation/step6-11-schemas'
import '@testing-library/jest-dom'

function FormStep10Wrapper() {
  const methods = useForm({
    resolver: zodResolver(step10CapacidadPagoSchema),
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <FormStep10New />
    </FormProvider>
  )
}

describe('FormStep10New - Capacidad de Pago', () => {
  describe('✅ Rendering', () => {
    it('should render form title', () => {
      render(<FormStep10Wrapper />)

      expect(screen.getByRole('heading', { name: /Capacidad de Pago/i, level: 2 })).toBeInTheDocument()
      expect(screen.getByText(/Análisis de su capacidad para asumir el crédito/i)).toBeInTheDocument()
    })

    it('should render obligaciones financieras field', () => {
      render(<FormStep10Wrapper />)

      expect(screen.getByLabelText(/Obligaciones financieras actuales/i)).toBeInTheDocument()
    })

    it('should show informational panel', () => {
      render(<FormStep10Wrapper />)

      expect(screen.getByText(/Análisis de su capacidad para asumir el crédito/i)).toBeInTheDocument()
      expect(screen.getByText(/Suma de todas las cuotas de créditos actuales/i)).toBeInTheDocument()
    })

    it('should have helper text', () => {
      render(<FormStep10Wrapper />)

      expect(screen.getByText(/Suma de todas las cuotas de créditos actuales/i)).toBeInTheDocument()
    })
  })

  describe('🖱️ User interactions', () => {
    it('should allow entering obligaciones value', async () => {
      render(<FormStep10Wrapper />)

      const obligacionesInput = screen.getByLabelText(/Obligaciones financieras actuales/i)

      fireEvent.input(obligacionesInput, { target: { value: '500000' } })

      await waitFor(() => {
        expect(obligacionesInput).toHaveValue('500000')
      })
    })

    it('should accept zero value', async () => {
      render(<FormStep10Wrapper />)

      const obligacionesInput = screen.getByLabelText(/Obligaciones financieras actuales/i)

      fireEvent.input(obligacionesInput, { target: { value: '0' } })

      await waitFor(() => {
        expect(obligacionesInput).toHaveValue('0')
      })
    })

    it('should handle large values', async () => {
      render(<FormStep10Wrapper />)

      const obligacionesInput = screen.getByLabelText(/Obligaciones financieras actuales/i)

      fireEvent.input(obligacionesInput, { target: { value: '10000000' } })

      await waitFor(() => {
        expect(obligacionesInput).toHaveValue('10000000')
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<FormStep10Wrapper />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    it('should have type="text" with numeric inputmode', () => {
      render(<FormStep10Wrapper />)

      const obligacionesInput = screen.getByLabelText(/Obligaciones financieras actuales/i)
      expect(obligacionesInput).toHaveAttribute('type', 'text')
      expect(obligacionesInput).toHaveAttribute('inputmode', 'numeric')
    })

    it('should have placeholder', () => {
      render(<FormStep10Wrapper />)

      const obligacionesInput = screen.getByLabelText(/Obligaciones financieras actuales/i)
      expect(obligacionesInput).toHaveAttribute('placeholder', '0')
    })
  })
})
