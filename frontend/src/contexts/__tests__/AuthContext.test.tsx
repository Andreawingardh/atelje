import { AuthResponseDto, AuthService, OpenAPI } from "@/api/generated";
import { AuthProvider, useAuth, AuthContextType } from "../AuthContext";
import { renderHook, RenderHookResult, waitFor, act } from "@testing-library/react";

jest.mock("@/api/generated");

describe("after logout, user and tokens are removed", () => {
  let result: RenderHookResult<AuthContextType, unknown>;
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
    result = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => {
      expect(result.result.current.user).not.toBeNull();
    });
  });
  test("AuthContext logout", async () => {
    //Arrange

    //Act
    act(() => {
      result.result.current.logout();
    });

    //Assert
    const token = localStorage.getItem("auth-token");
    const user = result.result.current.user;

    expect(OpenAPI.TOKEN).toBe(undefined);

    expect(token).toBe(null);
    expect(user).toBe(null);
  });
});
