# Testable Component Architecture Patterns

**Four accessibility-first component patterns from Oak's educational platform demonstrating testable architecture with real examples**

## Overview

Well-designed components are naturally testable and accessible. This document showcases four architectural patterns from Oak's codebase that demonstrate how accessibility-first design creates better testing opportunities and more reliable software.

Each pattern demonstrates how testing requirements influence component design, improving both code structure and user experience.

## Pattern 1: Compound Component with Accessibility Context

### Example: OakLessonCard Component Family

Oak's lesson cards demonstrate how compound components can provide both flexible composition and comprehensive accessibility testing.

### Implementation

```typescript
// components/SharedComponents/OakLessonCard/OakLessonCard.tsx
import React, { createContext, useContext } from 'react';
import type { OakLesson } from '@/common-lib/curriculum-api-2023/types';

// Accessibility-focused context for coordinating ARIA relationships
interface LessonCardContextValue {
  lessonId: string;
  title: string;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  registerAction: (actionId: string, label: string) => void;
  unregisterAction: (actionId: string) => void;
}

const LessonCardContext = createContext<LessonCardContextValue | null>(null);

function useLessonCard() {
  const context = useContext(LessonCardContext);
  if (!context) {
    throw new Error('LessonCard compound components must be used within LessonCard.Root');
  }
  return context;
}

// Root component that provides accessibility context
export interface OakLessonCardRootProps {
  lesson: OakLesson;
  onBookmarkToggle?: () => void;
  children: React.ReactNode;
  className?: string;
}

function LessonCardRoot({
  lesson,
  onBookmarkToggle = () => {},
  children,
  className
}: OakLessonCardRootProps) {
  const [registeredActions, setRegisteredActions] = React.useState<Map<string, string>>(new Map());

  const registerAction = React.useCallback((actionId: string, label: string) => {
    setRegisteredActions(prev => new Map(prev).set(actionId, label));
  }, []);

  const unregisterAction = React.useCallback((actionId: string) => {
    setRegisteredActions(prev => {
      const next = new Map(prev);
      next.delete(actionId);
      return next;
    });
  }, []);

  const contextValue: LessonCardContextValue = {
    lessonId: lesson._id,
    title: lesson.title,
    isBookmarked: false, // Would come from user state
    onBookmarkToggle,
    registerAction,
    unregisterAction
  };

  // Generate accessible description from registered actions
  const actionDescriptions = Array.from(registeredActions.values()).join(', ');
  const cardDescription = actionDescriptions
    ? `Available actions: ${actionDescriptions}`
    : undefined;

  return (
    <LessonCardContext.Provider value={contextValue}>
      <article
        className={className}
        aria-labelledby={`lesson-title-${lesson._id}`}
        aria-describedby={cardDescription ? `lesson-actions-${lesson._id}` : undefined}
      >
        {children}
        {cardDescription && (
          <div
            id={`lesson-actions-${lesson._id}`}
            className="sr-only"
            aria-hidden="true"
          >
            {cardDescription}
          </div>
        )}
      </article>
    </LessonCardContext.Provider>
  );
}

// Header component with semantic structure
export interface OakLessonCardHeaderProps {
  showSubject?: boolean;
  showKeyStage?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

function LessonCardHeader({
  showSubject = true,
  showKeyStage = true,
  headingLevel = 3
}: OakLessonCardHeaderProps) {
  const { lessonId, title } = useLessonCard();

  // Dynamic heading component based on level
  const HeadingComponent = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <header>
      <HeadingComponent
        id={`lesson-title-${lessonId}`}
        className="oak-lesson-card__title"
      >
        {title}
      </HeadingComponent>

      {(showSubject || showKeyStage) && (
        <div className="oak-lesson-card__metadata">
          {showSubject && (
            <span className="oak-lesson-card__subject">
              Mathematics
            </span>
          )}
          {showKeyStage && (
            <span className="oak-lesson-card__key-stage">
              Key stage 2
            </span>
          )}
        </div>
      )}
    </header>
  );
}

// Content component for lesson description
function LessonCardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="oak-lesson-card__content">
      {children}
    </div>
  );
}

// Actions component with automatic ARIA registration
export interface OakLessonCardActionsProps {
  children: React.ReactNode;
}

function LessonCardActions({ children }: OakLessonCardActionsProps) {
  return (
    <div className="oak-lesson-card__actions" role="group" aria-label="Lesson actions">
      {children}
    </div>
  );
}

// Individual action components
export interface OakLessonCardActionProps {
  variant: 'primary' | 'secondary' | 'bookmark';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function LessonCardAction({
  variant,
  children,
  onClick,
  disabled = false
}: OakLessonCardActionProps) {
  const { lessonId, registerAction, unregisterAction } = useLessonCard();
  const actionId = React.useId();

  // Register this action for accessibility description
  React.useEffect(() => {
    const label = typeof children === 'string' ? children : `${variant} action`;
    registerAction(actionId, label);

    return () => unregisterAction(actionId);
  }, [children, variant, actionId, registerAction, unregisterAction]);

  if (variant === 'bookmark') {
    return (
      <button
        className={`oak-lesson-card__action oak-lesson-card__action--${variant}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={`Bookmark lesson: ${lessonId}`}
        aria-pressed="false" // Would be dynamic based on bookmark state
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`oak-lesson-card__action oak-lesson-card__action--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Compound component export
export const OakLessonCard = {
  Root: LessonCardRoot,
  Header: LessonCardHeader,
  Content: LessonCardContent,
  Actions: LessonCardActions,
  Action: LessonCardAction
};
```

### Comprehensive Testing

