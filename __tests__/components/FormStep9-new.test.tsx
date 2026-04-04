/**
 * Tests for FormStep9New Component - Ingresos y Gastos
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStep9New } from '@/components/FormSteps6-11'
import { step9IngresosGastosSchema } from '@/lib/validation/step6-11-schemas'
import '@testing-library/jest-dom'

function FormStep9Wrapper() {
  const methods = useForm({
    resolver: zodResolver(step9IngresosGastosSchema),
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <FormStep9New />
    </FormProvider>
  )
}

describe('FormStep9New - Ingresos y Gastos', () => {
  describe('✅ Rendering', () => {
    it('should render form title', () => {
      render(<FormStep9Wrapper />)

      expect(screen.getByText(/Ingresos y Gastos Mensuales/i)).toBeInTheDocument()
    })

    it('should render ingresos section', () => {
      render(<FormStep9Wrapper />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      const ingresosHeading = headings.find(h => h.textContent?.match(/Ingresos/i))
      expect(ingresosHeading).toBeInTheDocument()
      const ingresosInputs = screen.getAllByLabelText(/Ingresos mensuales/i)
      expect(ingresosInputs.length).toBeGreaterThanOrEqual(1)
    })

    it('should render gastos section', () => {
      render(<FormStep9Wrapper />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      const gastosHeading = headings.find(h => h.textContent?.match(/Gastos/i))
      expect(gastosHeading).toBeInTheDocument()
      expect(screen.getByLabelText(/Alimentación/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Servicios públicos/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Transporte/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Salud/i)).toBeInTheDocument()
    })

    it('should mark required fields', () => {
      render(<FormStep9Wrapper />)

      const asterisks = screen.getAllByText('*')
      expect(asterisks.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('🖱️ User interactions', () => {
    it('should allow filling ingresos titular', async () => {
      render(<FormStep9Wrapper />)

      const ingresosInputs = screen.getAllByLabelText(/Ingresos mensuales/i)
      const ingresosInput = ingresosInputs[0]

      fireEvent.input(ingresosInput, { target: { value: '3000000' } })

      await waitFor(() => {
        expect(ingresosInput).toHaveValue('3000000')
      })
    })

    it('should allow filling all gastos fields', async () => {
      render(<FormStep9Wrapper />)

      fireEvent.input(screen.getByLabelText(/Alimentación/i), { target: { value: '800000' } })
      fireEvent.input(screen.getByLabelText(/Servicios públicos/i), { target: { value: '200000' } })
      fireEvent.input(screen.getByLabelText(/Transporte/i), { target: { value: '300000' } })
      fireEvent.input(screen.getByLabelText(/Salud/i), { target: { value: '150000' } })

      await waitFor(() => {
        expect(screen.getByLabelText(/Alimentación/i)).toHaveValue('800000')
      })
    })

    it('should show capacidad disponible when values entered', async () => {
      render(<FormStep9Wrapper />)

      const ingresosInputs = screen.getAllByLabelText(/Ingresos mensuales/i)
      const ingresosInput = ingresosInputs[0]
      const alimentacionInput = screen.getByLabelText(/Alimentación/i)

      fireEvent.input(ingresosInput, { target: { value: '3000000' } })
      fireEvent.input(alimentacionInput, { target: { value: '800000' } })
      fireEvent.input(screen.getByLabelText(/Servicios públicos/i), { target: { value: '200000' } })
      fireEvent.input(screen.getByLabelText(/Transporte/i), { target: { value: '300000' } })
      fireEvent.input(screen.getByLabelText(/Salud/i), { target: { value: '100000' } })

      await waitFor(() => {
        expect(screen.getByText(/Excedente Mensual/i)).toBeInTheDocument()
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<FormStep9Wrapper />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(2)
    })

    it('should have all inputs with type="text" and numeric inputmode', () => {
      render(<FormStep9Wrapper />)

      const ingresosInputs = screen.getAllByLabelText(/Ingresos mensuales/i)
      const ingresosInput = ingresosInputs[0]
      expect(ingresosInput).toHaveAttribute('type', 'text')
      expect(ingresosInput).toHaveAttribute('inputmode', 'numeric')
    })
  })

  describe('📊 Calculations', () => {
    it('should display correct excedente mensual', async () => {
      render(<FormStep9Wrapper />)

      const ingresosInputs = screen.getAllByLabelText(/Ingresos mensuales/i)
      const ingresosInput = ingresosInputs[0]

      fireEvent.input(ingresosInput, {
        target: { value: '5000000' },
      })
      fireEvent.input(screen.getByLabelText(/Alimentación/i), { target: { value: '1000000' } })
      fireEvent.input(screen.getByLabelText(/Servicios públicos/i), { target: { value: '500000' } })
      fireEvent.input(screen.getByLabelText(/Transporte/i), { target: { value: '500000' } })
      fireEvent.input(screen.getByLabelText(/Salud/i), { target: { value: '300000' } })

      await waitFor(() => {
        // Total gastos: 2,300,000
        // Excedente: 5,000,000 - 2,300,000 = 2,700,000
        expect(screen.getByText(/2,700,000/)).toBeInTheDocument()
      })
    })
  })
})
