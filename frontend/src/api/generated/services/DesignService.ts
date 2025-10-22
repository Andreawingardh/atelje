/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DesignService {
    /**
     * @returns any[] OK
     * @throws ApiError
     */
    public static getAllDesigns(): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Design',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static getDesignById(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Design/{id}',
            path: {
                'id': id,
            },
        });
    }
}
