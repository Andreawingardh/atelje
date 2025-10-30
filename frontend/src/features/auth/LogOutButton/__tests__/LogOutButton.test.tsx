import { AuthResponseDto, AuthService, OpenAPI } from "@/api/generated";
import { AuthProvider, useAuth, AuthContextType } from "@/contexts/AuthContext";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  renderHook,
  RenderHookResult,
  waitFor,
  act,
} from "@testing-library/react";

import LogOutButton from "../LogOutButton";

jest.mock("@/api/generated");

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Logout button", () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  test("redirects user to login", async () => {
    //Arrange
    await act(async () => {
      render(
        <AuthProvider>
          <LogOutButton />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(AuthService.getApiAuthMe).toHaveBeenCalled();
    });

    const button = screen.getByRole("button", { name: /logout/i });

    //Act
    await act(async () => {
      fireEvent.click(button);
    });
    //Assert
    await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
  test("redirects user to login page", async () => {});
});