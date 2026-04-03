/**
 * E2E Test for Step 2: Tipo de Producto
 *
 * Tests the complete flow:
 * 1. Navigate from Step 1 to Step 2
 * 2. Select credit type
 * 3. Validate data
 * 4. Navigate to Step 3
 * 5. Verify data persistence
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MultiStepForm } from '@/components/MultiStepForm'
import '@testing-library/jest-dom'

describe('Step 2 E2E - Tipo de Producto', () => {
  /**
   * Helper function to complete Step 1 and navigate to Step 2
   */
  async function completeStep1AndNavigate() {
    render(<MultiStepForm />)

    // Fill Step 1 required fields
    const montoInput = screen.getByLabelText(/monto del crédito solicitado/i)
    fireEvent.change(montoInput, { target: { value: '5000000' } })

    const plazoSelect = screen.getByLabelText(/plazo del crédito/i)
    fireEvent.change(plazoSelect, { target: { value: '12' } })

    const destinoTextarea = screen.getByLabelText(/destino del crédito/i)
    fireEvent.change(destinoTextarea, {
      target: { value: 'Capital de trabajo para compra de inventario' },
    })

    const frecuenciaRadio = screen.getByRole('radio', { name: /mensual/i })
    fireEvent.click(frecuenciaRadio)

    // Wait for form to be valid
    await waitFor(() => {
      expect(montoInput).toHaveValue(5000000)
      expect(plazoSelect).toHaveValue('12')
      expect(frecuenciaRadio).toBeChecked()
    })

    // Navigate to Step 2
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    fireEvent.click(nextButton)

    await waitFor(
      () => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  }

  describe('✅ Navigation from Step 1 to Step 2', () => {
    it('should navigate from Step 1 to Step 2', async () => {
      await completeStep1AndNavigate()

      // Verify we're on Step 2
      expect(screen.getByText(/Tipo de Producto/i)).toBeInTheDocument()
      expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
    })

    it('should show both credit type options', async () => {
      await completeStep1AndNavigate()

      expect(screen.getByLabelText(/Crédito Comercial/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Crédito Agropecuario/i)).toBeInTheDocument()
    })
  })

  describe('✅ Complete flow - Valid data', () => {
    it('should complete Step 2 with comercial type and navigate to Step 3', async () => {
      await completeStep1AndNavigate()

      // Select comercial credit type
      const comercialRadio = screen.getByLabelText(/Crédito Comercial/i)
      fireEvent.click(comercialRadio)

      await waitFor(() => {
        expect(comercialRadio).toBeChecked()
      })

      // Verify required forms panel appears
      expect(screen.getByText(/Formularios adicionales requeridos/i)).toBeInTheDocument()
      expect(screen.getByText(/Análisis Comercial/i)).toBeInTheDocument()

      // Navigate to Step 3
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      expect(nextButton).not.toBeDisabled()

      fireEvent.click(nextButton)

      await waitFor(
        () => {
          expect(screen.getByText(/Paso 3 de 11/i)).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })

    it('should complete Step 2 with agropecuario type and navigate to Step 3', async () => {
      await completeStep1AndNavigate()

      // Select agropecuario credit type
      const agropecuarioRadio = screen.getByLabelText(/Crédito Agropecuario/i)
      fireEvent.click(agropecuarioRadio)

      await waitFor(() => {
        expect(agropecuarioRadio).toBeChecked()
      })

      // Verify required forms panel appears with both forms
      expect(screen.getByText(/Formularios adicionales requeridos/i)).toBeInTheDocument()
      expect(screen.getByText(/Flujo de Caja Agropecuario/i)).toBeInTheDocument()
      expect(screen.getByText(/Análisis Agropecuario/i)).toBeInTheDocument()

      // Verify special note for agropecuario
      expect(
        screen.getByText(/Los créditos agropecuarios requieren información adicional/i)
      ).toBeInTheDocument()

      // Navigate to Step 3
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)

      await waitFor(
        () => {
          expect(screen.getByText(/Paso 3 de 11/i)).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })

    it('should persist data when navigating back from Step 3', async () => {
      await completeStep1AndNavigate()

      // Select comercial
      const comercialRadio = screen.getByLabelText(/Crédito Comercial/i)
      fireEvent.click(comercialRadio)

      await waitFor(() => {
        expect(comercialRadio).toBeChecked()
      })

      // Navigate to Step 3
      fireEvent.click(screen.getByRole('button', { name: /siguiente/i }))

      await waitFor(() => {
        expect(screen.getByText(/Paso 3 de 11/i)).toBeInTheDocument()
      })

      // Navigate back to Step 2
      const backButton = screen.getByRole('button', { name: /atrás/i })
      fireEvent.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      })

      // Verify data persisted
      const persistedComercial = screen.getByLabelText(/Crédito Comercial/i)
      expect(persistedComercial).toBeChecked()
    })

    it('should allow changing selection', async () => {
      await completeStep1AndNavigate()

      // Select comercial first
      const comercialRadio = screen.getByLabelText(/Crédito Comercial/i)
      fireEvent.click(comercialRadio)

      await waitFor(() => {
        expect(comercialRadio).toBeChecked()
      })

      // Change to agropecuario
      const agropecuarioRadio = screen.getByLabelText(/Crédito Agropecuario/i)
      fireEvent.click(agropecuarioRadio)

      await waitFor(() => {
        expect(agropecuarioRadio).toBeChecked()
        expect(comercialRadio).not.toBeChecked()
      })

      // Verify updated forms panel
      expect(screen.getByText(/Flujo de Caja Agropecuario/i)).toBeInTheDocument()
    })
  })

  describe('❌ Validation blocking navigation', () => {
    it('should not navigate to Step 3 without selecting a credit type', async () => {
      await completeStep1AndNavigate()

      // Try to navigate without selecting
      const nextButton = screen.getByRole('button', { name: /siguiente/i })

      // Button might be disabled or show error
      fireEvent.click(nextButton)

      // Should stay on Step 2
      await waitFor(() => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      })
    })
  })

  describe('🎨 UI and UX', () => {
    it('should show required forms panel only after selection', async () => {
      await completeStep1AndNavigate()

      // Initially should not show required forms panel
      expect(
        screen.queryByText(/Formularios adicionales requeridos/i)
      ).not.toBeInTheDocument()

      // Select comercial
      fireEvent.click(screen.getByLabelText(/Crédito Comercial/i))

      // Now should show the panel
      await waitFor(() => {
        expect(screen.getByText(/Formularios adicionales requeridos/i)).toBeInTheDocument()
      })
    })

    it('should show different required forms for each type', async () => {
      await completeStep1AndNavigate()

      // Select comercial
      fireEvent.click(screen.getByLabelText(/Crédito Comercial/i))

      await waitFor(() => {
        expect(screen.getByText(/Análisis Comercial/i)).toBeInTheDocument()
      })

      // Should not show agropecuario forms
      expect(screen.queryByText(/Flujo de Caja Agropecuario/i)).not.toBeInTheDocument()

      // Change to agropecuario
      fireEvent.click(screen.getByLabelText(/Crédito Agropecuario/i))

      await waitFor(() => {
        expect(screen.getByText(/Flujo de Caja Agropecuario/i)).toBeInTheDocument()
      })
    })

    it('should display progress indicator', async () => {
      await completeStep1AndNavigate()

      // Should show step indicator
      expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()

      // Should show progress text
      const stepText = screen.getByText(/Paso 2 de 11/i)
      expect(stepText).toBeVisible()
    })

    it('should show general information panel', async () => {
      await completeStep1AndNavigate()

      expect(screen.getByText(/Información importante/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Esta selección determina los formularios adicionales/i)
      ).toBeInTheDocument()
    })
  })

  describe('🔄 Complete Step 1 → Step 2 → Step 3 flow', () => {
    it('should complete entire flow from Step 1 to Step 3', async () => {
      render(<MultiStepForm />)

      // Step 1: Fill form
      fireEvent.change(screen.getByLabelText(/monto del crédito solicitado/i), {
        target: { value: '10000000' },
      })
      fireEvent.change(screen.getByLabelText(/plazo del crédito/i), {
        target: { value: '24' },
      })
      fireEvent.change(screen.getByLabelText(/destino del crédito/i), {
        target: { value: 'Expansión del negocio y compra de maquinaria nueva' },
      })
      fireEvent.click(screen.getByRole('radio', { name: /quincenal/i }))

      // Navigate to Step 2
      fireEvent.click(screen.getByRole('button', { name: /siguiente/i }))

      await waitFor(() => {
        expect(screen.getByText(/Paso 2 de 11/i)).toBeInTheDocument()
      })

      // Step 2: Select credit type
      fireEvent.click(screen.getByLabelText(/Crédito Agropecuario/i))

      await waitFor(() => {
        expect(screen.getByLabelText(/Crédito Agropecuario/i)).toBeChecked()
      })

      // Navigate to Step 3
      fireEvent.click(screen.getByRole('button', { name: /siguiente/i }))

      await waitFor(
        () => {
          expect(screen.getByText(/Paso 3 de 11/i)).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })
  })
})
