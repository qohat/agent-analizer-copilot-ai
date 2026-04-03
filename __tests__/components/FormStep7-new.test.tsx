/**
 * Tests for FormStep7New Component - Bienes y Referencias
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStep7New } from '@/components/FormSteps6-11'
import { step7BienesSchema } from '@/lib/validation/step6-11-schemas'
import '@testing-library/jest-dom'

function FormStep7Wrapper() {
  const methods = useForm({
    resolver: zodResolver(step7BienesSchema),
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <FormStep7New />
    </FormProvider>
  )
}

describe('FormStep7New - Bienes y Referencias', () => {
  describe('✅ Rendering', () => {
    it('should render form title', () => {
      render(<FormStep7Wrapper />)

      expect(screen.getByRole('heading', { name: /Bienes y Referencias/i, level: 2 })).toBeInTheDocument()
    })

    it('should render all three reference sections', () => {
      render(<FormStep7Wrapper />)

      const headings = screen.getAllByRole('heading', { level: 4 })
      expect(headings.length).toBe(3)
      expect(headings[0]).toHaveTextContent(/familiar/i)
      expect(headings[1]).toHaveTextContent(/comercial/i)
      expect(headings[2]).toHaveTextContent(/personal/i)
    })

    it('should render input fields for each reference', () => {
      render(<FormStep7Wrapper />)

      const nombreInputs = screen.getAllByPlaceholderText(/nombre completo/i)
      const telefonoInputs = screen.getAllByPlaceholderText(/teléfono/i)
      const direccionInputs = screen.getAllByPlaceholderText(/dirección/i)

      expect(nombreInputs.length).toBe(3)
      expect(telefonoInputs.length).toBe(3)
      expect(direccionInputs.length).toBe(3)
    })
  })

  describe('🖱️ User interactions', () => {
    it('should allow filling reference fields', async () => {
      render(<FormStep7Wrapper />)

      const nombreInputs = screen.getAllByPlaceholderText(/nombre completo/i)

      fireEvent.change(nombreInputs[0], { target: { value: 'Juan Pérez' } })

      await waitFor(() => {
        expect(nombreInputs[0]).toHaveValue('Juan Pérez')
      })
    })

    it('should allow filling all three references', async () => {
      render(<FormStep7Wrapper />)

      const nombreInputs = screen.getAllByPlaceholderText(/nombre completo/i)
      const telefonoInputs = screen.getAllByPlaceholderText(/teléfono/i)

      fireEvent.change(nombreInputs[0], { target: { value: 'Ref Familiar' } })
      fireEvent.change(telefonoInputs[0], { target: { value: '3001234567' } })

      fireEvent.change(nombreInputs[1], { target: { value: 'Ref Comercial' } })
      fireEvent.change(telefonoInputs[1], { target: { value: '3007654321' } })

      await waitFor(() => {
        expect(nombreInputs[0]).toHaveValue('Ref Familiar')
        expect(nombreInputs[1]).toHaveValue('Ref Comercial')
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<FormStep7Wrapper />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })
})
