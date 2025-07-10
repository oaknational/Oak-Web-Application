# Implementation Guide: QW-003 - Extract School Data Validation Functions

**Quick Win ID**: QW-003  
**Title**: Extract School Data Validation Functions  
**Assignee**: AI Assistant  
**Complexity**: Low  
**Expected Outcome**: Centralized validation logic for school data with comprehensive tests

## Pre-Implementation Checklist

- [ ] Review SchoolPicker component for validation logic
- [ ] Understand URN (Unique Reference Number) format requirements
- [ ] Research UK postcode validation standards
- [ ] Check for existing validation utilities
- [ ] Map onboarding flow to understand impact
- [ ] Document current error messages for consistency

## Implementation Steps

### Step 1: Analyze School Data Components

**Primary File**: `/src/components/Onboarding/SchoolPicker.tsx`  
**Additional Files**: Check for related onboarding components

**What to look for**:
- URN validation logic (format and checksum)
- Postcode validation patterns
- Required field checking
- Error message generation
- Any existing validation functions

**Investigation commands**:
```bash
# Find URN validation
grep -n "urn\|URN" src/components/Onboarding/SchoolPicker.tsx

# Find postcode validation  
grep -n "postcode\|postalCode" src/components/Onboarding/SchoolPicker.tsx

# Look for validation patterns
grep -n "validate\|isValid\|required" src/components/Onboarding/SchoolPicker.tsx
```

### Step 2: Create School Validation Utilities

**File**: `/src/utils/school/validation.ts`  
**Initial structure**:

```typescript
// src/utils/school/validation.ts
/**
 * School data validation utilities
 * Handles URN, postcode, and completeness validation
 */

export interface SchoolData {
  urn?: string;
  name?: string;
  postcode?: string;
  localAuthority?: string;
  phase?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

### Step 3: Extract URN Validation

**URN Format**: 6-digit number with specific validation rules

```typescript
/**
 * Validates a school URN (Unique Reference Number)
 * URN format: 6-digit number (100000-999999)
 * @param urn - The URN to validate
 * @returns Validation result with error message if invalid
 */
export function validateSchoolURN(urn: string | undefined): ValidationResult {
  if (!urn || urn.trim() === '') {
    return {
      isValid: false,
      error: 'School URN is required',
    };
  }
  
  const cleanedURN = urn.trim();
  
  // Check format: exactly 6 digits
  if (!/^\d{6}$/.test(cleanedURN)) {
    return {
      isValid: false,
      error: 'URN must be a 6-digit number',
    };
  }
  
  const urnNumber = parseInt(cleanedURN, 10);
  
  // Valid URN range (actual schools start from 100000)
  if (urnNumber < 100000 || urnNumber > 999999) {
    return {
      isValid: false,
      error: 'URN must be between 100000 and 999999',
    };
  }
  
  // Additional checksum validation if required
  // (Research actual URN checksum algorithm if applicable)
  
  return { isValid: true };
}
```

### Step 4: Extract Postcode Validation

**UK Postcode Format**: Complex pattern with outward and inward codes

```typescript
/**
 * Validates UK postcodes
 * Supports all UK postcode formats (e.g., SW1A 1AA, M1 1AE, DN55 1PT)
 * @param postcode - The postcode to validate
 * @returns Validation result with error message if invalid
 */
export function validatePostcode(postcode: string | undefined): ValidationResult {
  if (!postcode || postcode.trim() === '') {
    return {
      isValid: false,
      error: 'Postcode is required',
    };
  }
  
  // Normalize: uppercase and remove extra spaces
  const normalizedPostcode = postcode.trim().toUpperCase().replace(/\s+/g, ' ');
  
  // UK postcode regex pattern
  // Matches formats like: SW1A 1AA, M1 1AE, DN55 1PT, W1A 0AX, EC1A 1BB
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/;
  
  if (!postcodeRegex.test(normalizedPostcode)) {
    return {
      isValid: false,
      error: 'Please enter a valid UK postcode',
    };
  }
  
  // Additional validation for special cases
  // Check for invalid postcode areas if needed
  const invalidAreas = ['ZZ']; // Example: ZZ is not a valid area
  const area = normalizedPostcode.substring(0, 2);
  
  if (invalidAreas.includes(area)) {
    return {
      isValid: false,
      error: 'Invalid postcode area',
    };
  }
  
  return { isValid: true };
}

/**
 * Formats a postcode to standard UK format (with space)
 * @param postcode - Raw postcode input
 * @returns Formatted postcode or original if invalid
 */
