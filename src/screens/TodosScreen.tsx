import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { CreateTodoModal } from '../components/CreateTodoModal';
import { EmptyDateData } from '../components/EmptyDateData';
import { FloatButton } from '../components/FloatButton';
import { ListItem } from '../components/ListItem';
import { Todo, TodoFilters, TodoPriority, TodoStatusFilter } from '../interfaces/storeInterfaces';
import { RootState, useAppDispatch } from '../store/store';
import { onClearTodos } from '../store/todos/todosSlice';
import { startLoadTodos } from '../store/todos/thunks';
import { LoadingScreen } from './LoadingScreen';

const windowHeight = Dimensions.get('window').height;

const statusOptions: Array<{value: TodoStatusFilter; label: string}> = [
    {value: 'all', label: 'Todas'},
    {value: 'pending', label: 'Pendientes'},
    {value: 'completed', label: 'Completadas'},
];

const priorityOptions: Array<{value: 'all' | TodoPriority; label: string}> = [
    {value: 'all', label: 'Cualquier prioridad'},
    {value: 'high', label: 'Alta'},
    {value: 'medium', label: 'Media'},
    {value: 'low', label: 'Baja'},
];

export const TodosScreen = () => {
    const dispatch = useAppDispatch();
    const {activeEvent} = useSelector((state: RootState) => state.calendar);
    const {user} = useSelector((state: RootState) => state.auth);
    const {todos, isLoading, error, filters, meta, summary} = useSelector((state: RootState) => state.todos);
    const [search, setSearch] = useState(filters.search);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
    const {goBack} = useNavigation();

    useEffect(() => {
        if (activeEvent?.id) {
            dispatch(startLoadTodos(activeEvent.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeEvent?.id]);

    if (!activeEvent) {
        return (
            <View style={styles.centeredState}>
                <Text style={styles.errorTitle}>No hay un evento seleccionado.</Text>
                <TouchableOpacity onPress={() => goBack()} style={styles.primaryButton} accessibilityRole="button">
                    <Text style={styles.primaryButtonText}>Volver a la agenda</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isOwner = activeEvent.user?.id === user.id;
    const progress = summary.total === 0 ? 0 : Math.round((summary.completed / summary.total) * 100);

    const applyFilters = (nextFilters: Partial<TodoFilters>) => {
        dispatch(startLoadTodos(activeEvent.id, {...nextFilters, page: nextFilters.page ?? 1}));
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingTodo(undefined);
    };

    if (isLoading && todos.length === 0 && !error) {
        return <LoadingScreen />;
    }

    return (
        <>
            <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
                <View style={styles.hero}>
                    <FloatButton
                        color="#1f4dd6"
                        icon="arrow-back-outline"
                        fn={() => {
                            dispatch(onClearTodos());
                            goBack();
                        }}
                        style={styles.backButton}
                        styleButton={styles.backButtonSurface}
                    />
                    <Text style={styles.heroEyebrow}>PLAN DEL EVENTO</Text>
                    <Text style={styles.heroTitle}>{activeEvent.title}</Text>
                    <Text style={styles.heroSubtitle}>
                        {summary.completed} de {summary.total} tareas completadas
                    </Text>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, {width: `${progress}%`}]} />
                    </View>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{progress}%</Text>
                            <Text style={styles.summaryLabel}>Progreso</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{summary.pending}</Text>
                            <Text style={styles.summaryLabel}>Pendientes</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, summary.overdue > 0 && styles.overdueValue]}>
                                {summary.overdue}
                            </Text>
                            <Text style={styles.summaryLabel}>Vencidas</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contentPanel}>
                    <View style={styles.searchRow}>
                        <Icon name="search-outline" size={21} color="#64748b" />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            onSubmitEditing={() => applyFilters({search})}
                            placeholder="Buscar tareas"
                            placeholderTextColor="#64748b"
                            style={styles.searchInput}
                            returnKeyType="search"
                            accessibilityLabel="Buscar tareas"
                        />
                        {search.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    setSearch('');
                                    applyFilters({search: ''});
                                }}
                                accessibilityRole="button"
                                accessibilityLabel="Limpiar búsqueda"
                            >
                                <Icon name="close-circle" size={21} color="#64748b" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.filterLabel}>Estado</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                        {statusOptions.map((option) => (
                            <FilterChip
                                key={option.value}
                                label={option.label}
                                selected={filters.status === option.value}
                                onPress={() => applyFilters({status: option.value})}
                            />
                        ))}
                    </ScrollView>

                    <Text style={styles.filterLabel}>Prioridad</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                        {priorityOptions.map((option) => (
                            <FilterChip
                                key={option.value}
                                label={option.label}
                                selected={filters.priority === option.value}
                                onPress={() => applyFilters({priority: option.value})}
                            />
                        ))}
                    </ScrollView>

                    <View style={styles.filterRow}>
                        <FilterChip
                            label="Asignadas a mí"
                            selected={filters.assignedToMe}
                            onPress={() => applyFilters({assignedToMe: !filters.assignedToMe})}
                        />
                        <FilterChip
                            label="Solo vencidas"
                            selected={filters.overdue}
                            onPress={() => applyFilters({overdue: !filters.overdue})}
                        />
                    </View>

                    {isLoading && <ActivityIndicator color="#2456d6" style={styles.inlineLoader} />}

                    {error && (
                        <View style={styles.errorCard}>
                            <Icon name="cloud-offline-outline" size={28} color="#b91c1c" />
                            <View style={styles.errorCopy}>
                                <Text style={styles.errorTitle}>No pudimos actualizar las tareas</Text>
                                <Text style={styles.errorMessage}>{error}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => dispatch(startLoadTodos(activeEvent.id))}
                                style={styles.retryButton}
                                accessibilityRole="button"
                                accessibilityLabel="Reintentar carga de tareas"
                            >
                                <Text style={styles.retryText}>Reintentar</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!error && todos.length === 0
                        ? <EmptyDateData message={summary.total === 0 ? 'Aún no hay tareas en este evento' : 'Ninguna tarea coincide con los filtros'} />
                        : todos.map((todo) => (
                            <ListItem
                                key={todo.id}
                                todo={todo}
                                onEdit={(selectedTodo) => {
                                    setEditingTodo(selectedTodo);
                                    setModalVisible(true);
                                }}
                            />
                        ))}

                    {meta.totalPages > 1 && (
                        <View style={styles.paginationRow}>
                            <TouchableOpacity
                                onPress={() => applyFilters({page: meta.page - 1})}
                                disabled={meta.page <= 1 || isLoading}
                                style={[styles.pageButton, meta.page <= 1 && styles.pageButtonDisabled]}
                                accessibilityRole="button"
                                accessibilityLabel="Página anterior"
                            >
                                <Icon name="chevron-back" size={20} color="#1e40af" />
                            </TouchableOpacity>
                            <Text style={styles.pageText}>Página {meta.page} de {meta.totalPages}</Text>
                            <TouchableOpacity
                                onPress={() => applyFilters({page: meta.page + 1})}
                                disabled={meta.page >= meta.totalPages || isLoading}
                                style={[styles.pageButton, meta.page >= meta.totalPages && styles.pageButtonDisabled]}
                                accessibilityRole="button"
                                accessibilityLabel="Página siguiente"
                            >
                                <Icon name="chevron-forward" size={20} color="#1e40af" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {!isOwner && (
                        <Text style={styles.guestHint}>Puedes completar las tareas que estén asignadas a ti.</Text>
                    )}
                </View>
            </ScrollView>

            {isOwner && (
                <FloatButton
                    style={styles.addButton}
                    styleButton={styles.addButtonSurface}
                    color="#ffffff"
                    icon="add-outline"
                    fn={() => setModalVisible(true)}
                />
            )}

            <CreateTodoModal visible={modalVisible} onClose={closeModal} todo={editingTodo} />
        </>
    );
};

