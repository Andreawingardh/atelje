# Jest Testing Guide for Frontend

## Setup Overview

This project uses Jest with React Testing Library for unit testing React components and hooks.

**Key Technologies:**
- Jest 29.7.0
- @testing-library/react 16.x
- Next.js 15.5.5 with App Router
- TypeScript
- ES Modules

---

## Configuration Files

### jest.config.mjs
```javascript
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(customJestConfig)
```

### jest.setup.js
```javascript
import '@testing-library/jest-dom'
```

### package.json scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## Important Notes

### Node.js Version Warnings
- Project uses Node v23.x
- Jest packages show `EBADENGINE` warnings (they specify support for v18, v20, v22, v24+)
- **These warnings are safe to ignore** - Jest works fine on v23
- The warnings exist because v23 is a "Current" release, not LTS

### ES Modules
- Use `.mjs` extension for jest.config (not .js or .ts)
- Regular test files use `.tsx` extension

---

## Test File Structure

### Location
Place tests in `__tests__` folders next to the code being tested:
```
src/
  contexts/
    AuthContext.tsx
    __tests__/
      AuthContext.test.tsx
```

### Basic Test Structure
```typescript
import { renderHook, act, waitFor, RenderHookResult } from '@testing-library/react';
import { useAuth, AuthProvider, AuthContextType } from '../AuthContext';
import { AuthService, OpenAPI } from '@/api/generated';

// Mock external dependencies
jest.mock('@/api/generated');

describe('what you are testing', () => {
  let result: RenderHookResult<AuthContextType, unknown>;
  
  beforeEach(async () => {
    // Setup that runs before each test
    // - Create mock data
    // - Configure mocks
    // - Set up initial state
    // - Render hooks/components
  });
  
  test('specific behavior to test', () => {
    // Arrange - set up test-specific data
    // Act - perform the action being tested
    // Assert - verify the results
  });
});
```

---

## Key Concepts

### 1. Mocking API Calls

When testing components that use generated API clients:

```typescript
jest.mock('@/api/generated');

const fakeUser = {
  token: "fake-token",
  userId: "fake-id",
  email: "test@test.com",
  userName: "Test User"
};

const mockGetApiAuthMe = jest.mocked(AuthService.getApiAuthMe);
mockGetApiAuthMe.mockResolvedValue(fakeUser);
```

**Why:** Prevents real HTTP calls during tests and gives you control over responses.

### 2. Testing React Hooks

Use `renderHook` to test custom hooks:

```typescript
const result = renderHook(() => useAuth(), { 
  wrapper: AuthProvider 
});

// Access hook values
result.result.current.user
result.result.current.logout()
```

**Note:** The actual structure is `result.result.current` (nested result property).

### 3. Variable Scope in Tests

Declare variables outside beforeEach so tests can access them:

```typescript
describe('...', () => {
  let result: RenderHookResult<AuthContextType, unknown>;
  
  beforeEach(() => {
    result = renderHook(...); // Assigned here
  });
  
  test('...', () => {
    result.result.current.logout(); // Used here
  });
});
```

### 4. Async Operations and Timing

**Problem:** React hooks with async operations (useEffect, API calls) don't complete instantly.

**Solution:** Wait for async operations to complete:

```typescript
beforeEach(async () => {
  // Set up state BEFORE rendering
  localStorage.setItem('auth-token', 'fake-token');
  OpenAPI.TOKEN = 'fake-token';
  
  // Then render (this triggers useEffect)
  result = renderHook(() => useAuth(), { wrapper: AuthProvider });
  
  // Wait for async operations to complete
  await waitFor(() => {
    expect(result.result.current.user).not.toBeNull();
  });
});
```

### 5. React State Updates with act()

**Problem:** React batches state updates, they don't apply immediately.

**Solution:** Wrap actions that cause state updates in `act()`:

```typescript
test('logout clears user', () => {
  // Act - wrap state-changing actions
  act(() => {
    result.result.current.logout();
  });
  
  // Assert - now state updates have been applied
  expect(result.result.current.user).toBeNull();
});
```

---

## Example: Testing AuthContext Logout

```typescript
import { renderHook, act, waitFor, RenderHookResult } from '@testing-library/react';
import { AuthProvider, useAuth, AuthContextType } from '../AuthContext';
import { AuthService, OpenAPI, AuthResponseDto } from '@/api/generated';

jest.mock('@/api/generated');

describe('AuthContext logout', () => {
  let result: RenderHookResult<AuthContextType, unknown>;
  
  beforeEach(async () => {
    // Create fake user data
    const fakeUser: AuthResponseDto = {
      token: 'fake-token-123',
      userId: 'fake-user-id',
      email: 'test@test.com',
      userName: 'Test user',
    };
    
    // Configure mock to return fake user
    const mockGetApiAuthMe = jest.mocked(AuthService.getApiAuthMe);
    mockGetApiAuthMe.mockResolvedValue(fakeUser);
    
    // Set up logged-in state BEFORE rendering
    OpenAPI.TOKEN = 'fake-token-123';
    localStorage.setItem('auth-token', 'fake-token-123');
    
    // Render the hook (triggers useEffect)
    result = renderHook(() => useAuth(), { wrapper: AuthProvider });
    
    // Wait for async login to complete
    await waitFor(() => {
      expect(result.result.current.user).not.toBeNull();
    });
  });
  
  test('clears user, removes token from localStorage, and clears OpenAPI.TOKEN', () => {
    // Act - call logout (wrapped in act for state updates)
    act(() => {
      result.result.current.logout();
    });
    
    // Assert - verify everything is cleared
    const token = localStorage.getItem('auth-token');
    const user = result.result.current.user;
    
    expect(OpenAPI.TOKEN).toBeUndefined();
    expect(token).toBeNull();
    expect(user).toBeNull();
  });
});
```

---

## Common Issues and Solutions

### Issue: Property 'mockResolvedValue' does not exist
**Cause:** TypeScript doesn't know the function is mocked  
**Solution:** Use `jest.mocked()` to cast it:
```typescript
const mockFn = jest.mocked(AuthService.someMethod);
mockFn.mockResolvedValue(data);
```

### Issue: "not wrapped in act(...)" warning
**Cause:** State update happening outside act()  
**Solution:** Wrap the action that causes the update:
```typescript
act(() => {
  result.result.current.logout();
});
```

### Issue: Test fails because async operation hasn't completed
**Cause:** useEffect or API call still running  
**Solution:** Use `waitFor()` to wait for condition:
```typescript
await waitFor(() => {
  expect(result.result.current.user).not.toBeNull();
});
```

### Issue: Can't access result in test
**Cause:** Variable declared inside beforeEach  
**Solution:** Declare at describe level:
```typescript
describe('...', () => {
  let result; // Declare here
  beforeEach(() => {
    result = ...; // Assign here
  });
});
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test AuthContext.test.tsx
```

---

## What We Tested

**AuthContext.logout()** - Verified that:
- User state is cleared to null
- Token is removed from localStorage
- OpenAPI.TOKEN is set to undefined

**Why this is sufficient:**
- ProtectedRoute relies on `user` being null to redirect
- If logout clears user to null, ProtectedRoute will function correctly
- The component is simple enough that additional testing provides diminishing returns

---

## Future Testing Considerations

Other tests you could add (if needed):
- `login()` function behavior
- `register()` function behavior  
- Error handling in auth functions
- ProtectedRoute component (if logic becomes more complex)

Remember: Test what provides value. Simple, deterministic code may not need tests.
