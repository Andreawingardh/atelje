/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDesignDto } from '../models/CreateDesignDto';
import type { DesignDto } from '../models/DesignDto';
import type { RequestScreenshotUrlsDto } from '../models/RequestScreenshotUrlsDto';
import type { ScreenshotUrlsDto } from '../models/ScreenshotUrlsDto';
import type { UpdateDesignDto } from '../models/UpdateDesignDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DesignService {
    /**
     * @returns DesignDto OK
     * @throws ApiError
     */
    public static getAllDesigns(): CancelablePromise<Array<DesignDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Design',
        });
    }
    /**
     * @param requestBody
     * @returns DesignDto OK
     * @throws ApiError
     */
    public static createDesign(
        requestBody: CreateDesignDto,
    ): CancelablePromise<DesignDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Design',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns DesignDto OK
     * @throws ApiError
     */
    public static getMyDesigns(): CancelablePromise<Array<DesignDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Design/my-designs',
        });
    }
    /**
     * @param id
     * @returns DesignDto OK
     * @throws ApiError
     */
    public static getDesignById(
        id: number,
    ): CancelablePromise<DesignDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Design/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns DesignDto OK
     * @throws ApiError
     */
    public static updateDesign(
        id: number,
        requestBody: UpdateDesignDto,
    ): CancelablePromise<DesignDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Design/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns DesignDto OK
     * @throws ApiError
     */
    public static deleteDesign(
        id: number,
    ): CancelablePromise<DesignDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Design/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ScreenshotUrlsDto OK
     * @throws ApiError
     */
    public static getScreenshotUploadUrls(
        requestBody: RequestScreenshotUrlsDto,
    ): CancelablePromise<ScreenshotUrlsDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Design/screenshots/upload-urls',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
