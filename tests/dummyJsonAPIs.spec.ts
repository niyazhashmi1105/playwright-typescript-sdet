import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { APIUtils } from '../utils/apiutils';
import { SchemaValidator } from '../utils/schemaValidator';

let baseURL = 'https://dummyjson.com';
let accessToken;

test('Post Request with Headers and Body @smoke', async ({ request }) => {

        const response = await request.post('https://dummyjson.com/auth/login', {
                headers: {
                        'Content-Type': 'application/json'
                },
                data: {
                        "username": 'emilys',
                        "password": 'emilyspass'
                }
        });

        console.log(await response.json())

})

test('Post Request with Headers and Request Body @smoke', async ({ request }) => {

        const response = await APIUtils.postRequest(request, baseURL + '/auth/login',

                {
                        username: 'emilys',
                        password: 'emilyspass'
                }
        );

        const responseBody = await response.json()
        //console.log(responseBody)
        accessToken = responseBody.accessToken;
        console.log(accessToken);
        expect(response.status()).toBe(200);
        expect(responseBody.accessToken).toBeDefined();
        expect(responseBody.id).toBeGreaterThan(0);
        expect(responseBody.email).toEqual('emily.johnson@x.dummyjson.com');
        expect(responseBody).toHaveProperty('gender');
        expect(responseBody.image).toContain('icon/emilys/128');

})

test('Get Request for All Products @smoke', async ({ request }) => {

        const response = await APIUtils.getRequest(request, baseURL + '/products')
        console.log(await response.json());
        const responseBody = await response.json();

        console.log(responseBody)

        //Basic Assertion
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

        //TOP-LEVEL FIELD VALIDATION
        expect(responseBody).toHaveProperty('products');
        expect(responseBody).toHaveProperty('total');
        expect(responseBody).toHaveProperty('skip');
        expect(responseBody).toHaveProperty('limit');

        //ARRAY VALIDATION
        expect(Array.isArray(responseBody.products)).toBeTruthy();
        expect(responseBody.total).toBeGreaterThan(0);
        expect(responseBody.limit).toBeGreaterThan(0);
        expect(responseBody.products.length).toBeGreaterThan(0);
        expect(responseBody.products.length).toBeLessThanOrEqual(responseBody.limit);

        const product = responseBody.products[0];

        //OBJECT STRUCTURE VALIDATION (FIRST ITEM)
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('rating');
        expect(product).toHaveProperty('category');

        //DATA TYPE VALIDATION
        expect(typeof product.id).toBe('number');
        expect(typeof product.title).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(typeof product.rating).toBe('number');

        //Value Assertion
        expect(product.price).toBeGreaterThan(0);
        expect(product.rating).toBeGreaterThanOrEqual(0);
        expect(product.rating).toBeLessThanOrEqual(5);

        //Array Field Validation
        expect(Array.isArray(product.images)).toBeTruthy();
        expect(product.images.length).toBeGreaterThan(0);

        //Conditional Validation
        if (product.stock < 10) {
                expect(product.availabilityStatus).toBe('In Stock');
        }

        //Loop Validation
        for (const item of responseBody.products) {
                expect(item.id).toBeGreaterThan(0);
                expect(item.title).not.toBe('');
                expect(item.price).toBeGreaterThan(0);
        }
})

