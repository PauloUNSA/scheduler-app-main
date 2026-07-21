import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';

import { TodoSubmit } from '../interfaces/formsData';
import { Todo, TodoPriority } from '../interfaces/storeInterfaces';
import { RootState, useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux';
import { startAddTodo, startUpdateTodo } from '../store/todos/thunks';
import { ButtonSubmit } from './ButtonSubmit';
import { DateInput } from './DateInput';
import { Input } from './Input';
import { getEventAssignees } from '../helpers/getEventAssignees';

const {width: windowWidth} = Dimensions.get('window');

interface Props {
    visible: boolean;
    onClose: () => void;
    todo?: Todo;
}

const priorityOptions: Array<{value: TodoPriority; label: string}> = [
    {value: 'low', label: 'Baja'},
    {value: 'medium', label: 'Media'},
    {value: 'high', label: 'Alta'},
];

export const CreateTodoModal = ({visible, onClose, todo}: Props) => {
    const dispatch = useAppDispatch();
    const {activeEvent} = useSelector((state: RootState) => state.calendar);
    const {user} = useSelector((state: RootState) => state.auth);
    const {isSaving, error} = useSelector((state: RootState) => state.todos);
    const [hasDueDate, setHasDueDate] = useState(Boolean(todo?.dueAt));

    const assignees = useMemo(
        () => activeEvent ? getEventAssignees(activeEvent, user) : [],
        [activeEvent, user],
    );

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
        watch,
        setValue,
    } = useForm<TodoSubmit>({
        defaultValues: {
            description: '',
            priority: 'medium',
            dueAt: null,
            assigneeId: null,
        },
    });

    useEffect(() => {
        if (!visible) {
            return;
        }
        const dueAt = todo?.dueAt ?? null;
        setHasDueDate(Boolean(dueAt));
        reset({
            description: todo?.description ?? '',
            priority: todo?.priority ?? 'medium',
            dueAt,
            assigneeId: todo?.assignee?.id ?? null,
        });
    }, [reset, todo, visible]);

    if (!activeEvent) {
        return null;
    }

    const closeModal = () => {
        if (!isSaving) {
            onClose();
        }
    };

    const onSubmit = async (data: TodoSubmit) => {
        const input = {
            ...data,
            description: data.description.trim(),
            dueAt: hasDueDate ? data.dueAt : null,
        };

        const succeeded = todo
            ? await dispatch(startUpdateTodo(activeEvent.id, todo.id, input))
            : await dispatch(startAddTodo(activeEvent.id, input));

        if (succeeded) {
            Alert.alert('Listo', todo ? 'Tarea actualizada.' : 'Tarea creada.');
            onClose();
        }
    };

    const selectedPriority = watch('priority');
    const selectedAssignee = watch('assigneeId');
    const selectedDueAt = watch('dueAt');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardLayer}
        >
            <Modal animationType="fade" visible={visible} transparent onRequestClose={closeModal}>
                <View style={styles.backdrop}>
                    <View style={styles.modalCard}>
                        <TouchableOpacity
                            onPress={closeModal}
                            disabled={isSaving}
                            style={styles.closeButton}
                            accessibilityRole="button"
                            accessibilityLabel="Cerrar formulario de tarea"
                        >
                            <Icon name="close-outline" size={32} color="#2644ff" />
                        </TouchableOpacity>

                        <Text style={styles.title}>{todo ? 'Editar tarea' : 'Nueva tarea'}</Text>

                        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                            <Controller
                                control={control}
                                rules={{
                                    required: 'La descripción es obligatoria',
                                    minLength: {value: 1, message: 'Escribe una descripción'},
                                    maxLength: {value: 240, message: 'Máximo 240 caracteres'},
                                }}
                                render={({field: {onChange, value, onBlur}}) => (
                                    <Input
                                        style={{height: 44}}
                                        autoCapitalize="sentences"
                                        errors={errors.description}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        label="Descripción"
                                        placeholder="Ej. Preparar la presentación"
                                        keyboardType="default"
                                    />
                                )}
                                name="description"
                            />

                            <Text style={styles.fieldLabel}>Prioridad</Text>
                            <View style={styles.optionRow}>
                                {priorityOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => setValue('priority', option.value)}
                                        style={[
                                            styles.optionChip,
                                            selectedPriority === option.value && styles.optionChipSelected,
                                        ]}
                                        accessibilityRole="radio"
                                        accessibilityState={{selected: selectedPriority === option.value}}
                                    >
                                        <Text style={selectedPriority === option.value ? styles.optionTextSelected : styles.optionText}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.fieldHeader}>
                                <Text style={styles.fieldLabel}>Fecha límite</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        const next = !hasDueDate;
                                        setHasDueDate(next);
                                        setValue('dueAt', next ? (selectedDueAt ?? activeEvent.end) : null);
                                    }}
                                    accessibilityRole="switch"
                                    accessibilityState={{checked: hasDueDate}}
                                >
                                    <Text style={styles.linkText}>{hasDueDate ? 'Quitar' : 'Agregar'}</Text>
                                </TouchableOpacity>
                            </View>
                            {hasDueDate && (
                                <Controller
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <DateInput
                                            onChange={onChange}
                                            title="Vence"
                                            value={value ?? activeEvent.end}
                                        />
                                    )}
                                    name="dueAt"
                                />
                            )}

                            <Text style={styles.fieldLabel}>Responsable</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.assigneeRow}>
                                <TouchableOpacity
                                    onPress={() => setValue('assigneeId', null)}
                                    style={[styles.assigneeChip, selectedAssignee === null && styles.assigneeChipSelected]}
                                    accessibilityRole="radio"
                                    accessibilityState={{selected: selectedAssignee === null}}
                                >
                                    <Text style={selectedAssignee === null ? styles.assigneeTextSelected : styles.assigneeText}>
                                        Sin asignar
                                    </Text>
                                </TouchableOpacity>
                                {assignees.map((assignee) => (
                                    <TouchableOpacity
                                        key={assignee.id}
                                        onPress={() => setValue('assigneeId', assignee.id)}
                                        style={[styles.assigneeChip, selectedAssignee === assignee.id && styles.assigneeChipSelected]}
                                        accessibilityRole="radio"
                                        accessibilityState={{selected: selectedAssignee === assignee.id}}
                                    >
                                        <Text style={selectedAssignee === assignee.id ? styles.assigneeTextSelected : styles.assigneeText}>
                                            {assignee.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {error && <Text style={styles.errorText}>{error}</Text>}

                            <ButtonSubmit
                                title={todo ? 'Guardar cambios' : 'Crear tarea'}
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                disabled={isSaving}
                                isLoading={isSaving}
                            />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardLayer: {zIndex: 999},
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    modalCard: {
        width: windowWidth - 40,
        maxHeight: '92%',
        backgroundColor: '#eaf3ff',
        borderRadius: 18,
        padding: 20,
    },
    closeButton: {position: 'absolute', right: 12, top: 10, zIndex: 2},
    title: {fontSize: 23, fontWeight: '700', color: '#172554', marginBottom: 16},
    form: {gap: 13, paddingBottom: 6},
    fieldLabel: {fontSize: 14, color: '#475569', fontWeight: '600'},
    fieldHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    optionRow: {flexDirection: 'row', gap: 8},
    optionChip: {flex: 1, paddingVertical: 9, borderRadius: 20, backgroundColor: '#dbeafe', alignItems: 'center'},
    optionChipSelected: {backgroundColor: '#2559d6'},
    optionText: {color: '#1e3a8a', fontWeight: '600'},
    optionTextSelected: {color: '#ffffff', fontWeight: '700'},
    linkText: {color: '#1d4ed8', fontWeight: '700'},
    assigneeRow: {gap: 8, paddingBottom: 3},
    assigneeChip: {paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, backgroundColor: '#dbeafe'},
    assigneeChipSelected: {backgroundColor: '#1e40af'},
    assigneeText: {color: '#1e3a8a', fontWeight: '500'},
    assigneeTextSelected: {color: '#ffffff', fontWeight: '600'},
    errorText: {color: '#b91c1c', fontSize: 14, lineHeight: 19},
});
