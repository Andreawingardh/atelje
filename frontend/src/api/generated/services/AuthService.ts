/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponseDto } from '../models/AuthResponseDto';
import type { EmailConfirmationResponseDto } from '../models/EmailConfirmationResponseDto';
import type { LoginDto } from '../models/LoginDto';
import type { RegisterDto } from '../models/RegisterDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param requestBody
     * @returns AuthResponseDto OK
     * @throws ApiError
     */
    public static postApiAuthRegister(
        requestBody: RegisterDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AuthResponseDto OK
     * @throws ApiError
     */
    public static postApiAuthLogin(
        requestBody: LoginDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns AuthResponseDto OK
     * @throws ApiError
     */
    public static getApiAuthMe(): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Auth/me',
        });
    }
    /**
     * @param userId
     * @param token
     * @returns EmailConfirmationResponseDto OK
     * @throws ApiError
     */
    public static getApiAuthConfirmEmail(
        userId?: string,
        token?: string,
    ): CancelablePromise<EmailConfirmationResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Auth/confirm-email',
            query: {
                'userId': userId,
                'token': token,
            },
        });
    }
    /**
     * @returns AuthResponseDto OK
     * @throws ApiError
     */
    public static postApiAuthResendConfirmationEmail(): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Auth/resend-confirmation-email',
        });
    }
}