test('Get All Products Schema Validation @smoke', async ({ request }) => {

        const response = await APIUtils.getRequest(request, baseURL + '/products')
        //console.log(await response.json());
        const responseBody = await response.json();

        const schema = {
                "type": "object",
                "properties": {
                        "products": {
                                "type": "array",
                                "items": {
                                        "type": "object",
                                        "properties": {
                                                "id": {
                                                        "type": "integer"
                                                },
                                                "title": {
                                                        "type": "string"
                                                },
                                                "description": {
                                                        "type": "string"
                                                },
                                                "category": {
                                                        "type": "string"
                                                },
                                                "price": {
                                                        "type": "number"
                                                },
                                                "discountPercentage": {
                                                        "type": "number"
                                                },
                                                "rating": {
                                                        "type": "number"
                                                },
                                                "stock": {
                                                        "type": "integer"
                                                },
                                                "tags": {
                                                        "type": "array",
                                                        "items": {
                                                                "type": "string"
                                                        }
                                                },
                                                "brand": {
                                                        "type": ["string", "null"]
                                                },
                                                "sku": {
                                                        "type": "string"
                                                },
                                                "weight": {
                                                        "type": "integer"
                                                },
                                                "dimensions": {
                                                        "type": "object",
                                                        "properties": {
                                                                "width": {
                                                                        "type": "number"
                                                                },
                                                                "height": {
                                                                        "type": "number"
                                                                },
                                                                "depth": {
                                                                        "type": "number"
                                                                }
                                                        },
                                                        "required": [
                                                                "width",
                                                                "height",
                                                                "depth"
                                                        ]
                                                },
                                                "warrantyInformation": {
                                                        "type": "string"
                                                },
                                                "shippingInformation": {
                                                        "type": "string"
                                                },
                                                "availabilityStatus": {
                                                        "type": "string"
                                                },
                                                "reviews": {
                                                        "type": "array",
                                                        "items": {
                                                                "type": "object",
                                                                "properties": {
                                                                        "rating": {
                                                                                "type": "integer"
                                                                        },
                                                                        "comment": {
                                                                                "type": "string"
                                                                        },
                                                                        "date": {
                                                                                "type": "string",
                                                                                "format": "date-time"
                                                                        },
                                                                        "reviewerName": {
                                                                                "type": "string"
                                                                        },
                                                                        "reviewerEmail": {
                                                                                "type": "string",
                                                                                "format": "email"
                                                                        }
                                                                },
                                                                "required": [
                                                                        "rating",
                                                                        "comment",
                                                                        "date",
                                                                        "reviewerName",
                                                                        "reviewerEmail"
                                                                ]
                                                        }
                                                },
                                                "returnPolicy": {
                                                        "type": "string"
                                                },
                                                "minimumOrderQuantity": {
                                                        "type": "integer"
                                                },
                                                "meta": {
                                                        "type": "object",
                                                        "properties": {
                                                                "createdAt": {
                                                                        "type": "string",
                                                                        "format": "date-time"
                                                                },
                                                                "updatedAt": {
                                                                        "type": "string",
                                                                        "format": "date-time"
                                                                },
                                                                "barcode": {
                                                                        "type": "string"
                                                                },
                                                                "qrCode": {
                                                                        "type": "string",
                                                                        "format": "uri"
                                                                }
                                                        },
                                                        "required": [
                                                                "createdAt",
                                                                "updatedAt",
                                                                "barcode",
                                                                "qrCode"
                                                        ]
                                                },
                                                "images": {
                                                        "type": "array",
                                                        "items": {
                                                                "type": "string",
                                                                "format": "uri"
                                                        }
                                                },
                                                "thumbnail": {
                                                        "type": "string",
                                                        "format": "uri"
                                                }
                                        },
                                        "required": [
                                                "id",
                                                "title",
                                                "description",
                                                "category",
                                                "price",
                                                "discountPercentage",
                                                "rating",
                                                "stock",
                                                "tags",
                                                "sku",
                                                "weight",
                                                "dimensions",
                                                "warrantyInformation",
                                                "shippingInformation",
                                                "availabilityStatus",
                                                "reviews",
                                                "returnPolicy",
                                                "minimumOrderQuantity",
                                                "meta",
                                                "images",
                                                "thumbnail"
                                        ]
                                }
                        },
                        "total": {
                                "type": "integer"
                        },
                        "skip": {
                                "type": "integer"
                        },
                        "limit": {
                                "type": "integer"
                        }
                },
                "required": [
                        "products",
                        "total",
                        "skip",
                        "limit"
                ]
        };

        const ajv = new Ajv();
        addFormats(ajv);
        const validate = ajv.compile(schema)
        const valid = validate(responseBody);
        if (!valid) {
                console.log(validate.errors);
        }
        expect(valid).toBeTruthy();

})

