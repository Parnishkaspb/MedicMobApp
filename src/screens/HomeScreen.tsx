import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from '../axios/axiosConfig';
import SecureStorage from 'react-native-secure-storage';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Visit {
    id: number;
    date: string;
    time: string;
    name_doctor: string;
    surname_doctor: string;
    visit: number;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
    const [massiveDate, setMassiveDate] = useState<Visit[]>([]);

    const toggleExpand = (index: number) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [index]: !prevExpanded[index],
        }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMMM yyyy', { locale: ru });
    };

    const isPastDate = (date: string) => {
        const today = new Date();
        const visitDate = new Date(date);
        return visitDate < today;
    };
    const handleViewDetails = (visitId: number) => {
        navigation.navigate('VisitDetails', { visitId });
    };

    useEffect(() => {
        const getInfo = async () => {
            try {
                const accessToken = await SecureStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('No access token found');
                    return;
                }

                const response = await axios.get('myvisits', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                const sortedData = response.data.data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setMassiveDate(sortedData);
                setExpanded(new Array(sortedData.length).fill(false));
                console.log(response.data.data);
            } catch (error) {
                console.error('Failed to fetch visits:', error);
            }
        };

        getInfo();
    }, []);

    return (
        <View style={styles.container}>
            {massiveDate.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Нет записей</Text>
                    <Button title="Записаться к врачу" onPress={() => navigation.navigate('NewWrite')} />
                </View>
            ) : (
                massiveDate.map((element, index) => (
                    <TouchableOpacity key={index} onPress={() => toggleExpand(index)} style={styles.itemContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>{
                                formatDate(element.date)} в {element.time}



                            </Text>
                            <Text style={styles.headerText}>
                                {element.visit === 0 && isPastDate(element.date) && (
                                    <Text style={styles.visitText}> Вы не посетили эту запись</Text>
                                )}
                            </Text>
                        </View>
                        {expanded[index] && (
                            <View style={styles.content}>
                                <Text>Врач: {element.surname_doctor} {element.name_doctor}</Text>
                                {element.visit === 1 && isPastDate(element.date) && (
                                    <TouchableOpacity onPress={() => handleViewDetails(element.id)}>
                                        <Text>Просмотр полной информации</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                    </TouchableOpacity>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#D0DCF8',
    },
    itemContainer: {
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: '#263C70',
        borderWidth: 3
    },
    header: {
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937'
    },
    content: {
        padding: 10,
        backgroundColor: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    visitText: {
        color: 'red',
    },
    emptyText: {
        fontSize: 18,
        marginBottom: 20,
    }
});

export default HomeScreen;
