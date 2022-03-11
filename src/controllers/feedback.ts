import { request } from "../helpers/requests";

export function sendFeedback(values: any) {
    return request({
        url: 'feedback',
        method: 'POST',
        
        data: {
            message: values.message,
            page: values.page,
            type: values.type,
        }
    });
}