```typescript
// components/SharedComponents/OakLessonCard/__tests__/OakLessonCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OakLessonCard } from '../OakLessonCard';
import { createMockOakLesson } from '@/__tests__/__helpers__/mockFactories';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('OakLessonCard Compound Component', () => {
  const mockLesson = createMockOakLesson({
    _id: 'test-lesson-123',
    title: 'Introduction to Fractions'
  });

  describe('Compound Component Architecture', () => {
    it('provides accessible composition flexibility', async () => {
      const handleStart = jest.fn();
      const handleBookmark = jest.fn();

      const { container } = render(
        <OakLessonCard.Root lesson={mockLesson}>
          <OakLessonCard.Header headingLevel={2} />
          <OakLessonCard.Content>
            Learn about fractions with visual examples and practice exercises.
          </OakLessonCard.Content>
          <OakLessonCard.Actions>
            <OakLessonCard.Action variant="primary" onClick={handleStart}>
              Start Lesson
            </OakLessonCard.Action>
            <OakLessonCard.Action variant="bookmark" onClick={handleBookmark}>
              Bookmark
            </OakLessonCard.Action>
          </OakLessonCard.Actions>
        </OakLessonCard.Root>
      );

      // Test semantic structure
      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();

      const heading = screen.getByRole('heading', {
        name: /introduction to fractions/i,
        level: 2
      });
      expect(heading).toBeInTheDocument();

      // Test action accessibility
      const actionsGroup = screen.getByRole('group', { name: /lesson actions/i });
      expect(actionsGroup).toBeInTheDocument();

      const startButton = screen.getByRole('button', { name: /start lesson/i });
      const bookmarkButton = screen.getByRole('button', {
        name: /bookmark lesson.*test-lesson-123/i
      });

      expect(startButton).toBeInTheDocument();
      expect(bookmarkButton).toBeInTheDocument();
      expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false');

      // Test interactions
      const user = userEvent.setup();
      await user.click(startButton);
      expect(handleStart).toHaveBeenCalledTimes(1);

      await user.click(bookmarkButton);
      expect(handleBookmark).toHaveBeenCalledTimes(1);

      // Test accessibility compliance
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('coordinates ARIA relationships automatically', () => {
      render(
        <OakLessonCard.Root lesson={mockLesson}>
          <OakLessonCard.Header />
          <OakLessonCard.Actions>
            <OakLessonCard.Action variant="primary">Start Lesson</OakLessonCard.Action>
            <OakLessonCard.Action variant="secondary">Preview</OakLessonCard.Action>
          </OakLessonCard.Actions>
        </OakLessonCard.Root>
      );

      const article = screen.getByRole('article');

      // Should be labeled by the heading
      expect(article).toHaveAttribute('aria-labelledby', 'lesson-title-test-lesson-123');

      // Should describe available actions
      expect(article).toHaveAttribute('aria-describedby', 'lesson-actions-test-lesson-123');

      // Action description should be present but hidden
      const actionDescription = document.getElementById('lesson-actions-test-lesson-123');
      expect(actionDescription).toHaveTextContent(/available actions.*start lesson.*preview/i);
      expect(actionDescription).toHaveClass('sr-only');
    });

    it('adapts heading levels for different contexts', () => {
      const { rerender } = render(
        <OakLessonCard.Root lesson={mockLesson}>
          <OakLessonCard.Header headingLevel={1} />
        </OakLessonCard.Root>
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      rerender(
        <OakLessonCard.Root lesson={mockLesson}>
          <OakLessonCard.Header headingLevel={4} />
        </OakLessonCard.Root>
      );

      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    });

    it('handles minimal composition gracefully', () => {
      render(
        <OakLessonCard.Root lesson={mockLesson}>
          <OakLessonCard.Header />
        </OakLessonCard.Root>
      );

      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute('aria-labelledby', 'lesson-title-test-lesson-123');
      // Should not have aria-describedby when no actions are present
      expect(article).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('Context Error Handling', () => {
    it('throws helpful error when compound components used outside Root', () => {
      // Capture console.error to avoid test noise
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<OakLessonCard.Header />);
      }).toThrow(/compound components must be used within LessonCard.Root/);

      consoleSpy.mockRestore();
    });
  });
});
```

## Pattern 2: Higher-Order Component for Accessibility Enhancement

### Example: withAccessibilityAnnouncements HOC

This pattern demonstrates how to enhance components with accessibility features while maintaining testability.

### Implementation

```typescript
// components/SharedComponents/hoc/withAccessibilityAnnouncements.tsx
import React, { useRef, useCallback } from 'react';

export interface AccessibilityAnnouncementProps {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  clearAnnouncements: () => void;
}

export interface WithAccessibilityAnnouncementsOptions {
  defaultPriority?: 'polite' | 'assertive';
  announceChanges?: boolean;
  debounceMs?: number;
}

export function withAccessibilityAnnouncements<P extends object>(
  WrappedComponent: React.ComponentType<P & AccessibilityAnnouncementProps>,
  options: WithAccessibilityAnnouncementsOptions = {}
) {
  const {
    defaultPriority = 'polite',
    announceChanges = true,
    debounceMs = 150
  } = options;

  return React.forwardRef<any, P>((props, ref) => {
    const politeRef = useRef<HTMLDivElement>(null);
    const assertiveRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const announceToScreenReader = useCallback((
      message: string,
      priority: 'polite' | 'assertive' = defaultPriority
    ) => {
      // Clear any pending announcements
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce announcements to prevent spam
      debounceRef.current = setTimeout(() => {
        const targetRef = priority === 'assertive' ? assertiveRef : politeRef;
        if (targetRef.current) {
          targetRef.current.textContent = message;

          // Clear after announcement to allow repeat announcements of same message
          setTimeout(() => {
            if (targetRef.current) {
              targetRef.current.textContent = '';
            }
          }, 100);
        }
      }, debounceMs);
    }, [defaultPriority, debounceMs]);

    const clearAnnouncements = useCallback(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (politeRef.current) politeRef.current.textContent = '';
      if (assertiveRef.current) assertiveRef.current.textContent = '';
    }, []);

    // Clean up debounce on unmount
    React.useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <>
        <WrappedComponent
          {...props}
          ref={ref}
          announceToScreenReader={announceToScreenReader}
          clearAnnouncements={clearAnnouncements}
        />
        {/* Live regions for screen reader announcements */}
        <div
          ref={politeRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          data-testid="polite-announcements"
        />
        <div
          ref={assertiveRef}
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
          data-testid="assertive-announcements"
        />
      </>
    );
  });
}

// Example usage: Enhanced Lesson Progress Component
interface LessonProgressProps {
  currentStep: number;
  totalSteps: number;
  lessonTitle: string;
}

const BaseLessonProgress: React.FC<LessonProgressProps & AccessibilityAnnouncementProps> = ({
  currentStep,
  totalSteps,
  lessonTitle,
  announceToScreenReader,
  clearAnnouncements
}) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // Announce progress changes
  React.useEffect(() => {
    if (currentStep > 0) {
      const message = `Progress update: Step ${currentStep} of ${totalSteps}, ${progressPercent}% complete`;
      announceToScreenReader(message, 'polite');
    }
  }, [currentStep, totalSteps, progressPercent, announceToScreenReader]);

  // Announce completion
  React.useEffect(() => {
    if (currentStep === totalSteps) {
      announceToScreenReader(`Lesson "${lessonTitle}" completed successfully!`, 'assertive');
    }
  }, [currentStep, totalSteps, lessonTitle, announceToScreenReader]);

  return (
    <div role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="progress-text">
        Step {currentStep} of {totalSteps} ({progressPercent}%)
      </span>
    </div>
  );
};

export const LessonProgress = withAccessibilityAnnouncements(BaseLessonProgress, {
  defaultPriority: 'polite',
  announceChanges: true,
  debounceMs: 200
});
```

