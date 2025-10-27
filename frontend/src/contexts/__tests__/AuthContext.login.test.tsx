import {
  AuthResponseDto,
  AuthService,
  OpenAPI,
  UserService,
} from "@/api/generated";
import { AuthProvider, useAuth, AuthContextType } from "../AuthContext";
import {
  renderHook,
  RenderHookResult,
  waitFor,
  act,
} from "@testing-library/react";

jest.mock("@/api/generated");

describe("AuthContext login function", () => {
  let authResult: RenderHookResult<AuthContextType, unknown>;
  let fakeUser: AuthResponseDto;
  beforeEach(() => {
    fakeUser = {
      token: "fake-token-123",
      userId: "fake-user-id",
      email: "test@test.com",
      userName: "Test user",
    };
      
    OpenAPI.TOKEN = undefined;
    localStorage.clear();

    const mockApiLoginFunction = jest.mocked(AuthService.postApiAuthLogin);
    mockApiLoginFunction.mockResolvedValue(fakeUser);

    authResult = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(authResult.result.current.user).toBeNull();
  });
  test("sets OpenAPI.Token", async () => {
    //Act
    await act(async () => {
      await authResult.result.current.login(fakeUser.email!, "test-password");
    });

    //Assert
    expect(OpenAPI.TOKEN).toBe("fake-token-123");
  });
  test("stores token in localStorage", async () => {
    await act(async () => {
      await authResult.result.current.login(fakeUser.email!, "test-password");
    });
    const token = localStorage.getItem("auth-token");

    expect(token).toBe("fake-token-123");
  });
  test("updates user state in context", async () => {
    await act(async () => {
      await authResult.result.current.login(fakeUser.email!, "test-password");
    });
    const user = authResult.result.current.user;

    expect(user).toBe(fakeUser);
  });
});
