/**
 * Tests for NEW FormStep1 Component - Datos de la Solicitud
 *
 * This component should display Step 1 fields:
 * - valorSolicitado
 * - numeroCuotas
 * - frecuencia
 * - destino
 * - diaPagoCuota (optional)
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step1SolicitudSchema } from '@/lib/validation/step1-solicitud.schema'
import '@testing-library/jest-dom'

// Mock component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    resolver: zodResolver(step1SolicitudSchema),
    mode: 'onChange',
    defaultValues: {
      valorSolicitado: undefined,
      numeroCuotas: undefined,
      frecuencia: undefined,
      destino: '',
      diaPagoCuota: undefined
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

// Simplified FormStep1 for testing (will be implemented in actual component)
function FormStep1Mock() {
  const { register, formState: { errors } } = useFormContext<any>()

  return (
    <div>
      <h2>Datos de la Solicitud</h2>

      {/* Valor Solicitado */}
      <div>
        <label htmlFor="valorSolicitado">Monto solicitado ($)</label>
        <input
          id="valorSolicitado"
          type="text"
          inputMode="numeric"
          {...register('valorSolicitado', {
            setValueAs: (v) => {
              const cleaned = String(v || '').replace(/[^0-9]/g, '')
              return cleaned === '' ? 0 : parseInt(cleaned, 10)
            },
          })}
          onInput={(e) => {
            const input = e.target as HTMLInputElement
            input.value = input.value.replace(/[^0-9]/g, '')
          }}
          data-testid="valorSolicitado"
        />
        {errors.valorSolicitado && (
          <span role="alert">{String(errors.valorSolicitado.message)}</span>
        )}
      </div>

      {/* Número de Cuotas */}
      <div>
        <label htmlFor="numeroCuotas">Número de cuotas</label>
        <input
          id="numeroCuotas"
          type="text"
          inputMode="numeric"
          {...register('numeroCuotas', {
            setValueAs: (v) => {
              const cleaned = String(v || '').replace(/[^0-9]/g, '')
              return cleaned === '' ? 0 : parseInt(cleaned, 10)
            },
          })}
          onInput={(e) => {
            const input = e.target as HTMLInputElement
            input.value = input.value.replace(/[^0-9]/g, '')
          }}
          data-testid="numeroCuotas"
        />
        {errors.numeroCuotas && (
          <span role="alert">{String(errors.numeroCuotas.message)}</span>
        )}
      </div>

      {/* Frecuencia */}
      <div>
        <label htmlFor="frecuencia">Frecuencia de pago</label>
        <select
          id="frecuencia"
          {...register('frecuencia')}
          data-testid="frecuencia"
        >
          <option value="">Seleccione...</option>
          <option value="mensual">Mensual</option>
          <option value="quincenal">Quincenal</option>
          <option value="semanal">Semanal</option>
        </select>
        {errors.frecuencia && (
          <span role="alert">{String(errors.frecuencia.message)}</span>
        )}
      </div>

      {/* Destino */}
      <div>
        <label htmlFor="destino">Destino del crédito</label>
        <textarea
          id="destino"
          {...register('destino')}
          data-testid="destino"
          placeholder="Describa el propósito del crédito..."
        />
        {errors.destino && (
          <span role="alert">{String(errors.destino.message)}</span>
        )}
      </div>

      {/* Día de Pago (opcional) */}
      <div>
        <label htmlFor="diaPagoCuota">Día de pago preferido (opcional)</label>
        <input
          id="diaPagoCuota"
          type="text"
          inputMode="numeric"
          {...register('diaPagoCuota', {
            setValueAs: (v) => {
              const cleaned = String(v || '').replace(/[^0-9]/g, '')
              return cleaned === '' ? 0 : parseInt(cleaned, 10)
            },
          })}
          onInput={(e) => {
            const input = e.target as HTMLInputElement
            input.value = input.value.replace(/[^0-9]/g, '')
          }}
          data-testid="diaPagoCuota"
        />
        {errors.diaPagoCuota && (
          <span role="alert">{String(errors.diaPagoCuota.message)}</span>
        )}
      </div>
    </div>
  )
}

// Import useFormContext at the top (missing in mock)
import { useFormContext } from 'react-hook-form'

