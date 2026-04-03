/**
 * Tests for FormStep8New Component - Balance General
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStep8New } from '@/components/FormSteps6-11'
import { step8BalanceSchema } from '@/lib/validation/step6-11-schemas'
import '@testing-library/jest-dom'

function FormStep8Wrapper() {
  const methods = useForm({
    resolver: zodResolver(step8BalanceSchema),
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <FormStep8New />
    </FormProvider>
  )
}

describe('FormStep8New - Balance General', () => {
  describe('✅ Rendering', () => {
    it('should render form title', () => {
      render(<FormStep8Wrapper />)

      expect(screen.getByText(/Balance General/i)).toBeInTheDocument()
      expect(screen.getByText(/Activos y pasivos del negocio/i)).toBeInTheDocument()
    })

    it('should render activos section', () => {
      render(<FormStep8Wrapper />)

      expect(screen.getByText(/Activos Corrientes/i)).toBeInTheDocument()
    })

    it('should render pasivos section', () => {
      render(<FormStep8Wrapper />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      const pasivosHeading = headings.find(h => h.textContent?.match(/Pasivos/i))
      expect(pasivosHeading).toBeInTheDocument()
    })

    it('should render negocio and familiar inputs', () => {
      render(<FormStep8Wrapper />)

      expect(screen.getByPlaceholderText(/Caja \(negocio\)/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Caja \(familiar\)/i)).toBeInTheDocument()
    })
  })

  describe('🖱️ User interactions', () => {
    it('should allow filling activos values', async () => {
      render(<FormStep8Wrapper />)

      const cajaNegocio = screen.getByPlaceholderText(/Caja \(negocio\)/i)

      fireEvent.change(cajaNegocio, { target: { value: '5000000' } })

      await waitFor(() => {
        expect(cajaNegocio).toHaveValue(5000000)
      })
    })

    it('should allow filling pasivos values', async () => {
      render(<FormStep8Wrapper />)

      const proveedoresNegocio = screen.getByPlaceholderText(/Proveedores \(negocio\)/i)

      fireEvent.change(proveedoresNegocio, { target: { value: '1000000' } })

      await waitFor(() => {
        expect(proveedoresNegocio).toHaveValue(1000000)
      })
    })

    it('should handle numeric inputs', async () => {
      render(<FormStep8Wrapper />)

      const inputs = screen.getAllByPlaceholderText(/\(negocio\)/i)

      fireEvent.change(inputs[0], { target: { value: '123456' } })

      await waitFor(() => {
        expect(inputs[0]).toHaveValue(123456)
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading levels', () => {
      render(<FormStep8Wrapper />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0)
    })

    it('should have type="number" for all inputs', () => {
      render(<FormStep8Wrapper />)

      const cajaNegocio = screen.getByPlaceholderText(/Caja \(negocio\)/i)
      expect(cajaNegocio).toHaveAttribute('type', 'number')
    })
  })
})
