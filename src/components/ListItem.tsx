import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import { Todo } from '../interfaces/storeInterfaces';
import { RootState, useAppDispatch } from '../store/store';
import { startDeleteTodo, startSetTodoCompletion } from '../store/todos/thunks';

interface Props {
    todo: Todo;
    onEdit: (todo: Todo) => void;
}

const priorityPresentation = {
    low: {label: 'Baja', backgroundColor: '#dcfce7', color: '#166534'},
    medium: {label: 'Media', backgroundColor: '#fef3c7', color: '#92400e'},
    high: {label: 'Alta', backgroundColor: '#fee2e2', color: '#991b1b'},
};

export const ListItem = ({todo, onEdit}: Props) => {
    const dispatch = useAppDispatch();
    const {activeEvent} = useSelector((state: RootState) => state.calendar);
    const {user} = useSelector((state: RootState) => state.auth);
    const {isSaving} = useSelector((state: RootState) => state.todos);

    if (!activeEvent) {
        return null;
    }

    const isOwner = activeEvent.user?.id === user.id;
    const isAssignee = todo.assignee?.id === user.id;
    const canComplete = isOwner || isAssignee;
    const isOverdue = Boolean(todo.dueAt && !todo.done && new Date(todo.dueAt) < new Date());
    const priority = priorityPresentation[todo.priority];

    const confirmDelete = () => {
        Alert.alert(
            'Eliminar tarea',
            'Esta acción no se puede deshacer.',
            [
                {text: 'Cancelar', style: 'cancel'},
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => dispatch(startDeleteTodo(activeEvent.id, todo.id)),
                },
            ],
        );
    };

    return (
        <View style={[styles.card, todo.done && styles.cardCompleted]}>
            <View style={styles.topRow}>
                <CheckBox
                    value={todo.done}
                    disabled={!canComplete || isSaving}
                    onValueChange={(done) => dispatch(startSetTodoCompletion(activeEvent.id, todo.id, done))}
                    boxType="circle"
                    tintColors={{true: '#2456d6', false: canComplete ? '#2456d6' : '#94a3b8'}}
                    accessibilityLabel={`Marcar ${todo.description} como ${todo.done ? 'pendiente' : 'completada'}`}
                />
                <View style={styles.content}>
                    <Text style={[styles.description, todo.done && styles.descriptionCompleted]}>
                        {todo.description}
                    </Text>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, {backgroundColor: priority.backgroundColor}]}>
                            <Text style={[styles.badgeText, {color: priority.color}]}>{priority.label}</Text>
                        </View>
                        {isOverdue && (
                            <View style={[styles.badge, styles.overdueBadge]}>
                                <Text style={[styles.badgeText, styles.overdueText]}>Vencida</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Icon name="person-outline" size={16} color="#475569" />
                    <Text style={styles.metaText}>{todo.assignee?.name ?? 'Sin responsable'}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Icon name="time-outline" size={16} color={isOverdue ? '#b91c1c' : '#475569'} />
                    <Text style={[styles.metaText, isOverdue && styles.overdueText]}>
                        {todo.dueAt
                            ? new Date(todo.dueAt).toLocaleString('es-PE', {dateStyle: 'short', timeStyle: 'short'})
                            : 'Sin fecha límite'}
                    </Text>
                </View>
            </View>

            {!canComplete && (
                <Text style={styles.permissionHint}>Solo el responsable o el organizador puede completarla.</Text>
            )}

            {isOwner && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        onPress={() => onEdit(todo)}
                        disabled={isSaving}
                        style={styles.actionButton}
                        accessibilityRole="button"
                        accessibilityLabel={`Editar ${todo.description}`}
                    >
                        <Icon name="create-outline" size={18} color="#1d4ed8" />
                        <Text style={styles.editText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={confirmDelete}
                        disabled={isSaving}
                        style={styles.actionButton}
                        accessibilityRole="button"
                        accessibilityLabel={`Eliminar ${todo.description}`}
                    >
                        <Icon name="trash-outline" size={18} color="#b91c1c" />
                        <Text style={styles.deleteText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 13,
        shadowColor: '#0f172a',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
        gap: 10,
    },
    cardCompleted: {opacity: 0.72},
    topRow: {flexDirection: 'row', alignItems: 'flex-start'},
    content: {flex: 1, paddingTop: 5, gap: 8},
    description: {fontSize: 17, color: '#172554', fontWeight: '600', lineHeight: 23},
    descriptionCompleted: {textDecorationLine: 'line-through', color: '#64748b'},
    badgeRow: {flexDirection: 'row', gap: 7, flexWrap: 'wrap'},
    badge: {borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4},
    badgeText: {fontSize: 12, fontWeight: '700'},
    overdueBadge: {backgroundColor: '#fee2e2'},
    overdueText: {color: '#b91c1c'},
    metaRow: {gap: 6, paddingLeft: 5},
    metaItem: {flexDirection: 'row', alignItems: 'center', gap: 7},
    metaText: {fontSize: 13, color: '#475569', flexShrink: 1},
    permissionHint: {fontSize: 12, color: '#64748b', fontStyle: 'italic'},
    actionRow: {flexDirection: 'row', justifyContent: 'flex-end', gap: 18, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10},
    actionButton: {flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 2},
    editText: {color: '#1d4ed8', fontWeight: '700'},
    deleteText: {color: '#b91c1c', fontWeight: '700'},
});