### Testing the HOC

```typescript
// components/SharedComponents/hoc/__tests__/withAccessibilityAnnouncements.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { withAccessibilityAnnouncements } from '../withAccessibilityAnnouncements';
import type { AccessibilityAnnouncementProps } from '../withAccessibilityAnnouncements';

// Test component
interface TestComponentProps {
  message: string;
  triggerAnnouncement?: boolean;
  announcementPriority?: 'polite' | 'assertive';
}

const TestComponent: React.FC<TestComponentProps & AccessibilityAnnouncementProps> = ({
  message,
  triggerAnnouncement = false,
  announcementPriority = 'polite',
  announceToScreenReader,
  clearAnnouncements
}) => {
  React.useEffect(() => {
    if (triggerAnnouncement) {
      announceToScreenReader(message, announcementPriority);
    }
  }, [triggerAnnouncement, message, announcementPriority, announceToScreenReader]);

  return (
    <div>
      <button onClick={() => announceToScreenReader(message, announcementPriority)}>
        Announce Message
      </button>
      <button onClick={clearAnnouncements}>
        Clear Announcements
      </button>
      <span>Test Component Content</span>
    </div>
  );
};

const EnhancedTestComponent = withAccessibilityAnnouncements(TestComponent);

describe('withAccessibilityAnnouncements HOC', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('enhances component with announcement capabilities', async () => {
    render(
      <EnhancedTestComponent
        message="Test announcement"
        triggerAnnouncement={true}
      />
    );

    // Component should render normally
    expect(screen.getByText('Test Component Content')).toBeInTheDocument();

    // Live regions should be present
    expect(screen.getByTestId('polite-announcements')).toBeInTheDocument();
    expect(screen.getByTestId('assertive-announcements')).toBeInTheDocument();

    // Advance timers to trigger debounced announcement
    jest.advanceTimersByTime(200);

    await waitFor(() => {
      const politeRegion = screen.getByTestId('polite-announcements');
      expect(politeRegion).toHaveTextContent('Test announcement');
    });
  });

  it('supports both polite and assertive announcements', async () => {
    render(
      <EnhancedTestComponent
        message="Urgent message"
        announcementPriority="assertive"
        triggerAnnouncement={true}
      />
    );

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      const assertiveRegion = screen.getByTestId('assertive-announcements');
      expect(assertiveRegion).toHaveTextContent('Urgent message');
    });

    // Polite region should remain empty
    expect(screen.getByTestId('polite-announcements')).toHaveTextContent('');
  });

  it('debounces rapid announcements', async () => {
    const { rerender } = render(
      <EnhancedTestComponent message="First message" triggerAnnouncement={true} />
    );

    // Trigger multiple rapid updates
    rerender(<EnhancedTestComponent message="Second message" triggerAnnouncement={true} />);
    rerender(<EnhancedTestComponent message="Final message" triggerAnnouncement={true} />);

    // Only advance past debounce period once
    jest.advanceTimersByTime(200);

    await waitFor(() => {
      const politeRegion = screen.getByTestId('polite-announcements');
      // Should only show the final message due to debouncing
      expect(politeRegion).toHaveTextContent('Final message');
    });
  });

  it('clears announcements when requested', async () => {
    render(
      <EnhancedTestComponent message="Clear this message" triggerAnnouncement={true} />
    );

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(screen.getByTestId('polite-announcements')).toHaveTextContent('Clear this message');
    });

    // Click clear button
    fireEvent.click(screen.getByText('Clear Announcements'));

    expect(screen.getByTestId('polite-announcements')).toHaveTextContent('');
  });

  it('handles manual announcements via button', async () => {
    render(<EnhancedTestComponent message="Manual announcement" />);

    fireEvent.click(screen.getByText('Announce Message'));

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(screen.getByTestId('polite-announcements')).toHaveTextContent('Manual announcement');
    });
  });

  it('auto-clears announcements after brief delay', async () => {
    render(
      <EnhancedTestComponent message="Auto-clear test" triggerAnnouncement={true} />
    );

    jest.advanceTimersByTime(200); // Trigger announcement

    await waitFor(() => {
      expect(screen.getByTestId('polite-announcements')).toHaveTextContent('Auto-clear test');
    });

    jest.advanceTimersByTime(100); // Auto-clear timeout

    await waitFor(() => {
      expect(screen.getByTestId('polite-announcements')).toHaveTextContent('');
    });
  });

  it('maintains proper ARIA live region attributes', () => {
    render(<EnhancedTestComponent message="Test" />);

    const politeRegion = screen.getByTestId('polite-announcements');
    const assertiveRegion = screen.getByTestId('assertive-announcements');

    expect(politeRegion).toHaveAttribute('aria-live', 'polite');
    expect(politeRegion).toHaveAttribute('aria-atomic', 'true');
    expect(politeRegion).toHaveClass('sr-only');

    expect(assertiveRegion).toHaveAttribute('aria-live', 'assertive');
    expect(assertiveRegion).toHaveAttribute('aria-atomic', 'true');
    expect(assertiveRegion).toHaveClass('sr-only');
  });
});
```

## Pattern 3: Custom Hook with Built-in Testing Support

### Example: useKeyboardNavigation Hook

This pattern shows how to create hooks that are inherently testable and include accessibility features.

### Implementation

