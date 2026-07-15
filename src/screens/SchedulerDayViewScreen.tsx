import React from 'react';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParams } from '../navigators/ScheduleNavigator';

import { SchedulerViewModeScreen } from './SchedulerViewModeScreen';

interface Props extends DrawerScreenProps<RootStackParams, 'SchedulerDayViewScreen'>{}
export const SchedulerDayViewScreen = ({route}: Props) => {


    const currentDate = route.params?.date;

    return (
        <SchedulerViewModeScreen mode="day" currentDate={currentDate?.dateString || undefined}/>
    );
};
