# Error Handling System

## Overview

The error handling system provides a unified way to handle, display, and log errors throughout the application with user-friendly messages.

## Components

### 1. Error Utilities (`src/utils/error-handler.ts`)

Core error handling logic including:
- `ApplicationError` class for structured errors
- `parseError()` to convert any error to AppError
- `getUserFacingError()` to create user-friendly messages
- `logError()` for error logging
- `handleApiError()` for HTTP response errors

### 2. Error Display Component (`src/components/ErrorDisplay.tsx`)

UI components for showing errors:
- `ErrorDisplay` - Full-page or inline error display
- `ErrorToast` - Toast notification for errors

### 3. Error Hooks (`src/hooks/useErrorHandler.ts`)

React hooks for error handling:
- `useErrorHandler()` - General error handling
- `useAsyncError()` - Async function error handling
- `useErrorToast()` - Toast notifications

## Usage Examples

### Basic Error Handling in Component

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

function MyComponent() {
  const { error, handleError, clearError } = useErrorHandler({
    logErrors: true
  });

  const fetchData = async () => {
    try {
      const response = await api.getData();
      // Handle success
    } catch (err) {
      handleError(err, { context: 'fetchData' });
    }
  };

  if (error) {
    return <ErrorDisplay error={error} onDismiss={clearError} inline />;
  }

  return <div>...</div>;
}
```

### Async Function with Error Handling

```typescript
import { useAsyncError } from '../hooks/useErrorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

function DataLoader() {
  const { execute, loading, error, retry } = useAsyncError(
    async (id: string) => {
      const response = await fetch(`/api/tours/${id}`);
      if (!response.ok) throw new Error('Failed to load tour');
      return response.json();
    },
    {
      onSuccess: (data) => console.log('Loaded:', data),
      logErrors: true
    }
  );

  useEffect(() => {
    execute('tour-123');
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay error={error} onDismiss={retry} />;

  return <div>...</div>;
}
```

### Toast Notifications

```typescript
import { useErrorToast } from '../hooks/useErrorHandler';
import { ErrorToast } from '../components/ErrorDisplay';

function MyComponent() {
  const { showError, error, clearError } = useErrorToast(5000);

  const handleAction = async () => {
    try {
      await dangerousOperation();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div>
      <button onClick={handleAction}>Do Something</button>
      {error && <ErrorToast error={error} onDismiss={clearError} />}
    </div>
  );
}
```

### Handling API Errors

```typescript
import { ApplicationError, ErrorType, handleApiError } from '../utils/error-handler';

async function apiCall() {
  try {
    const response = await fetch('/api/endpoint');

    if (!response.ok) {
      const data = await response.json();
      throw handleApiError(response, data);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApplicationError) {
      // Handle structured error
      console.log('Error type:', error.type);
      console.log('Status:', error.statusCode);
    }
    throw error;
  }
}
```

### Custom Error Types

```typescript
import { ApplicationError, ErrorType } from '../utils/error-handler';

// Create custom validation error
throw new ApplicationError(
  ErrorType.VALIDATION,
  'Email address is already registered',
  {
    code: 'EMAIL_EXISTS',
    details: { email: 'user@example.com' }
  }
);

// Create custom network error
throw new ApplicationError(
  ErrorType.NETWORK,
  'Unable to connect to server',
  {
    originalError: new Error('Connection timeout')
  }
);
```

### Form with Error Handling

```typescript
import { useState } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ApplicationError, ErrorType } from '../utils/error-handler';
import ErrorDisplay from '../components/ErrorDisplay';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { error, handleError, clearError } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      // Validation
      if (!formData.email) {
        throw new ApplicationError(
          ErrorType.VALIDATION,
          'Email is required'
        );
      }

      // API call
      const response = await login(formData.email, formData.password);

      if (!response.ok) {
        throw handleApiError(response, await response.json());
      }

      // Success handling
      navigate('/dashboard');
    } catch (err) {
      handleError(err, { formData: { email: formData.email } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <ErrorDisplay
          error={error}
          onDismiss={clearError}
          inline
        />
      )}

      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <button type="submit">Login</button>
    </form>
  );
}
```

### Error Handling with Retry

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';

function DataFetcher() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch('/api/data');
    const json = await response.json();
    setData(json);
  };

  const { error, handleError, clearError, retry } = useErrorHandler({
    onRetry: fetchData,
    logErrors: true
  });

  useEffect(() => {
    fetchData().catch(handleError);
  }, []);

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onDismiss={clearError}
      />
    );
  }

  return <div>{JSON.stringify(data)}</div>;
}
```