```typescript
// hooks/useKeyboardNavigation.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export interface KeyboardNavigationItem {
  id: string;
  element: HTMLElement;
  label: string;
  disabled?: boolean;
}

export interface UseKeyboardNavigationOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  autoFocus?: boolean;
  onNavigate?: (item: KeyboardNavigationItem, direction: string) => void;
  onActivate?: (item: KeyboardNavigationItem) => void;
}

export interface UseKeyboardNavigationReturn {
  // State
  currentIndex: number;
  currentItem: KeyboardNavigationItem | null;
  items: KeyboardNavigationItem[];

  // Actions
  registerItem: (item: KeyboardNavigationItem) => void;
  unregisterItem: (id: string) => void;
  navigateToIndex: (index: number) => void;
  navigateToItem: (id: string) => void;
  activateCurrentItem: () => void;
  reset: () => void;

  // Event handlers
  handleKeyDown: (event: React.KeyboardEvent) => void;

  // ARIA attributes for container
  getContainerProps: () => {
    role: string;
    'aria-orientation'?: 'horizontal' | 'vertical';
    onKeyDown: (event: React.KeyboardEvent) => void;
  };

  // ARIA attributes for items
  getItemProps: (id: string) => {
    role: string;
    tabIndex: number;
    'aria-setsize': number;
    'aria-posinset': number;
    'aria-selected'?: boolean;
  };
}

export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {}
): UseKeyboardNavigationReturn {
  const {
    orientation = 'vertical',
    loop = true,
    autoFocus = false,
    onNavigate,
    onActivate
  } = options;

  const [items, setItems] = useState<KeyboardNavigationItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const itemsRef = useRef<Map<string, KeyboardNavigationItem>>(new Map());

  // Get current item
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  // Register/unregister items
  const registerItem = useCallback((item: KeyboardNavigationItem) => {
    itemsRef.current.set(item.id, item);
    setItems(Array.from(itemsRef.current.values()).sort((a, b) =>
      a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    ));
  }, []);

  const unregisterItem = useCallback((id: string) => {
    itemsRef.current.delete(id);
    setItems(Array.from(itemsRef.current.values()));
  }, []);

  // Navigation functions
  const navigateToIndex = useCallback((index: number) => {
    const enabledItems = items.filter(item => !item.disabled);
    if (enabledItems.length === 0) return;

    let targetIndex = Math.max(0, Math.min(index, enabledItems.length - 1));

    if (loop) {
      if (index < 0) targetIndex = enabledItems.length - 1;
      if (index >= enabledItems.length) targetIndex = 0;
    }

    const targetItem = enabledItems[targetIndex];
    const actualIndex = items.findIndex(item => item.id === targetItem.id);

    setCurrentIndex(actualIndex);
    targetItem.element.focus();

    if (onNavigate) {
      onNavigate(targetItem, index > currentIndex ? 'forward' : 'backward');
    }
  }, [items, currentIndex, loop, onNavigate]);

  const navigateToItem = useCallback((id: string) => {
    const index = items.findIndex(item => item.id === id);
    if (index >= 0) {
      navigateToIndex(index);
    }
  }, [items, navigateToIndex]);

  const activateCurrentItem = useCallback(() => {
    if (currentItem && onActivate) {
      onActivate(currentItem);
    }
  }, [currentItem, onActivate]);

  const reset = useCallback(() => {
    setCurrentIndex(-1);
  }, []);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { key } = event;

    let shouldPreventDefault = false;
    let newIndex = currentIndex;

    switch (key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = currentIndex + 1;
          shouldPreventDefault = true;
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = currentIndex - 1;
          shouldPreventDefault = true;
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = currentIndex + 1;
          shouldPreventDefault = true;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = currentIndex - 1;
          shouldPreventDefault = true;
        }
        break;
      case 'Home':
        newIndex = 0;
        shouldPreventDefault = true;
        break;
      case 'End':
        newIndex = items.length - 1;
        shouldPreventDefault = true;
        break;
      case 'Enter':
      case ' ':
        activateCurrentItem();
        shouldPreventDefault = true;
        break;
    }

    if (shouldPreventDefault) {
      event.preventDefault();
      if (newIndex !== currentIndex) {
        navigateToIndex(newIndex);
      }
    }
  }, [currentIndex, items.length, orientation, navigateToIndex, activateCurrentItem]);

  // Auto-focus first item
  useEffect(() => {
    if (autoFocus && items.length > 0 && currentIndex === -1) {
      navigateToIndex(0);
    }
  }, [autoFocus, items.length, currentIndex, navigateToIndex]);

  // Container props
  const getContainerProps = useCallback(() => ({
    role: 'listbox' as const,
    ...(orientation !== 'both' && { 'aria-orientation': orientation }),
    onKeyDown: handleKeyDown
  }), [orientation, handleKeyDown]);

  // Item props
  const getItemProps = useCallback((id: string) => {
    const index = items.findIndex(item => item.id === id);
    const isCurrent = index === currentIndex;

    return {
      role: 'option' as const,
      tabIndex: isCurrent ? 0 : -1,
      'aria-setsize': items.length,
      'aria-posinset': index + 1,
      ...(isCurrent && { 'aria-selected': true })
    };
  }, [items, currentIndex]);

  return {
    currentIndex,
    currentItem,
    items,
    registerItem,
    unregisterItem,
    navigateToIndex,
    navigateToItem,
    activateCurrentItem,
    reset,
    handleKeyDown,
    getContainerProps,
    getItemProps
  };
}

// Example usage: Lesson List with Keyboard Navigation
interface LessonListProps {
  lessons: Array<{ id: string; title: string; disabled?: boolean }>;
  onLessonSelect: (lessonId: string) => void;
}

export const LessonList: React.FC<LessonListProps> = ({ lessons, onLessonSelect }) => {
  const navigation = useKeyboardNavigation({
    orientation: 'vertical',
    loop: true,
    autoFocus: true,
    onActivate: (item) => onLessonSelect(item.id)
  });

  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Register items when they mount
  useEffect(() => {
    lessons.forEach(lesson => {
      const element = itemRefs.current.get(lesson.id);
      if (element) {
        navigation.registerItem({
          id: lesson.id,
          element,
          label: lesson.title,
          disabled: lesson.disabled
        });
      }
    });

    return () => {
      lessons.forEach(lesson => {
        navigation.unregisterItem(lesson.id);
      });
    };
  }, [lessons, navigation]);

  return (
    <div {...navigation.getContainerProps()} aria-label="Available lessons">
      {lessons.map(lesson => (
        <div
          key={lesson.id}
          ref={el => {
            if (el) itemRefs.current.set(lesson.id, el);
          }}
          {...navigation.getItemProps(lesson.id)}
          className={`lesson-item ${lesson.disabled ? 'disabled' : ''}`}
          aria-label={`Lesson: ${lesson.title}`}
        >
          {lesson.title}
        </div>
      ))}
    </div>
  );
};
```

### Testing the Custom Hook