test('Get Request for all Products Schema Validation using Schema Validator Utility @smoke', async ({ request }) => {

        const schema = {
                "type": "object",
                "properties": {
                        "products": {
                                "type": "array",
                                "items": {
                                        "type": "object",
                                        "properties": {
                                                "id": {
                                                        "type": "integer"
                                                },
                                                "title": {
                                                        "type": "string"
                                                },
                                                "description": {
                                                        "type": "string"
                                                },
                                                "category": {
                                                        "type": "string"
                                                },
                                                "price": {
                                                        "type": "number"
                                                },
                                                "discountPercentage": {
                                                        "type": "number"
                                                },
                                                "rating": {
                                                        "type": "number"
                                                },
                                                "stock": {
                                                        "type": "integer"
                                                },
                                                "tags": {
                                                        "type": "array",
                                                        "items": {
                                                                "type": "string"
                                                        }
                                                },
                                                "brand": {
                                                        "type": ["string", "null"]
                                                },
                                                "sku": {
                                                        "type": "string"
                                                },
                                                "weight": {
                                                        "type": "integer"
                                                },
                                                "dimensions": {
                                                        "type": "object",
                                                        "properties": {
                                                                "width": {
                                                                        "type": "number"
                                                                },
                                                                "height": {
                                                                        "type": "number"
                                                                },
                                                                "depth": {
                                                                        "type": "number"
                                                                }
                                                        },
                                                        "required": [
                                                                "width",
                                                                "height",
                                                                "depth"
                                                        ]
                                                },
                                                "warrantyInformation": {
                                                        "type": "string"
                                                },
                                                "shippingInformation": {
                                                        "type": "string"
                                                },
                                                "availabilityStatus": {
                                                        "type": "string"
                                                },
                                                "reviews": {
                                                        "type": "array",
                                                        "items": {
                                                                "type": "object",
                                                                "properties": {
                                                                        "rating": {
                                                                                "type": "integer"
                                                                        },
                                                                        "comment": {
                                                                                "type": "string"
                                                                        },
                                                                        "date": {
                                                                                "type": "string",
                                                                                "format": "date-time"
                                                                        },
                                                                        "reviewerName": {
                                                                                "type": "string"
                                                                        },
                                                                        "reviewerEmail": {
                                                                                "type": "string",
                                                                                "format": "email"
                                                                        }
                                                                },
                                                                "required": [
                                                                        "rating",
                                                                        "comment",
                                                                        "date",
                                                                        "reviewerName",
                                                                        "reviewerEmail"
                                                                ]
                                                        }
                                                },
                                                "returnPolicy": {
                                                        "type": "string"
                                                },
                                                "minimumOrderQuantity": {
                                                        "type": "integer"
                                                },
                                                "meta": {
                                                        "type": "object",
                                                        "properties": {
                                                                "createdAt": {
                                                                        "type": "string",
                                                                        "format": "date-time"
                                                                },
                                                                "updatedAt": {
                                                                        "type": "string",
                                                                        "format": "date-time"
                                                                },
                                                                "barcode": {
                                                                        "type": "string"
                                                                },
                                                                "qrCode": {
                                                                        "type": "string",
                                                                        "format": "uri"
                                                                }
                                                        },
                                                        "required": [
                                                                "createdAt",
                                                                "updatedAt",
                                                                "barcode",
                                                                "qrCode"
                                                        ]
                                                },
                                                "images": {
                                                        "type": "array",
                                                        "items": {
                                                                "type": "string",
                                                                "format": "uri"
                                                        }
                                                },
                                                "thumbnail": {
                                                        "type": "string",
                                                        "format": "uri"
                                                }
                                        },
                                        "required": [
                                                "id",
                                                "title",
                                                "description",
                                                "category",
                                                "price",
                                                "discountPercentage",
                                                "rating",
                                                "stock",
                                                "tags",
                                                "sku",
                                                "weight",
                                                "dimensions",
                                                "warrantyInformation",
                                                "shippingInformation",
                                                "availabilityStatus",
                                                "reviews",
                                                "returnPolicy",
                                                "minimumOrderQuantity",
                                                "meta",
                                                "images",
                                                "thumbnail"
                                        ]
                                }
                        },
                        "total": {
                                "type": "integer"
                        },
                        "skip": {
                                "type": "integer"
                        },
                        "limit": {
                                "type": "integer"
                        }
                },
                "required": [
                        "products",
                        "total",
                        "skip",
                        "limit"
                ]
        };
        const response = await request.get(baseURL + '/products');
        const body = await response.json();
        const isValid = SchemaValidator.validateSchema(schema, body, {
                softValidation: true, 
                ignoreFields: ['brand', 'meta.barcode'] 
        });

        expect(isValid).toBeTruthy();
});