## Error Types

The system supports the following error types:

- **NETWORK** - Connection issues, timeouts
- **AUTHENTICATION** - Login required, session expired
- **AUTHORIZATION** - Permission denied
- **VALIDATION** - Invalid input, validation errors
- **NOT_FOUND** - Resource not found (404)
- **SERVER** - Server errors (500+)
- **UNKNOWN** - Unexpected errors

## User-Facing Messages

Each error type has a default user-friendly message:

| Type | Title | Default Message |
|------|-------|-----------------|
| NETWORK | Connection Error | Unable to connect to the server... |
| AUTHENTICATION | Session Expired | Your session has expired... |
| AUTHORIZATION | Access Denied | You do not have permission... |
| VALIDATION | Invalid Input | Please check your input... |
| NOT_FOUND | Not Found | The requested resource could not be found... |
| SERVER | Server Error | A server error occurred... |
| UNKNOWN | Something Went Wrong | An unexpected error occurred... |

## Error Logging

Errors are automatically logged with:
- Error type and message
- Status code (if available)
- Additional context
- User agent and URL
- Timestamp

In production, errors are sent to error tracking services (configure in `logError()`).

## Best Practices

### 1. Always Use Structured Errors

```typescript
// ❌ Bad
throw new Error('Something went wrong');

// ✅ Good
throw new ApplicationError(
  ErrorType.VALIDATION,
  'Email format is invalid',
  { code: 'INVALID_EMAIL' }
);
```

### 2. Provide Context

```typescript
try {
  await updateProfile(userId, data);
} catch (err) {
  handleError(err, {
    action: 'updateProfile',
    userId,
    timestamp: Date.now()
  });
}
```

### 3. Handle Errors at the Right Level

```typescript
// ❌ Bad - catching too early
async function fetchUser() {
  try {
    return await api.getUser();
  } catch (err) {
    console.error(err); // Don't handle here
    throw err;
  }
}

// ✅ Good - let component handle
async function fetchUser() {
  return await api.getUser();
}

function UserProfile() {
  const { error, handleError } = useErrorHandler();

  useEffect(() => {
    fetchUser().catch(handleError);
  }, []);
}
```

### 4. Clear Errors Appropriately

```typescript
// Clear error when user takes action
const handleRetry = () => {
  clearError();
  loadData();
};

// Clear error when navigating away
useEffect(() => {
  return () => clearError();
}, []);
```

### 5. Provide Retry Actions

```typescript
const { error, retry } = useErrorHandler({
  onRetry: () => fetchData()
});

// Error will automatically include retry button
<ErrorDisplay error={error} />
```

## Migration Guide

### Old Pattern

```typescript
const [error, setError] = useState('');

try {
  await apiCall();
} catch (err) {
  setError(err.message);
}

{error && <div className="error">{error}</div>}
```

### New Pattern

```typescript
const { error, handleError, clearError } = useErrorHandler();

try {
  await apiCall();
} catch (err) {
  handleError(err);
}

{error && <ErrorDisplay error={error} onDismiss={clearError} inline />}
```

## Integration with Existing Code

The error handling system is designed to work alongside existing error handling. You can gradually migrate components without breaking existing functionality.

1. Start with new components
2. Migrate high-traffic pages
3. Update API services
4. Refactor legacy error handling

## Troubleshooting

### Error not showing

- Check if error is being handled: `console.log(error)`
- Verify ErrorDisplay is rendered
- Check CSS classes are not hiding component

### Toast not dismissing

- Ensure `clearError()` is called
- Check timeout duration
- Verify toast component is mounted

### Retry not working

- Provide `onRetry` function to `useErrorHandler`
- Ensure retry function is async if needed
- Check for infinite retry loops