```typescript
// hooks/__tests__/useKeyboardNavigation.test.ts
import { renderHook, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useKeyboardNavigation } from "../useKeyboardNavigation";
import type { KeyboardNavigationItem } from "../useKeyboardNavigation";

// Mock HTML elements for testing
function createMockElement(id: string): HTMLElement {
  const element = document.createElement("div");
  element.id = id;
  element.focus = jest.fn();
  element.compareDocumentPosition = jest.fn((other) => {
    // Simple mock: compare by id
    return id < other.id ? Node.DOCUMENT_POSITION_FOLLOWING : 0;
  });
  return element;
}

describe("useKeyboardNavigation", () => {
  describe("Item Registration and Management", () => {
    it("registers and tracks navigation items", () => {
      const { result } = renderHook(() => useKeyboardNavigation());

      expect(result.current.items).toHaveLength(0);
      expect(result.current.currentIndex).toBe(-1);

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].label).toBe("First Item");
    });

    it("unregisters items correctly", () => {
      const { result } = renderHook(() => useKeyboardNavigation());

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
        result.current.registerItem({
          id: "item-2",
          element: createMockElement("item-2"),
          label: "Second Item",
        });
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.unregisterItem("item-1");
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe("item-2");
    });

    it("sorts items by DOM order", () => {
      const { result } = renderHook(() => useKeyboardNavigation());

      const item3 = createMockElement("item-3");
      const item1 = createMockElement("item-1");
      const item2 = createMockElement("item-2");

      // Register in non-DOM order
      act(() => {
        result.current.registerItem({
          id: "item-3",
          element: item3,
          label: "Third",
        });
        result.current.registerItem({
          id: "item-1",
          element: item1,
          label: "First",
        });
        result.current.registerItem({
          id: "item-2",
          element: item2,
          label: "Second",
        });
      });

      // Should be sorted by DOM order (id comparison in our mock)
      expect(result.current.items.map((item) => item.id)).toEqual([
        "item-1",
        "item-2",
        "item-3",
      ]);
    });
  });

  describe("Navigation Behavior", () => {
    it("navigates to specific index", () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      const mockFocus = jest.fn();

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: { ...createMockElement("item-1"), focus: mockFocus },
          label: "First Item",
        });
        result.current.registerItem({
          id: "item-2",
          element: createMockElement("item-2"),
          label: "Second Item",
        });
      });

      act(() => {
        result.current.navigateToIndex(0);
      });

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentItem?.id).toBe("item-1");
      expect(mockFocus).toHaveBeenCalled();
    });

    it("handles looping navigation", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ loop: true }),
      );

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
        result.current.registerItem({
          id: "item-2",
          element: createMockElement("item-2"),
          label: "Second Item",
        });
      });

      // Navigate past end should loop to beginning
      act(() => {
        result.current.navigateToIndex(5);
      });

      expect(result.current.currentIndex).toBe(0);

      // Navigate before beginning should loop to end
      act(() => {
        result.current.navigateToIndex(-1);
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it("skips disabled items during navigation", () => {
      const { result } = renderHook(() => useKeyboardNavigation());

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
        result.current.registerItem({
          id: "item-2",
          element: createMockElement("item-2"),
          label: "Second Item",
          disabled: true,
        });
        result.current.registerItem({
          id: "item-3",
          element: createMockElement("item-3"),
          label: "Third Item",
        });
      });

      act(() => {
        result.current.navigateToIndex(0);
      });

      expect(result.current.currentItem?.id).toBe("item-1");

      // Should skip disabled item and go to item-3
      act(() => {
        result.current.navigateToIndex(1);
      });

      expect(result.current.currentItem?.id).toBe("item-3");
    });
  });

  describe("Keyboard Event Handling", () => {
    it("handles arrow key navigation", () => {
      const onNavigate = jest.fn();
      const { result } = renderHook(() =>
        useKeyboardNavigation({ orientation: "vertical", onNavigate }),
      );

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
        result.current.registerItem({
          id: "item-2",
          element: createMockElement("item-2"),
          label: "Second Item",
        });
      });

      // Start at first item
      act(() => {
        result.current.navigateToIndex(0);
      });

      // Create mock keyboard event
      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      Object.defineProperty(arrowDownEvent, "preventDefault", {
        value: jest.fn(),
      });

      act(() => {
        result.current.handleKeyDown(arrowDownEvent as any);
      });

      expect(result.current.currentIndex).toBe(1);
      expect(onNavigate).toHaveBeenCalledWith(
        expect.objectContaining({ id: "item-2" }),
        "forward",
      );
      expect(arrowDownEvent.preventDefault).toHaveBeenCalled();
    });

    it("handles activation keys", () => {
      const onActivate = jest.fn();
      const { result } = renderHook(() =>
        useKeyboardNavigation({ onActivate }),
      );

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
      });

      act(() => {
        result.current.navigateToIndex(0);
      });

      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      Object.defineProperty(enterEvent, "preventDefault", {
        value: jest.fn(),
      });

      act(() => {
        result.current.handleKeyDown(enterEvent as any);
      });

      expect(onActivate).toHaveBeenCalledWith(
        expect.objectContaining({ id: "item-1" }),
      );
      expect(enterEvent.preventDefault).toHaveBeenCalled();
    });

    it("respects orientation settings", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ orientation: "horizontal" }),
      );

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
        result.current.registerItem({
          id: "item-2",
          element: createMockElement("item-2"),
          label: "Second Item",
        });
      });

      act(() => {
        result.current.navigateToIndex(0);
      });

      const initialIndex = result.current.currentIndex;

      // Arrow down should not navigate in horizontal mode
      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      act(() => {
        result.current.handleKeyDown(arrowDownEvent as any);
      });

      expect(result.current.currentIndex).toBe(initialIndex);

      // Arrow right should navigate in horizontal mode
      const arrowRightEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight",
      });
      act(() => {
        result.current.handleKeyDown(arrowRightEvent as any);
      });

      expect(result.current.currentIndex).toBe(1);
    });
  });

  describe("ARIA Support", () => {
    it("provides correct container props", () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({ orientation: "horizontal" }),
      );

      const containerProps = result.current.getContainerProps();

      expect(containerProps.role).toBe("listbox");
      expect(containerProps["aria-orientation"]).toBe("horizontal");
      expect(typeof containerProps.onKeyDown).toBe("function");
    });

    it("provides correct item props", () => {
      const { result } = renderHook(() => useKeyboardNavigation());

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: createMockElement("item-1"),
          label: "First Item",
        });
        result.current.registerItem({
          id: "item-2",
          element: createMockElement("item-2"),
          label: "Second Item",
        });
      });

      act(() => {
        result.current.navigateToIndex(0);
      });

      const currentItemProps = result.current.getItemProps("item-1");
      const otherItemProps = result.current.getItemProps("item-2");

      expect(currentItemProps.role).toBe("option");
      expect(currentItemProps.tabIndex).toBe(0);
      expect(currentItemProps["aria-selected"]).toBe(true);
      expect(currentItemProps["aria-setsize"]).toBe(2);
      expect(currentItemProps["aria-posinset"]).toBe(1);

      expect(otherItemProps.tabIndex).toBe(-1);
      expect(otherItemProps["aria-selected"]).toBeUndefined();
      expect(otherItemProps["aria-posinset"]).toBe(2);
    });
  });

  describe("Auto-focus Behavior", () => {
    it("auto-focuses first item when enabled", () => {
      const mockFocus = jest.fn();
      const { result } = renderHook(() =>
        useKeyboardNavigation({ autoFocus: true }),
      );

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: { ...createMockElement("item-1"), focus: mockFocus },
          label: "First Item",
        });
      });

      expect(result.current.currentIndex).toBe(0);
      expect(mockFocus).toHaveBeenCalled();
    });

    it("does not auto-focus when disabled", () => {
      const mockFocus = jest.fn();
      const { result } = renderHook(() =>
        useKeyboardNavigation({ autoFocus: false }),
      );

      act(() => {
        result.current.registerItem({
          id: "item-1",
          element: { ...createMockElement("item-1"), focus: mockFocus },
          label: "First Item",
        });
      });

      expect(result.current.currentIndex).toBe(-1);
      expect(mockFocus).not.toHaveBeenCalled();
    });
  });
});
```

