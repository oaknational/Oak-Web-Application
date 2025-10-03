# Error Boundary Implementation Plan

**Phase**: 2.2 - Architecture Planning  
**Type**: Planning Document  
**Purpose**: Comprehensive error handling strategy for improved reliability and testability

## Executive Summary

This plan defines a comprehensive error handling strategy using React Error Boundaries, integrating with existing error tracking, and providing graceful fallbacks. The goal is to prevent errors from crashing the entire application while maintaining visibility into issues.

## Current State Analysis

### Existing Error Handling

1. **Limited Error Boundaries**
   - One ErrorBoundary component exists
   - Used only at app level (_app.tsx)
   - Basic implementation without granular control

2. **Error Tracking**
   - Bugsnag integration exists
   - Basic error reporting in place
   - Limited context in error reports

3. **User Experience**
   - Errors often result in white screens
   - No recovery mechanisms
   - Limited user-friendly messaging

## Proposed Error Boundary Architecture

### Hierarchical Error Boundaries

```
App
├── AppErrorBoundary (Catch-all)
│   ├── RouteErrorBoundary (Page-level)
│   │   ├── FeatureErrorBoundary (Feature-level)
│   │   │   └── ComponentErrorBoundary (Component-level)
```

### Core Error Boundary Implementation

```typescript
// src/components/ErrorBoundaries/BaseErrorBoundary.tsx
import { Component, ReactNode, ErrorInfo } from 'react';
import { errorReporter } from '@/common-lib/error-reporter';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorBoundaryKey: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: ErrorFallbackProps) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'app' | 'route' | 'feature' | 'component';
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo: ErrorInfo | null;
}

export class BaseErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorBoundaryKey: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;

    // Log to error reporting service
    errorReporter.notifyError(error, {
      context: 'ErrorBoundary',
      level,
      componentStack: errorInfo.componentStack,
    });

    // Call custom error handler
    onError?.(error, errorInfo);

    // Update state with error info
    this.setState({ errorInfo });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => key !== prevProps.resetKeys?.[idx])) {
        this.resetError();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetError();
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorBoundaryKey: this.state.errorBoundaryKey + 1,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback({ error, resetError: this.resetError, errorInfo });
      }

      return <DefaultErrorFallback error={error} resetError={this.resetError} />;
    }

    return children;
  }
}
```

### Specialized Error Boundaries

#### 1. Route Error Boundary

```typescript
// src/components/ErrorBoundaries/RouteErrorBoundary.tsx
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <BaseErrorBoundary
      level="route"
      resetKeys={[router.asPath]}
      fallback={({ error, resetError }) => (
        <RouteLevelErrorFallback
          error={error}
          onRetry={resetError}
          onGoHome={() => router.push('/')}
        />
      )}
    >
      {children}
    </BaseErrorBoundary>
  );
}
```

#### 2. Feature Error Boundary

```typescript
// src/components/ErrorBoundaries/FeatureErrorBoundary.tsx
export function FeatureErrorBoundary({ 
  children, 
  featureName 
}: { 
  children: ReactNode;
  featureName: string;
}) {
  return (
    <BaseErrorBoundary
      level="feature"
      fallback={({ error, resetError }) => (
        <FeatureErrorFallback
          error={error}
          featureName={featureName}
          onRetry={resetError}
        />
      )}
      onError={(error) => {
        // Track feature-specific errors
        analytics.track('feature_error', {
          feature: featureName,
          error: error.message,
        });
      }}
    >
      {children}
    </BaseErrorBoundary>
  );
}
```

#### 3. Component Error Boundary

```typescript
// src/components/ErrorBoundaries/ComponentErrorBoundary.tsx
export function ComponentErrorBoundary({ 
  children,
  componentName,
  showError = false 
}: Props) {
  return (
    <BaseErrorBoundary
      level="component"
      isolate={true}
      fallback={({ error }) => (
        showError ? (
          <ComponentErrorMessage error={error} />
        ) : (
          <EmptyState message="This content is temporarily unavailable" />
        )
      )}
    >
      {children}
    </BaseErrorBoundary>
  );
}
```

### Fallback UI Patterns

#### 1. Full Page Error

```typescript
// src/components/ErrorFallbacks/FullPageError.tsx
export function FullPageError({ error, onRetry }: Props) {
  return (
    <OakFlex
      $flexDirection="column"
      $alignItems="center"
      $justifyContent="center"
      $minHeight="100vh"
      $pa="inner-padding-xl"
    >
      <OakHeading tag="h1" $font="heading-3">
        Something went wrong
      </OakHeading>
      
      <OakP $mb="space-between-m">
        We're sorry, but something unexpected happened. 
        Please try refreshing the page.
      </OakP>
      
      <OakFlex $gap="all-spacing-4">
        <OakPrimaryButton onClick={onRetry}>
          Try Again
        </OakPrimaryButton>
        
        <OakSecondaryButton onClick={() => window.location.href = '/'}>
          Go Home
        </OakSecondaryButton>
      </OakFlex>
      
      {process.env.NODE_ENV === 'development' && (
        <ErrorDetails error={error} />
      )}
    </OakFlex>
  );
}
```

