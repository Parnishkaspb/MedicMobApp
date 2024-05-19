import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from '../axios/axiosConfig';
import SecureStorage from 'react-native-secure-storage';
import DatePicker from 'react-native-date-picker';

interface Medic {
    id: number;
    name: string;
    surname: string;
    specialization: string;
}

const NewWriteScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [medics, setMedics] = useState<Medic[]>([]);
    const [selectedMedic, setSelectedMedic] = useState<Medic | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        const fetchMedics = async () => {
            try {
                const accessToken = await SecureStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('No access token found');
                    return;
                }

                const response = await axios.get('/medics', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                setMedics(response.data.data);
            } catch (error) {
                console.error('Failed to fetch medics:', error);
            }
        };

        fetchMedics();
    }, []);

    const handleSelectMedic = (medic: Medic) => {
        setSelectedMedic(medic);
    };

    const handleDateChange = (date: Date) => {
        setShowDatePicker(false);
        if (date && !isWeekend(date)) {
            setSelectedDate(date);
            console.log("Дата: " + formatDate(date));
        } else {
            Alert.alert('Выбранная дата выпадает на выходной. Пожалуйста, выберите другой день.');
        }
    };

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // месяцы начинаются с 0
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleTimeChange = (time: Date) => {
        setShowTimePicker(false);
        if (time) {
            setSelectedTime(time);
            console.log('Время: ' + formatTime(time));
        }
    };

    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const createEntry = async () => {
        try {
            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            const response = await axios.post('/myvisits', {
                id_medic: selectedMedic?.id,
                datetomedic: formatDate(selectedDate),
                timetomedic: formatTime(selectedTime),
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            // console.log(response.data.data);
            Alert.alert(response.data.data.message);
            setSelectedMedic(null);
        } catch (error) {
            console.error('Failed to fetch medics:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Выберите врача</Text>
            {!selectedMedic ? (
                <FlatList
                    data={medics}
                    keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.medicItem} onPress={() => handleSelectMedic(item)}>
                            <Text style={styles.medicText}>{item.surname} {item.name} - {item.specialization}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Нет доступных врачей</Text>}
                />
            ) : (
                <View style={styles.selectionContainer}>
                    <Text style={styles.selectedText}>Вы выбрали: {selectedMedic.surname} {selectedMedic.name}</Text>
                    <Text style={styles.title}>Выберите дату</Text>
                    <Button title="Выбрать дату" onPress={() => setShowDatePicker(true)} />
                    {showDatePicker && (
                        <DatePicker
                            modal
                            open={showDatePicker}
                            date={selectedDate}
                            mode="date"
                            locale="ru"
                            is24hourSource="locale"
                            onConfirm={handleDateChange}
                            onCancel={() => setShowDatePicker(false)}
                            minimumDate={new Date()}
                        />
                    )}
                    <Text style={styles.selectedText}>Выбранная дата: {selectedDate.toLocaleDateString('ru-RU')}</Text>
                    <Text style={styles.title}>Выберите время</Text>
                    <Button title="Выбрать время" onPress={() => setShowTimePicker(true)} />
                    {showTimePicker && (
                        <DatePicker
                            modal
                            open={showTimePicker}
                            date={selectedTime}
                            mode="time"
                            // is24Hour={true}
                            onConfirm={handleTimeChange}
                            onCancel={() => setShowTimePicker(false)}
                            minuteInterval={30}
                        />
                    )}
                    <Text style={styles.selectedText}>Выбранное время: {selectedTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Записаться" onPress={() => createEntry()} />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#343a40',
    },
    medicItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    medicText: {
        fontSize: 18,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#6c757d',
        marginTop: 20,
    },
    selectionContainer: {
        alignItems: 'center',
    },
    selectedText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#495057',
    },
    buttonContainer: {
        marginTop: 30,
    },
});

export default NewWriteScreen;