export function formatPostcode(postcode: string): string {
  const cleaned = postcode.trim().toUpperCase().replace(/\s+/g, '');
  
  if (cleaned.length >= 5 && cleaned.length <= 7) {
    // Insert space before last 3 characters
    const inward = cleaned.slice(-3);
    const outward = cleaned.slice(0, -3);
    return `${outward} ${inward}`;
  }
  
  return postcode;
}
```

### Step 5: Extract Completeness Validation

```typescript
/**
 * Checks if school data has all required fields
 * @param data - School data to validate
 * @returns Validation result with specific missing fields
 */
export function isSchoolDataComplete(data: SchoolData): ValidationResult {
  const missingFields: string[] = [];
  
  // Check required fields
  if (!data.urn?.trim()) {
    missingFields.push('URN');
  }
  
  if (!data.name?.trim()) {
    missingFields.push('School name');
  }
  
  if (!data.postcode?.trim()) {
    missingFields.push('Postcode');
  }
  
  if (!data.localAuthority?.trim()) {
    missingFields.push('Local authority');
  }
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
    };
  }
  
  // Validate individual fields
  const urnValidation = validateSchoolURN(data.urn);
  if (!urnValidation.isValid) {
    return urnValidation;
  }
  
  const postcodeValidation = validatePostcode(data.postcode);
  if (!postcodeValidation.isValid) {
    return postcodeValidation;
  }
  
  return { isValid: true };
}
```

### Step 6: Create Comprehensive Test Suite

**File**: `/src/utils/school/validation.test.ts`

```typescript
import {
  validateSchoolURN,
  validatePostcode,
  formatPostcode,
  isSchoolDataComplete,
} from './validation';

describe('School Validation Utils', () => {
  describe('validateSchoolURN', () => {
    it('should validate correct URNs', () => {
      expect(validateSchoolURN('123456')).toEqual({ isValid: true });
      expect(validateSchoolURN('100000')).toEqual({ isValid: true });
      expect(validateSchoolURN('999999')).toEqual({ isValid: true });
    });
    
    it('should reject invalid URNs', () => {
      expect(validateSchoolURN('')).toEqual({
        isValid: false,
        error: 'School URN is required',
      });
      
      expect(validateSchoolURN('12345')).toEqual({
        isValid: false,
        error: 'URN must be a 6-digit number',
      });
      
      expect(validateSchoolURN('099999')).toEqual({
        isValid: false,
        error: 'URN must be between 100000 and 999999',
      });
      
      expect(validateSchoolURN('ABC123')).toEqual({
        isValid: false,
        error: 'URN must be a 6-digit number',
      });
    });
    
    it('should handle edge cases', () => {
      expect(validateSchoolURN(undefined)).toEqual({
        isValid: false,
        error: 'School URN is required',
      });
      
      expect(validateSchoolURN('  123456  ')).toEqual({ isValid: true });
    });
  });
  
  describe('validatePostcode', () => {
    const validPostcodes = [
      'SW1A 1AA',
      'M1 1AE',
      'M60 1NW',
      'CR2 6XH',
      'DN55 1PT',
      'W1A 0AX',
      'EC1A 1BB',
      'E1 6AN',
    ];
    
    it.each(validPostcodes)('should validate %s', (postcode) => {
      expect(validatePostcode(postcode)).toEqual({ isValid: true });
    });
    
    it('should handle formatting variations', () => {
      expect(validatePostcode('sw1a1aa')).toEqual({ isValid: true });
      expect(validatePostcode('SW1A1AA')).toEqual({ isValid: true });
      expect(validatePostcode('SW1A  1AA')).toEqual({ isValid: true });
    });
    
    const invalidPostcodes = [
      ['', 'Postcode is required'],
      ['SW1A', 'Please enter a valid UK postcode'],
      ['1AA', 'Please enter a valid UK postcode'],
      ['SWIA 1AA', 'Please enter a valid UK postcode'],
      ['SW1A 1A', 'Please enter a valid UK postcode'],
      ['SW1A 1AAA', 'Please enter a valid UK postcode'],
      ['123456', 'Please enter a valid UK postcode'],
      ['ZZ99 9ZZ', 'Invalid postcode area'],
    ];
    
    it.each(invalidPostcodes)('should reject %s', (postcode, error) => {
      expect(validatePostcode(postcode)).toEqual({
        isValid: false,
        error,
      });
    });
  });
  
  describe('formatPostcode', () => {
    it('should format postcodes correctly', () => {
      expect(formatPostcode('sw1a1aa')).toBe('SW1A 1AA');
      expect(formatPostcode('M11AE')).toBe('M1 1AE');
      expect(formatPostcode('  dn551pt  ')).toBe('DN55 1PT');
    });
    
    it('should handle already formatted postcodes', () => {
      expect(formatPostcode('SW1A 1AA')).toBe('SW1A 1AA');
    });
  });
  
  describe('isSchoolDataComplete', () => {
    const validSchoolData = {
      urn: '123456',
      name: 'Test School',
      postcode: 'SW1A 1AA',
      localAuthority: 'Westminster',
      phase: 'Primary',
    };
    
    it('should validate complete data', () => {
      expect(isSchoolDataComplete(validSchoolData)).toEqual({ isValid: true });
    });
    
    it('should identify missing fields', () => {
      expect(isSchoolDataComplete({})).toEqual({
        isValid: false,
        error: 'Missing required fields: URN, School name, Postcode, Local authority',
      });
      
      expect(isSchoolDataComplete({ urn: '123456' })).toEqual({
        isValid: false,
        error: 'Missing required fields: School name, Postcode, Local authority',
      });
    });
    
    it('should validate field content', () => {
      expect(isSchoolDataComplete({
        ...validSchoolData,
        urn: '12345', // Invalid URN
      })).toEqual({
        isValid: false,
        error: 'URN must be a 6-digit number',
      });
      
      expect(isSchoolDataComplete({
        ...validSchoolData,
        postcode: 'INVALID',
      })).toEqual({
        isValid: false,
        error: 'Please enter a valid UK postcode',
      });
    });
    
    it('should handle whitespace-only values', () => {
      expect(isSchoolDataComplete({
        urn: '   ',
        name: 'Test School',
        postcode: 'SW1A 1AA',
        localAuthority: 'Westminster',
      })).toEqual({
        isValid: false,
        error: 'Missing required fields: URN',
      });
    });
  });
  
  // Performance tests
  describe('Performance', () => {
    it('should validate URN in <1ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        validateSchoolURN('123456');
      }
      expect(performance.now() - start).toBeLessThan(1);
    });
    
    it('should validate postcode in <1ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        validatePostcode('SW1A 1AA');
      }
      expect(performance.now() - start).toBeLessThan(1);
    });
  });
});
```

### Step 7: Update SchoolPicker Component

```typescript
// Before (in SchoolPicker.tsx)
const validateSchool = () => {
  if (!schoolData.urn || schoolData.urn.length !== 6) {
    setError('Invalid URN');
    return false;
  }
  // More inline validation...
};

