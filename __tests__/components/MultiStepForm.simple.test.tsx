import { render, screen } from '@testing-library/react'
import { MultiStepForm } from '@/components/MultiStepForm'

// Simple, focused tests that don't require complex interactions
describe('MultiStepForm - Simple Tests', () => {
  describe('Initial Render', () => {
    it('should render step 1 on initial load', () => {
      render(<MultiStepForm />)

      expect(screen.getByText('Información del cliente')).toBeInTheDocument()
    })

    it('should show correct step indicator "Paso 1 de 11"', () => {
      render(<MultiStepForm />)

      const stepIndicators = screen.getAllByText('Paso 1 de 11')
      expect(stepIndicators.length).toBeGreaterThan(0)
    })

    it('should render 11 progress bar segments', () => {
      render(<MultiStepForm />)

      // Progress bars have class "h-2" and "rounded-full"
      const progressBars = document.querySelectorAll('.h-2.rounded-full')
      expect(progressBars.length).toBe(11)
    })

    it('should have "Atrás" button disabled on first step', () => {
      render(<MultiStepForm />)

      const backButton = screen.getByText('Atrás').closest('button')
      expect(backButton).toBeDisabled()
    })

    it('should render "Siguiente" button', () => {
      render(<MultiStepForm />)

      const nextButton = screen.getByText('Siguiente')
      expect(nextButton).toBeInTheDocument()
    })

    it('should render all required form fields for step 1', () => {
      render(<MultiStepForm />)

      // Check for key input fields
      expect(screen.getByPlaceholderText('Juan')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Pérez')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('1234567890')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('+573001234567')).toBeInTheDocument()
    })
  })

  describe('Navigation Buttons', () => {
    it('should have both "Atrás" and "Siguiente" buttons', () => {
      render(<MultiStepForm />)

      expect(screen.getByText('Atrás')).toBeInTheDocument()
      expect(screen.getByText('Siguiente')).toBeInTheDocument()
    })

    it('should display auto-save notice', () => {
      render(<MultiStepForm />)

      expect(screen.getByText(/Tu progreso se guarda automáticamente/i)).toBeInTheDocument()
    })
  })

  describe('Progress Indicator', () => {
    it('should highlight first step in progress bar', () => {
      render(<MultiStepForm />)

      const progressBars = document.querySelectorAll('.h-2.rounded-full')
      const firstBar = progressBars[0]

      // First step should be emerald (active)
      expect(firstBar).toHaveClass('bg-emerald-500')
    })

    it('should not highlight remaining steps', () => {
      render(<MultiStepForm />)

      const progressBars = document.querySelectorAll('.h-2.rounded-full')

      // Steps 2-11 should be slate-700 (inactive)
      for (let i = 1; i < progressBars.length; i++) {
        expect(progressBars[i]).toHaveClass('bg-slate-700')
      }
    })
  })

  describe('Form Layout', () => {
    it('should render form within a card-like container', () => {
      const { container } = render(<MultiStepForm />)

      const formContainer = container.querySelector('.bg-slate-800\\/50.border')
      expect(formContainer).toBeInTheDocument()
    })

    it('should have proper spacing between sections', () => {
      const { container } = render(<MultiStepForm />)

      // Form should have space-y-8 class for vertical spacing
      const form = container.querySelector('form.space-y-8')
      expect(form).toBeInTheDocument()
    })
  })

  describe('Field Placeholders', () => {
    it('should show helpful placeholders for all input fields', () => {
      render(<MultiStepForm />)

      // Name placeholders
      expect(screen.getByPlaceholderText('Juan')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Pérez')).toBeInTheDocument()

      // ID placeholder
      expect(screen.getByPlaceholderText('1234567890')).toBeInTheDocument()

      // Phone placeholder
      expect(screen.getByPlaceholderText('+573001234567')).toBeInTheDocument()

      // Email placeholder (optional)
      expect(screen.getByPlaceholderText('juan@ejemplo.com')).toBeInTheDocument()

      // Address placeholder
      expect(screen.getByPlaceholderText('Calle 10 #5-20')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Neiva')).toBeInTheDocument()
    })
  })

  describe('Select Options', () => {
    it('should render select dropdowns for categorized fields', () => {
      render(<MultiStepForm />)

      // Check for select elements (there should be at least 3: ID type, Department, Marital Status)
      const selects = document.querySelectorAll('select')
      expect(selects.length).toBeGreaterThanOrEqual(3)
    })
  })
})