#### 2. Inline Error

```typescript
// src/components/ErrorFallbacks/InlineError.tsx
export function InlineError({ message, onRetry }: Props) {
  return (
    <OakBox $background="bg-decorative4-very-subdued" $pa="inner-padding-m">
      <OakFlex $alignItems="center" $gap="all-spacing-2">
        <OakIcon iconName="warning" />
        <OakP>{message}</OakP>
        {onRetry && (
          <OakSecondaryButton size="small" onClick={onRetry}>
            Retry
          </OakSecondaryButton>
        )}
      </OakFlex>
    </OakBox>
  );
}
```

### Recovery Mechanisms

#### 1. Automatic Recovery

```typescript
// Hook for automatic retry
export function useErrorRecovery(
  maxRetries = 3,
  retryDelay = 1000
) {
  const [retryCount, setRetryCount] = useState(0);
  
  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(count => count + 1);
      }, retryDelay * Math.pow(2, retryCount));
    }
  }, [retryCount, maxRetries, retryDelay]);
  
  return { retry, retryCount, canRetry: retryCount < maxRetries };
}
```

#### 2. User-Initiated Recovery

```typescript
// Recovery actions
export const recoveryActions = {
  RELOAD_PAGE: () => window.location.reload(),
  GO_HOME: () => window.location.href = '/',
  GO_BACK: () => window.history.back(),
  CLEAR_CACHE: () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  },
};
```

### Error Context and Tracking

```typescript
// src/utils/error-context.ts
export function enrichErrorContext(error: Error, context: ErrorContext) {
  return {
    ...error,
    context: {
      ...context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    },
  };
}
```

### Testing Error Boundaries

#### 1. Unit Testing

```typescript
// src/components/ErrorBoundaries/__tests__/BaseErrorBoundary.test.tsx
describe('BaseErrorBoundary', () => {
  it('should catch errors and display fallback', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    render(
      <BaseErrorBoundary
        fallback={({ error }) => <div>Error: {error.message}</div>}
      >
        <ThrowError />
      </BaseErrorBoundary>
    );
    
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
  
  it('should reset error on resetKeys change', () => {
    const { rerender } = render(
      <BaseErrorBoundary resetKeys={['key1']}>
        <ThrowError />
      </BaseErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    rerender(
      <BaseErrorBoundary resetKeys={['key2']}>
        <ValidComponent />
      </BaseErrorBoundary>
    );
    
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });
});
```

#### 2. Integration Testing

```typescript
// Test error boundary hierarchy
it('should isolate component errors', async () => {
  render(
    <RouteErrorBoundary>
      <FeatureErrorBoundary featureName="quiz">
        <WorkingComponent />
        <ComponentErrorBoundary>
          <BrokenComponent />
        </ComponentErrorBoundary>
      </FeatureErrorBoundary>
    </RouteErrorBoundary>
  );
  
  // Only broken component shows error
  expect(screen.getByTestId('working-component')).toBeInTheDocument();
  expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
});
```

### Implementation Strategy

#### Phase 1: Core Infrastructure (Week 1)
1. Implement BaseErrorBoundary
2. Create fallback UI components
3. Set up error tracking integration

#### Phase 2: Boundary Hierarchy (Week 2)
1. Add RouteErrorBoundary to pages
2. Wrap features with FeatureErrorBoundary
3. Identify high-risk components for isolation

#### Phase 3: Recovery & Testing (Week 3)
1. Implement recovery mechanisms
2. Add comprehensive tests
3. Document patterns for team

### Best Practices

1. **Granular Boundaries**: Place boundaries at logical component boundaries
2. **Meaningful Fallbacks**: Provide context-appropriate error messages
3. **Recovery Options**: Always offer a way to recover
4. **Error Tracking**: Log all errors with context
5. **Development vs Production**: Show details in dev, user-friendly in prod

### Success Metrics

- **Error Recovery Rate**: % of errors that users recover from
- **Error Isolation**: % of errors contained to component level
- **User Experience**: Reduced bounce rate on errors
- **Developer Experience**: Faster error debugging
- **Test Coverage**: 95%+ coverage of error scenarios

## Conclusion

This error boundary implementation plan provides a robust foundation for handling errors gracefully. By implementing hierarchical boundaries with appropriate fallbacks and recovery mechanisms, we can significantly improve both user experience and application reliability.