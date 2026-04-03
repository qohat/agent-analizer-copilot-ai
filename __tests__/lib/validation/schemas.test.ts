import {
  applicationStep3Schema,
  applicationStep4Schema,
} from '@/lib/validation/schemas'

describe('Form Validation Schemas', () => {
  describe('Step 3: Client Information', () => {
    const validClientData = {
      clientFirstName: 'Juan',
      clientLastName: 'Pérez',
      clientIdType: 'cedula' as const,
      clientIdNumber: '1234567890',
      clientDateOfBirth: new Date('1990-01-01').toISOString(),
      clientEmploymentStatus: 'employed' as const,
      clientPhone: '3001234567',
      clientEmail: 'juan@example.com',
      addressStreet: 'Calle 10 #5-20',
      addressCity: 'Neiva',
      addressDepartment: 'Huila',
      maritalStatus: 'single' as const,
    }

    it('should validate correct client data', () => {
      const result = applicationStep3Schema.safeParse(validClientData)
      expect(result.success).toBe(true)
    })

    it('should reject clientIdNumber longer than 10 characters', () => {
      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        clientIdNumber: '12345678901', // 11 digits
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 dígitos')
      }
    })

    it('should reject clientPhone not matching Colombian format', () => {
      const invalidPhones = [
        '123456789',      // 9 digits
        '12345678901',    // 11 digits
        '2001234567',     // doesn't start with 3
        '4001234567',     // doesn't start with 3
        '+573001234567',  // has + prefix
      ]

      invalidPhones.forEach((phone) => {
        const result = applicationStep3Schema.safeParse({
          ...validClientData,
          clientPhone: phone,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('10 dígitos')
        }
      })
    })

    it('should accept valid Colombian phone numbers', () => {
      const validPhones = ['3001234567', '3101234567', '3201234567', '3501234567']

      validPhones.forEach((phone) => {
        const result = applicationStep3Schema.safeParse({
          ...validClientData,
          clientPhone: phone,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject age under 18 years', () => {
      const today = new Date()
      const under18 = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())

      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        clientDateOfBirth: under18.toISOString(),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('18 años')
      }
    })

    it('should accept age exactly 18 years', () => {
      const today = new Date()
      const exactly18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        clientDateOfBirth: exactly18.toISOString(),
      })

      expect(result.success).toBe(true)
    })

    it('should accept age over 18 years', () => {
      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        clientDateOfBirth: new Date('1990-01-01').toISOString(),
      })

      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        clientEmail: 'invalid-email',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('inválido')
      }
    })

    it('should accept optional email being empty', () => {
      const { clientEmail, ...dataWithoutEmail } = validClientData
      const result = applicationStep3Schema.safeParse(dataWithoutEmail)

      expect(result.success).toBe(true)
    })

    it('should require landlordName and rentAmount when residenceType is arrendada', () => {
      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        residenceType: 'arrendada',
        // Missing landlordName and rentAmount
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('propietario')
      }
    })

    it('should accept landlordName and rentAmount when residenceType is arrendada', () => {
      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        residenceType: 'arrendada',
        landlordName: 'Carlos García',
        rentAmount: 500000,
      })

      expect(result.success).toBe(true)
    })

    it('should not require landlordName when residenceType is propia', () => {
      const result = applicationStep3Schema.safeParse({
        ...validClientData,
        residenceType: 'propia',
        // No landlordName or rentAmount
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Step 4: Spouse and Co-applicant', () => {
    it('should accept empty spouse data when hasSpouse is false', () => {
      const result = applicationStep4Schema.safeParse({
        hasSpouse: false,
      })

      expect(result.success).toBe(true)
    })

    it('should require spouse basic fields when hasSpouse is true', () => {
      const result = applicationStep4Schema.safeParse({
        hasSpouse: true,
        // Missing spouse fields
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('información básica del cónyuge')
      }
    })

    it('should accept spouse data when hasSpouse is true and all required fields provided', () => {
      const result = applicationStep4Schema.safeParse({
        hasSpouse: true,
        spouseFirstName: 'María',
        spouseLastName: 'García',
        spouseIdType: 'cedula',
        spouseIdNumber: '0987654321',
      })

      expect(result.success).toBe(true)
    })

    it('should validate spouse email format', () => {
      const result = applicationStep4Schema.safeParse({
        hasSpouse: true,
        spouseFirstName: 'María',
        spouseLastName: 'García',
        spouseIdType: 'cedula',
        spouseIdNumber: '0987654321',
        spouseEmail: 'invalid-email',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('inválido')
      }
    })

    it('should validate spouse phone format', () => {
      const result = applicationStep4Schema.safeParse({
        hasSpouse: true,
        spouseFirstName: 'María',
        spouseLastName: 'García',
        spouseIdType: 'cedula',
        spouseIdNumber: '0987654321',
        spousePhone: '123456789', // Invalid: 9 digits
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 dígitos')
      }
    })

    it('should require coapplicant basic fields when hasCoapplicant is true', () => {
      const result = applicationStep4Schema.safeParse({
        hasCoapplicant: true,
        // Missing coapplicant fields
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('información básica del co-deudor')
      }
    })

    it('should accept coapplicant data when hasCoapplicant is true and all required fields provided', () => {
      const result = applicationStep4Schema.safeParse({
        hasCoapplicant: true,
        coapplicantFirstName: 'Pedro',
        coapplicantLastName: 'Rodríguez',
        coapplicantIdType: 'cedula',
        coapplicantIdNumber: '1122334455',
        coapplicantPhone: '3009876543',
      })

      expect(result.success).toBe(true)
    })

    it('should validate coapplicant email format', () => {
      const result = applicationStep4Schema.safeParse({
        hasCoapplicant: true,
        coapplicantFirstName: 'Pedro',
        coapplicantLastName: 'Rodríguez',
        coapplicantIdType: 'cedula',
        coapplicantIdNumber: '1122334455',
        coapplicantPhone: '3009876543',
        coapplicantEmail: 'not-an-email',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('inválido')
      }
    })

    it('should accept both spouse and coapplicant when both flags are true', () => {
      const result = applicationStep4Schema.safeParse({
        hasSpouse: true,
        spouseFirstName: 'María',
        spouseLastName: 'García',
        spouseIdType: 'cedula',
        spouseIdNumber: '0987654321',
        hasCoapplicant: true,
        coapplicantFirstName: 'Pedro',
        coapplicantLastName: 'Rodríguez',
        coapplicantIdType: 'cedula',
        coapplicantIdNumber: '1122334455',
        coapplicantPhone: '3009876543',
      })

      expect(result.success).toBe(true)
    })
  })
})
