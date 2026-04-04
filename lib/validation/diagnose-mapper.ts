/**
 * Diagnostic tool to identify missing required fields
 */

import { applicationCreateSchema } from './schemas'

export function diagnoseFormData(formData: any) {
  console.group('🔍 Form Data Diagnostic')

  // Try to parse with schema
  const result = applicationCreateSchema.safeParse(formData)

  if (result.success) {
    console.log('✅ All validations passed!')
    console.groupEnd()
    return { valid: true, errors: [] }
  }

  console.error('❌ Validation failed')
  console.log('Total errors:', result.error.errors.length)

  // Group errors by type
  const errorsByField: Record<string, any[]> = {}

  result.error.errors.forEach((err) => {
    const field = err.path.join('.') || 'root'
    if (!errorsByField[field]) {
      errorsByField[field] = []
    }
    errorsByField[field].push(err)
  })

  console.table(
    result.error.errors.map((err, i) => ({
      '#': i + 1,
      Field: err.path.join('.'),
      Code: err.code,
      Expected: err.expected || '-',
      Received: err.received || '-',
      Message: err.message,
    }))
  )

  console.log('\n📋 Missing Required Fields:')
  Object.entries(errorsByField).forEach(([field, errors]) => {
    console.log(`  • ${field}:`)
    errors.forEach((err) => {
      console.log(`    - ${err.message} (expected: ${err.expected}, got: ${err.received})`)
    })
  })

  console.log('\n💡 Suggestions:')
  result.error.errors.forEach((err) => {
    const field = err.path.join('.')
    if (err.code === 'invalid_type' && err.expected === 'string') {
      console.log(`  • Check if "${field}" exists in form data and is not undefined`)
    } else if (err.code === 'invalid_type' && err.expected === 'number') {
      console.log(`  • Check if "${field}" is being converted to a number (use z.coerce.number() or parseInt)`)
    } else if (err.code === 'too_small') {
      console.log(`  • Check if "${field}" meets minimum value requirement`)
    }
  })

  console.groupEnd()

  return {
    valid: false,
    errors: result.error.errors,
    errorsByField,
  }
}

/**
 * List all fields present in form data
 */
export function listFormFields(formData: any, prefix = '') {
  const fields: string[] = []

  Object.keys(formData).forEach((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = formData[key]

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Nested object
      fields.push(...listFormFields(value, fullKey))
    } else {
      fields.push(`${fullKey}: ${typeof value} = ${JSON.stringify(value)?.slice(0, 50)}`)
    }
  })

  return fields
}

/**
 * Compare two objects and show differences
 */
export function compareFormData(raw: any, mapped: any) {
  console.group('🔄 Form Data Comparison')

  console.log('Raw fields count:', Object.keys(raw).length)
  console.log('Mapped fields count:', Object.keys(mapped).length)

  const rawFields = new Set(Object.keys(raw))
  const mappedFields = new Set(Object.keys(mapped))

  const unmappedFields = [...rawFields].filter((f) => !mappedFields.has(f))
  const newFields = [...mappedFields].filter((f) => !rawFields.has(f))

  if (unmappedFields.length > 0) {
    console.warn('⚠️ Fields in raw but not in mapped:', unmappedFields)
  }

  if (newFields.length > 0) {
    console.log('✨ New fields added in mapping:', newFields)
  }

  // Check for undefined values in mapped data
  const undefinedFields = Object.entries(mapped)
    .filter(([_, value]) => value === undefined)
    .map(([key]) => key)

  if (undefinedFields.length > 0) {
    console.warn('⚠️ Fields with undefined values:', undefinedFields)
  }

  console.groupEnd()
}
