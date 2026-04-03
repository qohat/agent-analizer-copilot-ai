/**
 * Tests for FormStep11New Component - Resumen y Envío
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStep11New } from '@/components/FormSteps6-11'
import { step11ResumenSchema } from '@/lib/validation/step6-11-schemas'
import '@testing-library/jest-dom'

function FormStep11Wrapper() {
  const methods = useForm({
    resolver: zodResolver(step11ResumenSchema),
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <FormStep11New />
    </FormProvider>
  )
}

describe('FormStep11New - Resumen y Envío', () => {
  describe('✅ Rendering', () => {
    it('should render form title', () => {
      render(<FormStep11Wrapper />)

      expect(screen.getByText(/Resumen y Envío/i)).toBeInTheDocument()
      expect(screen.getByText(/Revise la información antes de enviar/i)).toBeInTheDocument()
    })

    it('should render solicitud completa panel', () => {
      render(<FormStep11Wrapper />)

      expect(screen.getByText(/Solicitud completa/i)).toBeInTheDocument()
      expect(screen.getByText(/Ha completado todos los pasos/i)).toBeInTheDocument()
    })

    it('should render confirmation checkbox', () => {
      render(<FormStep11Wrapper />)

      expect(screen.getByLabelText(/Confirmo que/i)).toBeInTheDocument()
      expect(screen.getByText(/Toda la información proporcionada es verdadera/i)).toBeInTheDocument()
    })

    it('should show próximos pasos section', () => {
      render(<FormStep11Wrapper />)

      expect(screen.getByText(/Próximos pasos/i)).toBeInTheDocument()
      expect(screen.getByText(/será revisada por un asesor/i)).toBeInTheDocument()
    })
  })

  describe('🖱️ User interactions', () => {
    it('should allow checking confirmation checkbox', async () => {
      render(<FormStep11Wrapper />)

      const checkbox = screen.getByLabelText(/Confirmo que/i)

      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(checkbox).toBeChecked()
      })
    })

    it('should allow unchecking confirmation', async () => {
      render(<FormStep11Wrapper />)

      const checkbox = screen.getByLabelText(/Confirmo que/i)

      fireEvent.click(checkbox)
      await waitFor(() => expect(checkbox).toBeChecked())

      fireEvent.click(checkbox)
      await waitFor(() => {
        expect(checkbox).not.toBeChecked()
      })
    })
  })

  describe('❌ Validation', () => {
    it('should show error if confirmation not checked', async () => {
      function FormWithError() {
        const methods = useForm({
          resolver: zodResolver(step11ResumenSchema),
          mode: 'onChange',
        })

        React.useEffect(() => {
          methods.setError('confirmacion', {
            type: 'manual',
            message: 'Debe confirmar que la información es correcta',
          })
        }, [methods])

        return (
          <FormProvider {...methods}>
            <FormStep11New />
          </FormProvider>
        )
      }

      render(<FormWithError />)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<FormStep11Wrapper />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(1)
    })

    it('should have checkbox with proper label', () => {
      render(<FormStep11Wrapper />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('id', 'confirmacion')
    })

    it('should use role="alert" for errors', async () => {
      function FormWithError() {
        const methods = useForm({
          resolver: zodResolver(step11ResumenSchema),
          mode: 'onChange',
        })

        React.useEffect(() => {
          methods.setError('confirmacion', {
            type: 'manual',
            message: 'Error test',
          })
        }, [methods])

        return (
          <FormProvider {...methods}>
            <FormStep11New />
          </FormProvider>
        )
      }

      render(<FormWithError />)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })
  })

  describe('📋 Content', () => {
    it('should list all próximos pasos', () => {
      render(<FormStep11Wrapper />)

      expect(screen.getByText(/será revisada por un asesor/i)).toBeInTheDocument()
      expect(screen.getByText(/Recibirá notificación/i)).toBeInTheDocument()
      expect(screen.getByText(/Si es aprobada/i)).toBeInTheDocument()
    })

    it('should display confirmation terms', () => {
      render(<FormStep11Wrapper />)

      expect(screen.getByText(/verdadera y completa/i)).toBeInTheDocument()
      expect(screen.getByText(/Autorizo la verificación/i)).toBeInTheDocument()
    })
  })
})
