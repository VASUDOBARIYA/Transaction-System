import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Banking System API',
            version: '1.0.0',
            description: 'OpenAPI documentation for the existing Banking System backend.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                    description: 'JWT token stored in the token cookie.'
                }
            },
            schemas: {
                AuthUser: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '66b4a7f8e12c9a4f1c2d3e4f'
                        },
                        name: {
                            type: 'string',
                            example: 'Jane Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'jane.doe@example.com'
                        }
                    }
                },
                SignupRequest: {
                    type: 'object',
                    required: ['email', 'name', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'jane.doe@example.com'
                        },
                        name: {
                            type: 'string',
                            example: 'Jane Doe'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'SecurePass123'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'jane.doe@example.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'SecurePass123'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'User successfully login'
                        },
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        user: {
                            $ref: '#/components/schemas/AuthUser'
                        },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Invalid user request!'
                        },
                        status: {
                            type: 'string',
                            example: 'failed'
                        }
                    }
                },
                AccountInfo: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '66b4a7f8e12c9a4f1c2d3e50'
                        },
                        user: {
                            type: 'string',
                            example: '66b4a7f8e12c9a4f1c2d3e4f'
                        },
                        status: {
                            type: 'string',
                            example: 'ACTIVE'
                        },
                        currency: {
                            type: 'string',
                            example: 'INR'
                        }
                    }
                },
                CreateTransactionRequest: {
                    type: 'object',
                    required: ['fromaccount', 'toaccount', 'amount', 'idempotancykey'],
                    properties: {
                        fromaccount: {
                            type: 'string',
                            description: 'MongoDB ObjectId of the sender account.',
                            example: '66b4a7f8e12c9a4f1c2d3e50'
                        },
                        toaccount: {
                            type: 'string',
                            description: 'MongoDB ObjectId of the receiver account.',
                            example: '66b4a7f8e12c9a4f1c2d3e51'
                        },
                        amount: {
                            type: 'number',
                            minimum: 0,
                            example: 2500
                        },
                        idempotancykey: {
                            type: 'string',
                            description: 'Idempotency key used to prevent duplicate transfers.',
                            example: 'transfer-8f3a1b2c'
                        }
                    }
                },
                TransactionInfo: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '66b4a7f8e12c9a4f1c2d3e60'
                        },
                        fromAccount: {
                            type: 'string',
                            example: '66b4a7f8e12c9a4f1c2d3e50'
                        },
                        toAccount: {
                            type: 'string',
                            example: '66b4a7f8e12c9a4f1c2d3e51'
                        },
                        amount: {
                            type: 'number',
                            example: 2500
                        },
                        status: {
                            type: 'string',
                            example: 'COMPLETED'
                        },
                        idempotencyKey: {
                            type: 'string',
                            example: 'transfer-8f3a1b2c'
                        }
                    }
                }
                ,
                DepositRequest: {
                    type: 'object',
                    required: ['userAccount', 'amount', 'idempotancykey'],
                    properties: {
                        userAccount: {
                            type: 'string',
                            description: 'MongoDB ObjectId of the account to credit.',
                            example: '66b4a7f8e12c9a4f1c2d3e51'
                        },
                        amount: {
                            type: 'number',
                            minimum: 0,
                            example: 1000
                        },
                        idempotancykey: {
                            type: 'string',
                            description: 'Idempotency key for the deposit operation.',
                            example: 'deposit-1a2b3c'
                        }
                    }
                },
                BalanceResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Balance fetched successfully'
                        },
                        balance: {
                            type: 'number',
                            example: 1250
                        },
                        status: {
                            type: 'string',
                            example: 'success'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;