## Pattern 4: Render Props Pattern for Testable Accessibility

### Example: AccessibilityFocusManager Component

This pattern demonstrates how render props can provide accessibility features while maintaining complete testability.

### Implementation

```typescript
// components/SharedComponents/AccessibilityFocusManager/AccessibilityFocusManager.tsx
import React, { useRef, useCallback, useEffect } from 'react';

export interface FocusTarget {
  element: HTMLElement;
  priority: 'low' | 'medium' | 'high';
  reason: string;
}

export interface AccessibilityFocusManagerRenderProps {
  // Focus management
  requestFocus: (target: HTMLElement, priority?: FocusTarget['priority'], reason?: string) => void;
  releaseFocus: (target: HTMLElement) => void;
  getCurrentFocus: () => HTMLElement | null;

  // Skip links
  addSkipLink: (target: HTMLElement, label: string) => void;
  removeSkipLink: (target: HTMLElement) => void;

  // Focus restoration
  saveFocus: () => void;
  restoreFocus: () => void;

  // Accessibility announcements
  announceForScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;

  // ARIA live regions
  politeRegionRef: React.RefObject<HTMLDivElement>;
  assertiveRegionRef: React.RefObject<HTMLDivElement>;
}

export interface AccessibilityFocusManagerProps {
  children: (props: AccessibilityFocusManagerRenderProps) => React.ReactNode;
  trapFocus?: boolean;
  restoreOnUnmount?: boolean;
  skipToMainId?: string;
}

export const AccessibilityFocusManager: React.FC<AccessibilityFocusManagerProps> = ({
  children,
  trapFocus = false,
  restoreOnUnmount = true,
  skipToMainId = 'main-content'
}) => {
  const focusTargetsRef = useRef<FocusTarget[]>([]);
  const skipLinksRef = useRef<Map<HTMLElement, { label: string; skipLink: HTMLElement }>>(new Map());
  const savedFocusRef = useRef<HTMLElement | null>(null);
  const politeRegionRef = useRef<HTMLDivElement>(null);
  const assertiveRegionRef = useRef<HTMLDivElement>(null);

  // Request focus with priority system
  const requestFocus = useCallback((
    element: HTMLElement,
    priority: FocusTarget['priority'] = 'medium',
    reason: string = 'Programmatic focus request'
  ) => {
    const existingIndex = focusTargetsRef.current.findIndex(target => target.element === element);

    if (existingIndex >= 0) {
      // Update existing target
      focusTargetsRef.current[existingIndex] = { element, priority, reason };
    } else {
      // Add new target
      focusTargetsRef.current.push({ element, priority, reason });
    }

    // Sort by priority and focus the highest priority element
    const sorted = [...focusTargetsRef.current].sort((a, b) => {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const topPriority = sorted[0];
    if (topPriority && document.activeElement !== topPriority.element) {
      topPriority.element.focus();

      // Announce focus change for screen readers
      if (topPriority.priority === 'high') {
        announceForScreenReader(`Focus moved: ${topPriority.reason}`, 'assertive');
      }
    }
  }, []);

  // Release focus request
  const releaseFocus = useCallback((element: HTMLElement) => {
    focusTargetsRef.current = focusTargetsRef.current.filter(target => target.element !== element);
  }, []);

  // Get current focus
  const getCurrentFocus = useCallback(() => {
    return document.activeElement as HTMLElement | null;
  }, []);

  // Add skip link
  const addSkipLink = useCallback((target: HTMLElement, label: string) => {
    if (skipLinksRef.current.has(target)) return;

    const skipLink = document.createElement('a');
    skipLink.href = '#';
    skipLink.textContent = `Skip to ${label}`;
    skipLink.className = 'sr-only sr-only-focusable';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '0';
    skipLink.style.left = '0';
    skipLink.style.zIndex = '9999';

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      target.focus();
      announceForScreenReader(`Skipped to ${label}`, 'polite');
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
    skipLinksRef.current.set(target, { label, skipLink });
  }, []);

  // Remove skip link
  const removeSkipLink = useCallback((target: HTMLElement) => {
    const skipLinkData = skipLinksRef.current.get(target);
    if (skipLinkData) {
      document.body.removeChild(skipLinkData.skipLink);
      skipLinksRef.current.delete(target);
    }
  }, []);

  // Save current focus
  const saveFocus = useCallback(() => {
    savedFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  // Restore saved focus
  const restoreFocus = useCallback(() => {
    if (savedFocusRef.current && document.contains(savedFocusRef.current)) {
      savedFocusRef.current.focus();
      savedFocusRef.current = null;
    }
  }, []);

  // Screen reader announcements
  const announceForScreenReader = useCallback((
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const targetRef = priority === 'assertive' ? assertiveRegionRef : politeRegionRef;
    if (targetRef.current) {
      targetRef.current.textContent = message;

      // Clear after a brief moment to allow repeat announcements
      setTimeout(() => {
        if (targetRef.current) {
          targetRef.current.textContent = '';
        }
      }, 100);
    }
  }, []);

  // Focus trap effect
  useEffect(() => {
    if (!trapFocus) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trapFocus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up skip links
      skipLinksRef.current.forEach(({ skipLink }) => {
        if (document.body.contains(skipLink)) {
          document.body.removeChild(skipLink);
        }
      });

      // Restore focus if requested
      if (restoreOnUnmount) {
        restoreFocus();
      }
    };
  }, [restoreOnUnmount, restoreFocus]);

  const renderProps: AccessibilityFocusManagerRenderProps = {
    requestFocus,
    releaseFocus,
    getCurrentFocus,
    addSkipLink,
    removeSkipLink,
    saveFocus,
    restoreFocus,
    announceForScreenReader,
    politeRegionRef,
    assertiveRegionRef
  };

  return (
    <>
      {children(renderProps)}

      {/* ARIA live regions */}
      <div
        ref={politeRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="polite-announcements"
      />
      <div
        ref={assertiveRegionRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        data-testid="assertive-announcements"
      />
    </>
  );
};

// Example usage: Modal with Focus Management
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <AccessibilityFocusManager trapFocus={true} restoreOnUnmount={true}>
      {({ requestFocus, saveFocus, announceForScreenReader, addSkipLink }) => {
        // Save focus when modal opens
        React.useEffect(() => {
          if (isOpen) {
            saveFocus();

            // Focus modal after a brief delay
            setTimeout(() => {
              if (modalRef.current) {
                requestFocus(modalRef.current, 'high', `Modal opened: ${title}`);
              }
            }, 100);

            announceForScreenReader(`Modal opened: ${title}`, 'assertive');
          }
        }, [isOpen, title, saveFocus, requestFocus, announceForScreenReader]);

        return (
          <div className="modal-overlay" onClick={onClose}>
            <div
              ref={modalRef}
              className="modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            >
              <header className="modal-header">
                <h2 id="modal-title">{title}</h2>
                <button
                  className="modal-close"
                  onClick={onClose}
                  aria-label={`Close ${title} modal`}
                >
                  ×
                </button>
              </header>
              <div className="modal-body">
                {children}
              </div>
            </div>
          </div>
        );
      }}
    </AccessibilityFocusManager>
  );
};
```

