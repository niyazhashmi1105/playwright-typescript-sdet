import { APIRequestContext, APIResponse } from "@playwright/test";


export class APIUtils {

    private constructor() { }


    static async postRequest(
        request: APIRequestContext,
        url: string,
        body: any,
        headers?: Record<string, string>
    ): Promise<APIResponse> {

        const response = await request.post(url, {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            data: body
        });

        return response;
    }


    static async getRequest(
        request: APIRequestContext,
        url: string,
        queryParams?: Record<string, string | number>,
        pathParams?: Record<string, string | number>): Promise<APIResponse> {

        if (queryParams) {
            const query = new URLSearchParams(queryParams as Record<string, string>).toString();
            url += `?${query}`;
        }

        if (pathParams) {
            for (const key in pathParams) {
                url = url.replace(`{${key}}`, String(pathParams[key]));
            }
            console.log(url)
        }
        const response = await request.get(url);
        return response;
    }


    static async putRequest(
        request: APIRequestContext,
        url: string,
        body: any,
        headers?: Record<string, string>
    ): Promise<APIResponse> {

        const response = await request.put(url, {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            data: body
        });

        return response;
    }

    static async deleteRequest(
        request: APIRequestContext,
        url: string) {
        const response = await request.delete(url);

        return response;

    }

}