test('Get Request for Search Products Using Query Parameters @smoke', async ({ request }) => {

        const response = await APIUtils.getRequest(request, baseURL + '/products/search',
                {
                        q: 'phone',
                        limit: 10,
                        skip: 10,
                        select: 'title,price'
                })
        console.log(await response.json())
        expect(response.status()).toBe(200)
})

test('Get Request for All Products Using Path Parameters @smoke', async ({ request }) => {

        const response = await APIUtils.getRequest(request, baseURL + '/products/{id}', undefined,{ id: 1 })
        console.log(await response.json())
        expect(response.status()).toBe(200)
})

test('Get Request for All Products Using Both Query and Path Parameters @smoke', async ({ request }) => {

        const response = await APIUtils.getRequest(request, baseURL + '/products/{id}',
                { include: 'reviews' },
                { id: 1 })
        console.log(await response.json())
        expect(response.status()).toBe(200)
})


test('Adding Products to the Cart @smoke', async ({ request }) => {
        const response = await APIUtils.postRequest(request, baseURL + '/products/add',
                {
                        title: 'My Iphone-12',
                },
                {
                        'Content-Type': 'application/json'
                })

        console.log(await response.json())
        console.log(response.status())//{ id: 195, title: 'My Iphone-12' }
        expect(response.status()).toBe(201)

        const responseBody = await APIUtils.getRequest(request, baseURL + '/products/{id}', undefined,
                { id: 1 })
        console.log(await responseBody.json())
        console.log(response.status())
        expect(response.status()).toBe(201)
})


test('Updating a Product to the Cart @smoke', async ({ request }) => {

        const response = await APIUtils.putRequest(request, baseURL + '/products/1',
                {
                        title: 'My Iphone-12'
                })

        //console.log(await response.json())
        const resBody = await response.json()
        expect(response.status()).toBe(200)
        expect(await resBody.title).toEqual('My Iphone-12')

        const responseBody = await APIUtils.getRequest(request, baseURL + '/products/{id}', undefined,
                { id: 1 })
        //console.log(await responseBody.json())
        //console.log(response.status())
        expect(responseBody.status()).toBe(200)
})

test('Deleting a Product from the Cart @smoke', async ({ request }) => {

        const response = await APIUtils.deleteRequest(request, baseURL + '/products/1')

        
        const resBody = await response.json()
        console.log(resBody)
        //console.log(response.status())
        expect(response.status()).toBe(200)
        expect(await resBody.isDeleted).toBeTruthy()
        expect(resBody).toHaveProperty('deletedOn')
        expect(typeof resBody.deletedOn).toBe('string');

        const responseBody = await APIUtils.getRequest(request, baseURL + '/products/{id}', undefined,
                { id: 1 })
        //console.log(await responseBody.json())
        //console.log(response.status())
        expect(responseBody.status()).toBe(200)
})