### Testing the Render Props Pattern

```typescript
// components/SharedComponents/AccessibilityFocusManager/__tests__/AccessibilityFocusManager.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibilityFocusManager } from '../AccessibilityFocusManager';
import type { AccessibilityFocusManagerRenderProps } from '../AccessibilityFocusManager';

describe('AccessibilityFocusManager', () => {
  // Helper to render with test content
  function renderWithTestContent(
    testFn: (props: AccessibilityFocusManagerRenderProps) => React.ReactNode
  ) {
    return render(
      <AccessibilityFocusManager>
        {testFn}
      </AccessibilityFocusManager>
    );
  }

  beforeEach(() => {
    // Clear any existing focus
    (document.activeElement as HTMLElement)?.blur?.();
  });

  describe('Focus Management', () => {
    it('manages focus priority system', () => {
      let testProps: AccessibilityFocusManagerRenderProps;

      renderWithTestContent((props) => {
        testProps = props;
        return (
          <div>
            <button data-testid="low-priority">Low Priority</button>
            <button data-testid="medium-priority">Medium Priority</button>
            <button data-testid="high-priority">High Priority</button>
          </div>
        );
      });

      const lowButton = screen.getByTestId('low-priority');
      const mediumButton = screen.getByTestId('medium-priority');
      const highButton = screen.getByTestId('high-priority');

      // Request focus in reverse priority order
      act(() => {
        testProps!.requestFocus(lowButton, 'low', 'Low priority task');
        testProps!.requestFocus(mediumButton, 'medium', 'Medium priority task');
        testProps!.requestFocus(highButton, 'high', 'High priority task');
      });

      // High priority should win
      expect(document.activeElement).toBe(highButton);
    });

    it('releases focus correctly', () => {
      let testProps: AccessibilityFocusManagerRenderProps;

      renderWithTestContent((props) => {
        testProps = props;
        return (
          <div>
            <button data-testid="button-1">Button 1</button>
            <button data-testid="button-2">Button 2</button>
          </div>
        );
      });

      const button1 = screen.getByTestId('button-1');
      const button2 = screen.getByTestId('button-2');

      act(() => {
        testProps!.requestFocus(button1, 'medium', 'First focus');
        testProps!.requestFocus(button2, 'high', 'Second focus');
      });

      expect(document.activeElement).toBe(button2);

      act(() => {
        testProps!.releaseFocus(button2);
      });

      // Should fall back to button1 since it has the next highest priority
      expect(document.activeElement).toBe(button1);
    });

    it('saves and restores focus', () => {
      let testProps: AccessibilityFocusManagerRenderProps;

      renderWithTestContent((props) => {
        testProps = props;
        return (
          <div>
            <button data-testid="original">Original Focus</button>
            <button data-testid="temporary">Temporary Focus</button>
          </div>
        );
      });

      const originalButton = screen.getByTestId('original');
      const temporaryButton = screen.getByTestId('temporary');

      // Focus original button
      originalButton.focus();
      expect(document.activeElement).toBe(originalButton);

      // Save focus
      act(() => {
        testProps!.saveFocus();
      });

      // Move focus elsewhere
      temporaryButton.focus();
      expect(document.activeElement).toBe(temporaryButton);

      // Restore focus
      act(() => {
        testProps!.restoreFocus();
      });

      expect(document.activeElement).toBe(originalButton);
    });
  });

  describe('Skip Links', () => {
    it('creates and manages skip links', () => {
      let testProps: AccessibilityFocusManagerRenderProps;

      renderWithTestContent((props) => {
        testProps = props;
        return (
          <div>
            <main data-testid="main-content">Main Content</main>
          </div>
        );
      });

      const mainContent = screen.getByTestId('main-content');

      act(() => {
        testProps!.addSkipLink(mainContent, 'main content');
      });

      // Skip link should be added to body
      const skipLink = document.querySelector('a[href="#"]');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveTextContent('Skip to main content');

      // Clicking skip link should focus target
      fireEvent.click(skipLink!);
      expect(document.activeElement).toBe(mainContent);

      // Remove skip link
      act(() => {
        testProps!.removeSkipLink(mainContent);
      });

      expect(document.querySelector('a[href="#"]')).not.toBeInTheDocument();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('makes polite announcements', async () => {
      let testProps: AccessibilityFocusManagerRenderProps;

      renderWithTestContent((props) => {
        testProps = props;
        return <div>Test Content</div>;
      });

      act(() => {
        testProps!.announceForScreenReader('Test polite message', 'polite');
      });

      const politeRegion = screen.getByTestId('polite-announcements');
      expect(politeRegion).toHaveTextContent('Test polite message');
      expect(politeRegion).toHaveAttribute('aria-live', 'polite');

      // Message should clear after timeout
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(politeRegion).toHaveTextContent('');
    });

    it('makes assertive announcements', async () => {
      let testProps: AccessibilityFocusManagerRenderProps;

      renderWithTestContent((props) => {
        testProps = props;
        return <div>Test Content</div>;
      });

      act(() => {
        testProps!.announceForScreenReader('Urgent message', 'assertive');
      });

      const assertiveRegion = screen.getByTestId('assertive-announcements');
      expect(assertiveRegion).toHaveTextContent('Urgent message');
      expect(assertiveRegion).toHaveAttribute('aria-live', 'assertive');

      // Should not affect polite region
      const politeRegion = screen.getByTestId('polite-announcements');
      expect(politeRegion).toHaveTextContent('');
    });
  });

  describe('Focus Trap', () => {
    it('traps focus when enabled', async () => {
      const user = userEvent.setup();

      render(
        <AccessibilityFocusManager trapFocus={true}>
          {() => (
            <div>
              <button data-testid="first-button">First</button>
              <button data-testid="middle-button">Middle</button>
              <button data-testid="last-button">Last</button>
            </div>
          )}
        </AccessibilityFocusManager>
      );

      const firstButton = screen.getByTestId('first-button');
      const lastButton = screen.getByTestId('last-button');

      // Focus last button
      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);

      // Tab should wrap to first button
      await user.tab();
      expect(document.activeElement).toBe(firstButton);

      // Shift+Tab should wrap to last button
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(lastButton);
    });

    it('does not trap focus when disabled', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="outside-button">Outside</button>
          <AccessibilityFocusManager trapFocus={false}>
            {() => (
              <div>
                <button data-testid="inside-button">Inside</button>
              </div>
            )}
          </AccessibilityFocusManager>
          <button data-testid="after-button">After</button>
        </div>
      );

      const insideButton = screen.getByTestId('inside-button');
      const afterButton = screen.getByTestId('after-button');

      insideButton.focus();
      expect(document.activeElement).toBe(insideButton);

      // Tab should move to next button, not wrap
      await user.tab();
      expect(document.activeElement).toBe(afterButton);
    });
  });

  describe('Integration Testing', () => {
    it('provides complete accessibility API through render props', () => {
      let receivedProps: AccessibilityFocusManagerRenderProps;

      renderWithTestContent((props) => {
        receivedProps = props;
        return <div>Test</div>;
      });

      // Verify all expected props are provided
      expect(receivedProps!).toHaveProperty('requestFocus');
      expect(receivedProps!).toHaveProperty('releaseFocus');
      expect(receivedProps!).toHaveProperty('getCurrentFocus');
      expect(receivedProps!).toHaveProperty('addSkipLink');
      expect(receivedProps!).toHaveProperty('removeSkipLink');
      expect(receivedProps!).toHaveProperty('saveFocus');
      expect(receivedProps!).toHaveProperty('restoreFocus');
      expect(receivedProps!).toHaveProperty('announceForScreenReader');
      expect(receivedProps!).toHaveProperty('politeRegionRef');
      expect(receivedProps!).toHaveProperty('assertiveRegionRef');

      // Verify all functions are callable
      expect(typeof receivedProps!.requestFocus).toBe('function');
      expect(typeof receivedProps!.releaseFocus).toBe('function');
      expect(typeof receivedProps!.getCurrentFocus).toBe('function');
      expect(typeof receivedProps!.addSkipLink).toBe('function');
      expect(typeof receivedProps!.removeSkipLink).toBe('function');
      expect(typeof receivedProps!.saveFocus).toBe('function');
      expect(typeof receivedProps!.restoreFocus).toBe('function');
      expect(typeof receivedProps!.announceForScreenReader).toBe('function');

      // Verify refs are properly provided
      expect(receivedProps!.politeRegionRef.current).toBeInstanceOf(HTMLElement);
      expect(receivedProps!.assertiveRegionRef.current).toBeInstanceOf(HTMLElement);
    });
  });
});
```