interface FilterChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

const FilterChip = ({label, selected, onPress}: FilterChipProps) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.filterChip, selected && styles.filterChipSelected]}
        accessibilityRole="button"
        accessibilityState={{selected}}
    >
        <Text style={selected ? styles.filterChipTextSelected : styles.filterChipText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    screen: {flex: 1, backgroundColor: '#2456d6'},
    hero: {paddingTop: 70, paddingHorizontal: 24, paddingBottom: 25},
    backButton: {position: 'absolute', left: 15, top: 15},
    backButtonSurface: {backgroundColor: '#dbeafe'},
    heroEyebrow: {color: '#bfdbfe', fontSize: 12, fontWeight: '700', letterSpacing: 1.2},
    heroTitle: {color: '#ffffff', fontSize: 28, fontWeight: '800', marginTop: 6},
    heroSubtitle: {color: '#dbeafe', fontSize: 14, marginTop: 6},
    progressTrack: {height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, marginTop: 16, overflow: 'hidden'},
    progressFill: {height: '100%', backgroundColor: '#ffffff', borderRadius: 8},
    summaryRow: {flexDirection: 'row', marginTop: 18},
    summaryItem: {flex: 1},
    summaryValue: {fontSize: 21, color: '#ffffff', fontWeight: '800'},
    summaryLabel: {fontSize: 12, color: '#bfdbfe', marginTop: 2},
    overdueValue: {color: '#fecaca'},
    contentPanel: {
        minHeight: windowHeight - 180,
        backgroundColor: '#eef5ff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 16,
        paddingTop: 22,
        paddingBottom: 100,
    },
    searchRow: {height: 48, borderRadius: 14, backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, marginBottom: 17},
    searchInput: {flex: 1, color: '#0f172a', fontSize: 15},
    filterLabel: {fontSize: 13, color: '#475569', fontWeight: '700', marginBottom: 8},
    filterRow: {flexDirection: 'row', gap: 8, paddingBottom: 15},
    filterChip: {paddingHorizontal: 13, paddingVertical: 8, borderRadius: 18, backgroundColor: '#dbeafe'},
    filterChipSelected: {backgroundColor: '#1e40af'},
    filterChipText: {color: '#1e3a8a', fontWeight: '600', fontSize: 13},
    filterChipTextSelected: {color: '#ffffff', fontWeight: '700', fontSize: 13},
    inlineLoader: {marginBottom: 12},
    errorCard: {backgroundColor: '#fff1f2', borderRadius: 14, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 14},
    errorCopy: {flex: 1},
    errorTitle: {fontSize: 15, color: '#991b1b', fontWeight: '700'},
    errorMessage: {fontSize: 12, color: '#b91c1c', marginTop: 2},
    retryButton: {paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#ffffff', borderRadius: 9},
    retryText: {color: '#b91c1c', fontWeight: '700', fontSize: 12},
    paginationRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 7},
    pageButton: {padding: 9, backgroundColor: '#dbeafe', borderRadius: 20},
    pageButtonDisabled: {opacity: 0.4},
    pageText: {color: '#334155', fontSize: 13, fontWeight: '600'},
    guestHint: {textAlign: 'center', color: '#64748b', fontSize: 13, marginTop: 16},
    addButton: {position: 'absolute', bottom: 25, right: 25, zIndex: 10},
    addButtonSurface: {backgroundColor: '#1d4ed8'},
    centeredState: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#eef5ff', gap: 18},
    primaryButton: {backgroundColor: '#1d4ed8', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 10},
    primaryButtonText: {color: '#ffffff', fontWeight: '700'},
});
