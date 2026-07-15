import { schedulerApi } from '../api/schedulerApi';
import { UserResponse } from '../interfaces/userResponseInterfaces';

export const getUserWithToken = async(token: string) => {

    try {
        const {data} = await schedulerApi.get<UserResponse>('/auth/validate', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            ...data,
        };
    } catch (error) {
        throw new Error(`${error}`);
    }

};