## Key Patterns Summary

### 1. Compound Components

- **Testability**: Each sub-component can be tested independently
- **Accessibility**: Automatic ARIA coordination between components
- **Flexibility**: Composable architecture for different use cases
- **Education Focus**: Perfect for complex UI like lesson cards and curriculum browsers

### 2. Higher-Order Components (HOCs)

- **Testability**: Enhancement logic is isolated and reusable
- **Accessibility**: Consistent accessibility features across components
- **Maintenance**: Single source of truth for common functionality
- **Education Focus**: Standardizes announcements for lesson progress and status changes

### 3. Custom Hooks

- **Testability**: Business logic separated from presentation
- **Accessibility**: Built-in keyboard navigation and ARIA support
- **Reusability**: Same logic works across different UI contexts
- **Education Focus**: Keyboard navigation patterns for lesson lists and curriculum structures

### 4. Render Props

- **Testability**: Complete control over rendering and behavior testing
- **Accessibility**: Comprehensive focus and announcement management
- **Flexibility**: Maximum customization while maintaining accessibility
- **Education Focus**: Complex accessibility requirements for modals and interactive content

## Benefits for Oak's Educational Platform

### Testing Excellence

- **Isolated Logic**: Each pattern separates concerns for focused testing
- **Accessibility Validation**: Built-in accessibility testing opportunities
- **Reusable Test Utilities**: Common patterns across educational components
- **Documentation Through Tests**: Tests serve as usage examples

### Educational Domain Modeling

- **Curriculum Concepts**: Components reflect educational relationships
- **Teacher/Student Workflows**: Architecture supports different user journeys
- **Accessibility-First**: Patterns inherently support diverse learners
- **Semantic Structure**: Educational content hierarchy is preserved

### Maintenance and Evolution

- **Pattern Consistency**: Standardized approaches across the platform
- **Progressive Enhancement**: Easy to add accessibility features
- **Refactoring Safety**: Tests ensure changes don't break functionality
- **Knowledge Transfer**: Clear patterns for team understanding

---

_These component architecture patterns create a foundation where accessibility, testability, and educational purpose are naturally aligned, resulting in software that serves Oak's mission through its very structure._
