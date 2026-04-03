/**
 * Tests for FormStep6New Component - Datos del Cónyuge
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStep6New } from '@/components/FormSteps6-11'
import { step6ConyugeSchema } from '@/lib/validation/step6-11-schemas'
import '@testing-library/jest-dom'

function FormStep6Wrapper() {
  const methods = useForm({
    resolver: zodResolver(step6ConyugeSchema),
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <FormStep6New />
    </FormProvider>
  )
}

describe('FormStep6New - Datos del Cónyuge', () => {
  describe('✅ Rendering', () => {
    it('should render form title and description', () => {
      render(<FormStep6Wrapper />)

      expect(screen.getByText(/Datos del Cónyuge/i)).toBeInTheDocument()
      expect(screen.getByText(/solo si está casado o en unión libre/i)).toBeInTheDocument()
    })

    it('should render conyuge firma checkbox', () => {
      render(<FormStep6Wrapper />)

      expect(screen.getByLabelText(/codeudor/i)).toBeInTheDocument()
    })

    it('should render name fields', () => {
      render(<FormStep6Wrapper />)

      expect(screen.getByText(/primer nombre/i)).toBeInTheDocument()
      expect(screen.getByText(/primer apellido/i)).toBeInTheDocument()
    })
  })

  describe('🖱️ User interactions', () => {
    it('should allow filling name fields', async () => {
      const { container } = render(<FormStep6Wrapper />)

      const nombreInput = container.querySelector('#conyugePrimerNombre')
      const apellidoInput = container.querySelector('#conyugePrimerApellido')

      fireEvent.change(nombreInput!, { target: { value: 'María' } })
      fireEvent.change(apellidoInput!, { target: { value: 'Rodríguez' } })

      await waitFor(() => {
        expect(nombreInput).toHaveValue('María')
        expect(apellidoInput).toHaveValue('Rodríguez')
      })
    })

    it('should allow checking codeudor checkbox', async () => {
      render(<FormStep6Wrapper />)

      const checkbox = screen.getByLabelText(/codeudor/i)
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(checkbox).toBeChecked()
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have accessible form elements', () => {
      render(<FormStep6Wrapper />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })
  })
})
