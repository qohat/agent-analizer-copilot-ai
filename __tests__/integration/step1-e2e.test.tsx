/**
 * E2E Test for Step 1: Datos de la Solicitud
 *
 * Tests the complete flow:
 * 1. Render MultiStepForm
 * 2. Fill Step 1 fields
 * 3. Validate data
 * 4. Navigate to Step 2
 * 5. Verify data persistence
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MultiStepForm } from '@/components/MultiStepForm'
import '@testing-library/jest-dom'

describe('Step 1 E2E - Datos de la Solicitud', () => {
  describe('✅ Complete flow - Valid data', () => {
    it('should complete Step 1 and navigate to Step 2', async () => {
      render(<MultiStepForm />)

      // Verify we're on Step 1
      expect(screen.getByText(/Datos de la Solicitud/i)).toBeInTheDocument()
      expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()

      // Fill required fields
      const valorInput = screen.getByLabelText(/monto del crédito solicitado/i)
      const cuotasSelect = screen.getByLabelText(/plazo del crédito/i)
      const destinoTextarea = screen.getByLabelText(/destino del crédito/i)

      fireEvent.input(valorInput, { target: { value: '5000000' } })
      fireEvent.change(cuotasSelect, { target: { value: '12' } })
      fireEvent.change(destinoTextarea, {
        target: { value: 'Capital de trabajo para compra de inventario' }
      })

      // Select frecuencia - using the radio button approach
      const frecuenciaMensual = screen.getByRole('radio', { name: /mensual/i })
      fireEvent.click(frecuenciaMensual)

      // Wait for validation to complete
      await waitFor(() => {
        expect(valorInput).toHaveValue('5000000')
      })

      // Verify simulador shows calculations
      expect(screen.getByText(/Simulación del crédito/i)).toBeInTheDocument()
      expect(screen.getByText(/Cuota estimada/i)).toBeInTheDocument()

      // Click next button
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      expect(nextButton).not.toBeDisabled()

      fireEvent.click(nextButton)

      // Wait for navigation to Step 2
      await waitFor(() => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should persist data when navigating back from Step 2', async () => {
      render(<MultiStepForm />)

      // Fill Step 1
      const valorInput = screen.getByLabelText(/monto del crédito solicitado/i)
      fireEvent.input(valorInput, { target: { value: '15000000' } })

      const cuotasSelect = screen.getByLabelText(/plazo del crédito/i)
      fireEvent.change(cuotasSelect, { target: { value: '24' } })

      const destinoTextarea = screen.getByLabelText(/destino del crédito/i)
      fireEvent.change(destinoTextarea, {
        target: { value: 'Expansión del negocio y compra de equipos' }
      })

      const frecuenciaQuincenal = screen.getByRole('radio', { name: /quincenal/i })
      fireEvent.click(frecuenciaQuincenal)

      // Navigate to Step 2
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      })

      // Navigate back to Step 1
      const backButton = screen.getByRole('button', { name: /atrás/i })
      fireEvent.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()
      })

      // Verify data persisted
      const persistedValor = screen.getByLabelText(/monto del crédito solicitado/i)
      expect(persistedValor).toHaveValue('15000000')

      const persistedDestino = screen.getByLabelText(/destino del crédito/i)
      expect(persistedDestino).toHaveValue('Expansión del negocio y compra de equipos')
    })

    it('should handle optional diaPagoCuota field', async () => {
      render(<MultiStepForm />)

      // Fill required fields first
      fireEvent.input(screen.getByLabelText(/monto del crédito solicitado/i), {
        target: { value: '10000000' }
      })
      fireEvent.change(screen.getByLabelText(/plazo del crédito/i), {
        target: { value: '18' }
      })
      fireEvent.change(screen.getByLabelText(/destino del crédito/i), {
        target: { value: 'Inversión en maquinaria agrícola' }
      })

      // Select mensual to show diaPagoCuota
      const frecuenciaMensual = screen.getByRole('radio', { name: /mensual/i })
      fireEvent.click(frecuenciaMensual)

      // Wait for conditional field to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/día de pago preferido/i)).toBeInTheDocument()
      })

      // Fill optional field
      const diaPagoInput = screen.getByLabelText(/día de pago preferido/i)
      fireEvent.input(diaPagoInput, { target: { value: '15' } })

      expect(diaPagoInput).toHaveValue('15')

      // Should still be able to navigate
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      })
    })
  })

  describe('❌ Validation blocking navigation', () => {
    it('should not navigate to Step 2 with invalid data', async () => {
      render(<MultiStepForm />)

      // Try to navigate without filling required fields
      const nextButton = screen.getByRole('button', { name: /siguiente/i })

      // Button should be disabled or show errors
      fireEvent.click(nextButton)

      // Should stay on Step 1
      await waitFor(() => {
        expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()
      })

      // Should show validation errors
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })

    it('should show error for amount below minimum', async () => {
      render(<MultiStepForm />)

      const valorInput = screen.getByLabelText(/monto del crédito solicitado/i)
      fireEvent.input(valorInput, { target: { value: '400000' } }) // Below 500k minimum

      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        const minError = alerts.find(alert => alert.textContent?.includes('mínimo'))
        expect(minError).toBeInTheDocument()
      })

      // Should not navigate
      expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()
    })

    it('should show error for invalid cuotas', async () => {
      render(<MultiStepForm />)

      const valorInput = screen.getByLabelText(/monto del crédito solicitado/i)
      fireEvent.input(valorInput, { target: { value: '5000000' } })

      const cuotasSelect = screen.getByLabelText(/plazo del crédito/i)
      fireEvent.change(cuotasSelect, { target: { value: '2' } }) // Below minimum

      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })

      // Should not navigate
      expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()
    })

    it('should show error for short destino', async () => {
      render(<MultiStepForm />)

      const valorInput = screen.getByLabelText(/monto del crédito solicitado/i)
      fireEvent.input(valorInput, { target: { value: '5000000' } })

      const cuotasSelect = screen.getByLabelText(/plazo del crédito/i)
      fireEvent.change(cuotasSelect, { target: { value: '12' } })

      const destinoTextarea = screen.getByLabelText(/destino del crédito/i)
      fireEvent.change(destinoTextarea, { target: { value: 'Corto' } }) // Too short

      const frecuenciaMensual = screen.getByRole('radio', { name: /mensual/i })
      fireEvent.click(frecuenciaMensual)

      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        const minError = alerts.find(alert => alert.textContent?.includes('mínimo 10'))
        expect(minError).toBeInTheDocument()
      })

      // Should not navigate
      expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()
    })
  })

  describe('🎨 UI and UX', () => {
    it('should show simulador when values are entered', async () => {
      render(<MultiStepForm />)

      const valorInput = screen.getByLabelText(/monto del crédito solicitado/i)
      const cuotasSelect = screen.getByLabelText(/plazo del crédito/i)

      fireEvent.input(valorInput, { target: { value: '10000000' } })
      fireEvent.change(cuotasSelect, { target: { value: '24' } })

      await waitFor(() => {
        expect(screen.getByText(/Simulación del crédito/i)).toBeInTheDocument()
        expect(screen.getByText(/Cuota estimada/i)).toBeInTheDocument()
        expect(screen.getByText(/Total a pagar/i)).toBeInTheDocument()
      })
    })

    it('should show character counter for destino', async () => {
      render(<MultiStepForm />)

      const destinoTextarea = screen.getByLabelText(/destino del crédito/i)

      // Initial state
      expect(screen.getByText(/0\/200 caracteres/i)).toBeInTheDocument()

      // Type something
      fireEvent.change(destinoTextarea, {
        target: { value: 'Capital de trabajo' }
      })

      await waitFor(() => {
        expect(screen.getByText(/19\/200 caracteres/i)).toBeInTheDocument()
      })
    })

    it('should show day of payment only for mensual/quincenal frequency', async () => {
      render(<MultiStepForm />)

      // Initially should not show day of payment
      expect(screen.queryByLabelText(/día de pago preferido/i)).not.toBeInTheDocument()

      // Select mensual
      const frecuenciaMensual = screen.getByRole('radio', { name: /mensual/i })
      fireEvent.click(frecuenciaMensual)

      await waitFor(() => {
        expect(screen.getByLabelText(/día de pago preferido/i)).toBeInTheDocument()
      })

      // Change to semanal
      const frecuenciaSemanal = screen.getByRole('radio', { name: /semanal/i })
      fireEvent.click(frecuenciaSemanal)

      await waitFor(() => {
        expect(screen.queryByLabelText(/día de pago preferido/i)).not.toBeInTheDocument()
      })
    })

    it('should display progress indicator', () => {
      render(<MultiStepForm />)

      // Should show step indicator
      expect(screen.getByText(/Paso 1 de 11/i)).toBeInTheDocument()

      // Should show progress text
      const stepText = screen.getByText(/Paso 1 de 11/i)
      expect(stepText).toBeVisible()
    })
  })
})
