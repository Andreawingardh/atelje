import { AuthResponseDto, AuthService, OpenAPI } from "@/api/generated";
import { AuthProvider, useAuth, AuthContextType } from "../AuthContext";
import {
  renderHook,
  RenderHookResult,
  waitFor,
  act,
} from "@testing-library/react";

jest.mock("@/api/generated");

describe("Authcontext logout function", () => {
  let authResult: RenderHookResult<AuthContextType, unknown>;
  beforeEach(async () => {
    const fakeUser: AuthResponseDto = {
      token: "fake-token-123",
      userId: "fake-user-id",
      email: "test@test.com",
      userName: "Test user",
    };
    const mockGetApiAuthMe = jest.mocked(AuthService.getApiAuthMe);
    mockGetApiAuthMe.mockResolvedValue(fakeUser);

    OpenAPI.TOKEN = "fake-token-123";
    localStorage.setItem("auth-token", "fake-token-123");
    authResult = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => {
      expect(authResult.result.current.user).not.toBeNull();
    });
  });
  test("sets OPEN.API.TOKEN to undefined", async () => {
    //Arrange

    //Act
    act(() => {
      authResult.result.current.logout();
    });

    //Assert

    expect(OpenAPI.TOKEN).toBe(undefined);
  });
  test(" sets auth-token in localstorage to null", async () => {
    //Arrange

    //Act
    act(() => {
      authResult.result.current.logout();
    });

    //Assert
    const token = localStorage.getItem("auth-token");

    expect(token).toBe(null);
  });
  test("sets user in AuthContext to null", async () => {
    //Arrange

    //Act
    act(() => {
      authResult.result.current.logout();
    });

    //Assert
    const user = authResult.result.current.user;

    expect(user).toBe(null);
  });
});