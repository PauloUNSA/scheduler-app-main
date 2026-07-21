import { schedulerApi } from '../api/schedulerApi';
import { UserResponse } from '../interfaces/userResponseInterfaces';

export const getUserWithToken = async(token: string) => {
    const {data} = await schedulerApi.get<UserResponse>('/auth/validate', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
