import React from 'react';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { SchedulerViewModeScreen } from './SchedulerViewModeScreen';

interface Props extends DrawerScreenProps<any, any>{}
export const SchedulerWeekViewScreen = ({}: Props) => {

    return (
        <SchedulerViewModeScreen mode="week" currentDate={undefined}/>
    );
};
