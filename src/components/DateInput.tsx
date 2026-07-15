import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    onChange: (date: string) => void,
    minimunDate?: string | undefined,
    value?: string,
    title: string,
}

export const DateInput = ({onChange, minimunDate, value, title}: Props) => {

    const [openStart, setOpenStart] = useState(false);

    return (
        <View style={{gap:5}}>
            <Text style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.4)', fontWeight: '600'}}>{title}</Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={{
                    fontSize: 16,
                    color: '#0a5dff',
                    backgroundColor: '#b1d3ff',
                    height: '100%',
                    verticalAlign: 'middle',
                    paddingHorizontal: 15,
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                    flex: 1,
                    textAlign: 'center',
                }}>{new Date(value!).toLocaleString('es-PE', {hour12: true})}</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setOpenStart(true)}
                    style={{width: 70}}
                >
                    <Icon
                        name="calendar-outline"
                        size={30}
                        style={{
                            textAlign: 'center',
                            backgroundColor: '#0446f1',
                            padding: 5,
                            borderTopRightRadius: 3,
                            borderBottomRightRadius: 3,
                            color: '#edf6ff',
                        }}
                    />
                </TouchableOpacity>
                <DatePicker
                    mode="datetime"
                    modal
                    // onDateChange={onChange}
                    open={openStart}
                    date={value ? new Date(value) : new Date()}
                    locale="es"
                    title={'Selecciona fecha de inicio'}
                    onConfirm={(date) => {
                        setOpenStart(false);
                        // setDateStart(date);
                        onChange(date.toISOString());
                    }}
                    minimumDate={minimunDate ? new Date(minimunDate) : undefined}
                    onCancel={() => {
                        setOpenStart(false);
                    }}
                />
            </View>
        </View>
    );
};