// After
import { 
  validateSchoolURN, 
  validatePostcode, 
  isSchoolDataComplete,
  formatPostcode 
} from '@/utils/school/validation';

const handlePostcodeChange = (value: string) => {
  const formatted = formatPostcode(value);
  setSchoolData({ ...schoolData, postcode: formatted });
  
  const validation = validatePostcode(formatted);
  if (!validation.isValid) {
    setPostcodeError(validation.error);
  } else {
    setPostcodeError(undefined);
  }
};

const handleSubmit = () => {
  const validation = isSchoolDataComplete(schoolData);
  if (!validation.isValid) {
    setError(validation.error);
    return;
  }
  
  // Proceed with submission
  onSubmit(schoolData);
};
```

## Rollback Plan

1. **Immediate revert**: 
   ```bash
   git checkout -- src/components/Onboarding/SchoolPicker.tsx
   ```

2. **Debugging steps**:
   - Compare error messages (must match exactly)
   - Test full onboarding flow
   - Verify URN validation against known schools
   - Check postcode edge cases

3. **Gradual rollback**:
   - Keep utilities but revert usage one at a time
   - Add temporary logging to compare old/new validation

## Success Verification

- [ ] All onboarding tests pass
- [ ] Error messages unchanged for users
- [ ] Valid schools can still register
- [ ] Invalid data properly rejected
- [ ] Postcode formatting works correctly
- [ ] URN validation matches previous behavior
- [ ] Teacher onboarding flow uninterrupted
- [ ] Performance <1ms for all validations

## Critical Path Considerations

**Teacher Onboarding is Critical**: This validation directly affects new teacher registration. Any bugs could block onboarding.

### Testing with Real Data
- Test with actual school URNs from different regions
- Verify postcodes for all UK countries (England, Scotland, Wales, NI)
- Check edge cases like BFPO postcodes if applicable

### Error Message Preservation
- Exact error text is important for user support
- If changing messages, coordinate with support team
- Consider i18n implications

## Pattern Benefits

This extraction provides:
1. **Centralized validation**: One source of truth for school data rules
2. **Reusability**: Can be used in admin tools, imports, etc.
3. **Testability**: Pure functions with comprehensive tests
4. **Maintainability**: Easy to update validation rules
5. **Type safety**: Strong typing prevents validation bugs

## Future Enhancements

- Add school name validation (prohibited words, length)
- Implement URN checksum if algorithm is available
- Add postcode-to-region mapping
- Cache validation results for performance
- Add international school support