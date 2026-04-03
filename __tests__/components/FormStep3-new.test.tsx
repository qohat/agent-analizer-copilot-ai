/**
 * Tests for FormStep3New Component
 *
 * Tests cover:
 * - Rendering all sections and fields
 * - User interactions
 * - Validation errors
 * - Calculated fields (age)
 * - Accessibility
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStep3New } from '@/components/FormStep3New'
import { step3DatosPersonalesSchema } from '@/lib/validation/step3-datos-personales.schema'
import '@testing-library/jest-dom'

// Wrapper component
function FormStep3Wrapper() {
  const methods = useForm({
    resolver: zodResolver(step3DatosPersonalesSchema),
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <FormStep3New />
    </FormProvider>
  )
}

describe('FormStep3New - Datos Personales', () => {
  describe('✅ Rendering', () => {
    it('should render all section headers', () => {
      render(<FormStep3Wrapper />)

      expect(screen.getByText(/Datos Personales del Solicitante/i)).toBeInTheDocument()
      expect(screen.getByText(/Identificación/i)).toBeInTheDocument()
      expect(screen.getByText(/Información de Contacto/i)).toBeInTheDocument()
      expect(screen.getByText(/Información Adicional/i)).toBeInTheDocument()
    })

    it('should render all required fields with asterisk', () => {
      render(<FormStep3Wrapper />)

      const asterisks = screen.getAllByText('*')
      // 11 required fields
      expect(asterisks.length).toBeGreaterThanOrEqual(11)
    })

    it('should render identification fields', () => {
      render(<FormStep3Wrapper />)

      expect(screen.getByLabelText(/tipo de documento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/número de documento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/primer nombre/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/segundo nombre/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/primer apellido/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/segundo apellido/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nacionalidad/i)).toBeInTheDocument()
    })

    it('should render contact fields', () => {
      render(<FormStep3Wrapper />)

      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/número celular/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/teléfono fijo/i)).toBeInTheDocument()
    })

    it('should render additional info fields', () => {
      render(<FormStep3Wrapper />)

      expect(screen.getByLabelText(/ocupación/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nivel educativo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/estado civil/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/género/i)).toBeInTheDocument()
    })
  })

  describe('🖱️ User interactions', () => {
    it('should allow filling all required fields', async () => {
      render(<FormStep3Wrapper />)

      // Fill identification
      fireEvent.change(screen.getByLabelText(/número de documento/i), {
        target: { value: '1234567890' },
      })
      fireEvent.change(screen.getByLabelText(/primer nombre/i), {
        target: { value: 'Juan' },
      })
      fireEvent.change(screen.getByLabelText(/primer apellido/i), {
        target: { value: 'García' },
      })
      fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
        target: { value: '1990-05-15' },
      })

      // Fill contact
      fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
        target: { value: 'juan.garcia@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/número celular/i), {
        target: { value: '3001234567' },
      })

      // Fill additional info
      fireEvent.change(screen.getByLabelText(/ocupación/i), {
        target: { value: 'Comerciante' },
      })
      fireEvent.change(screen.getByLabelText(/nivel educativo/i), {
        target: { value: 'universidad' },
      })
      fireEvent.change(screen.getByLabelText(/estado civil/i), {
        target: { value: 'soltero' },
      })
      fireEvent.change(screen.getByLabelText(/género/i), {
        target: { value: 'masculino' },
      })

      // Verify values
      await waitFor(() => {
        expect(screen.getByLabelText(/número de documento/i)).toHaveValue('1234567890')
        expect(screen.getByLabelText(/primer nombre/i)).toHaveValue('Juan')
      })
    })

    it('should show age when valid birth date is entered', async () => {
      render(<FormStep3Wrapper />)

      const fechaNacimiento = screen.getByLabelText(/fecha de nacimiento/i)
      fireEvent.change(fechaNacimiento, {
        target: { value: '1990-01-01' },
      })

      await waitFor(() => {
        expect(screen.getByText(/Edad:/i)).toBeInTheDocument()
      })
    })

    it('should allow filling optional fields', async () => {
      render(<FormStep3Wrapper />)

      fireEvent.change(screen.getByLabelText(/segundo nombre/i), {
        target: { value: 'Carlos' },
      })
      fireEvent.change(screen.getByLabelText(/segundo apellido/i), {
        target: { value: 'López' },
      })
      fireEvent.change(screen.getByLabelText(/teléfono fijo/i), {
        target: { value: '6012345678' },
      })

      await waitFor(() => {
        expect(screen.getByLabelText(/segundo nombre/i)).toHaveValue('Carlos')
      })
    })
  })

  describe('❌ Validation errors', () => {
    it('should show error for invalid cedula', async () => {
      render(<FormStep3Wrapper />)

      const cedulaInput = screen.getByLabelText(/número de documento/i)
      fireEvent.change(cedulaInput, { target: { value: '123' } })
      fireEvent.blur(cedulaInput)

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert')
        const cedulaError = alerts.find((alert) => alert.textContent?.includes('mínimo'))
        expect(cedulaError).toBeInTheDocument()
      })
    })

    it('should show error for invalid email', async () => {
      render(<FormStep3Wrapper />)

      const emailInput = screen.getByLabelText(/correo electrónico/i)
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.blur(emailInput)

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert')
        const emailError = alerts.find((alert) =>
          alert.textContent?.toLowerCase().includes('correo')
        )
        expect(emailError).toBeInTheDocument()
      })
    })

    it('should show error for invalid celular', async () => {
      render(<FormStep3Wrapper />)

      const celularInput = screen.getByLabelText(/número celular/i)
      fireEvent.change(celularInput, { target: { value: '123456' } })
      fireEvent.blur(celularInput)

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })

    it('should show error for underage person', async () => {
      render(<FormStep3Wrapper />)

      const today = new Date()
      const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())
      const fechaStr = underageDate.toISOString().split('T')[0]

      const fechaInput = screen.getByLabelText(/fecha de nacimiento/i)
      fireEvent.change(fechaInput, { target: { value: fechaStr } })
      fireEvent.blur(fechaInput)

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert')
        const ageError = alerts.find((alert) => alert.textContent?.includes('18'))
        expect(ageError).toBeInTheDocument()
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have all inputs associated with labels', () => {
      render(<FormStep3Wrapper />)

      // Check that all inputs have associated labels
      const cedulaInput = screen.getByLabelText(/número de documento/i)
      expect(cedulaInput).toBeInTheDocument()

      const emailInput = screen.getByLabelText(/correo electrónico/i)
      expect(emailInput).toBeInTheDocument()

      const celularInput = screen.getByLabelText(/número celular/i)
      expect(celularInput).toBeInTheDocument()
    })

    it('should use role="alert" for error messages', async () => {
      function FormWithError() {
        const methods = useForm({
          resolver: zodResolver(step3DatosPersonalesSchema),
          mode: 'onChange',
        })

        React.useEffect(() => {
          methods.setError('cedula', {
            type: 'manual',
            message: 'Error de prueba',
          })
        }, [methods])

        return (
          <FormProvider {...methods}>
            <FormStep3New />
          </FormProvider>
        )
      }

      render(<FormWithError />)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })

    it('should have semantic HTML headings', () => {
      render(<FormStep3Wrapper />)

      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toHaveTextContent(/Datos Personales/)

      const h3s = screen.getAllByRole('heading', { level: 3 })
      expect(h3s.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('📋 Form defaults', () => {
    it('should have "Colombiana" as default nationality', () => {
      render(<FormStep3Wrapper />)

      const nacionalidadInput = screen.getByLabelText(/nacionalidad/i)
      expect(nacionalidadInput).toHaveValue('Colombiana')
    })

    it('should have CC as default document type', () => {
      render(<FormStep3Wrapper />)

      const tipoDocSelect = screen.getByLabelText(/tipo de documento/i)
      expect(tipoDocSelect).toHaveValue('CC')
    })
  })
})
