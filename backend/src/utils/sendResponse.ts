import { Response } from "express";

interface ISendResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
    meta?: any;
}

export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data?: T
) => {
    res.status(statusCode).json({
        success,
        message,
        data,
    });
};

export const sendErrorResponse = (
    res: Response,
    statusCode: number,
    message: string
) => {
    res.status(statusCode).json({
        success: false,
        message,
    });
};


export const sendErrorsResponse = (
    res: Response,
    statusCode: number,
    errors: string[]
) => {
    res.status(statusCode).json({
        success: false,
        message: "Validation errors occurred",
        errors,
    });
};