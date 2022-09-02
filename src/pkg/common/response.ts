export function Response(statusCode: number, message: string, data: any) {

    const response: {
        statusCode: number;
        message: string;
        data: any;
    } = {
        statusCode,
        message,
        data
    }
    
    return response;
}