describe('FormStep1 (New) - Datos de la Solicitud', () => {
  describe('✅ Rendering', () => {
    it('should render all required fields', () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      expect(screen.getByLabelText(/monto solicitado/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/número de cuotas/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/frecuencia de pago/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/destino del crédito/i)).toBeInTheDocument()
    })

    it('should render optional diaPagoCuota field', () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      expect(screen.getByLabelText(/día de pago preferido/i)).toBeInTheDocument()
    })

    it('should have correct input types', () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const valorInput = screen.getByTestId('valorSolicitado')
      const cuotasInput = screen.getByTestId('numeroCuotas')
      const frecuenciaSelect = screen.getByTestId('frecuencia')
      const destinoTextarea = screen.getByTestId('destino')

      expect(valorInput).toHaveAttribute('type', 'text')
      expect(valorInput).toHaveAttribute('inputmode', 'numeric')
      expect(frecuenciaSelect.tagName).toBe('SELECT')
      expect(destinoTextarea.tagName).toBe('TEXTAREA')
    })
  })

  describe('✅ User interactions', () => {
    it('should allow user to input valid data', async () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const valorInput = screen.getByTestId('valorSolicitado')
      const cuotasInput = screen.getByTestId('numeroCuotas')
      const frecuenciaSelect = screen.getByTestId('frecuencia')
      const destinoTextarea = screen.getByTestId('destino')

      fireEvent.input(valorInput, { target: { value: '5000000' } })
      fireEvent.input(cuotasInput, { target: { value: '12' } })
      fireEvent.change(frecuenciaSelect, { target: { value: 'mensual' } })
      fireEvent.change(destinoTextarea, { target: { value: 'Capital de trabajo para el negocio' } })

      await waitFor(() => {
        expect(valorInput).toHaveValue('5000000')
        expect(cuotasInput).toHaveValue('12')
        expect(frecuenciaSelect).toHaveValue('mensual')
        expect(destinoTextarea).toHaveValue('Capital de trabajo para el negocio')
      })
    })

    it('should handle optional diaPagoCuota input', async () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const diaPagoInput = screen.getByTestId('diaPagoCuota')

      fireEvent.input(diaPagoInput, { target: { value: '15' } })

      await waitFor(() => {
        expect(diaPagoInput).toHaveValue('15')
      })
    })
  })

  describe('❌ Validation errors', () => {
    it('should show error for invalid valorSolicitado (below minimum)', async () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const valorInput = screen.getByTestId('valorSolicitado')
      const submitButton = screen.getByRole('button', { name: /submit/i })

      fireEvent.change(valorInput, { target: { value: '400000' } }) // Below minimum
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        const valorError = alerts.find(alert => alert.textContent?.includes('mínimo'))
        expect(valorError).toBeInTheDocument()
      })
    })

    it('should show error for invalid numeroCuotas (below minimum)', async () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const cuotasInput = screen.getByTestId('numeroCuotas')
      const submitButton = screen.getByRole('button', { name: /submit/i })

      fireEvent.change(cuotasInput, { target: { value: '2' } }) // Below minimum
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        const cuotasError = alerts.find(alert => alert.textContent?.includes('Mínimo 3'))
        expect(cuotasError).toBeInTheDocument()
      })
    })

    it('should show error for short destino', async () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const destinoTextarea = screen.getByTestId('destino')
      const submitButton = screen.getByRole('button', { name: /submit/i })

      fireEvent.change(destinoTextarea, { target: { value: 'Corto' } }) // Too short
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        const destinoError = alerts.find(alert => alert.textContent?.includes('mínimo 10'))
        expect(destinoError).toBeInTheDocument()
      })
    })

    it('should show error for invalid diaPagoCuota', async () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const diaPagoInput = screen.getByTestId('diaPagoCuota')
      const submitButton = screen.getByRole('button', { name: /submit/i })

      fireEvent.change(diaPagoInput, { target: { value: '31' } }) // Invalid (>30)
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        const diaError = alerts.find(alert => alert.textContent?.includes('entre 1 y 30'))
        expect(diaError).toBeInTheDocument()
      })
    })
  })

  describe('📊 Accessibility', () => {
    it('should have accessible labels', () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const valorInput = screen.getByLabelText(/monto solicitado/i)
      const cuotasInput = screen.getByLabelText(/número de cuotas/i)
      const frecuenciaSelect = screen.getByLabelText(/frecuencia de pago/i)
      const destinoTextarea = screen.getByLabelText(/destino del crédito/i)

      expect(valorInput).toBeInTheDocument()
      expect(cuotasInput).toBeInTheDocument()
      expect(frecuenciaSelect).toBeInTheDocument()
      expect(destinoTextarea).toBeInTheDocument()
    })

    it('should show error messages with role="alert"', async () => {
      render(
        <TestWrapper>
          <FormStep1Mock />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton) // Submit without filling required fields

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })
  })
})
