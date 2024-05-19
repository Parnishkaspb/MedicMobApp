import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from '../axios/axiosConfig';
import SecureStorage from 'react-native-secure-storage';

interface VisitDetail {
    id: number;
    date: string;
    time: string;
    name_doctor: string;
    surname_doctor: string;
    visits_recommendations: RecomandationDetail[];
}

interface RecomandationDetail {
    recomendation: string;
}

const VisitDetailsScreen: React.FC<{ route: any }> = ({ route }) => {
    const [visit, setVisit] = useState<VisitDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const visitId = route.params.visitId;

    useEffect(() => {
        const fetchVisitDetails = async () => {
            try {
                const accessToken = await SecureStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('No access token found');
                    return;
                }

                const response = await axios.get(`/myvisits/${visitId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                setVisit(response.data.data);
                console.log(response.data.data); // Логируем ответ для проверки
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch visit details:', error);
                setLoading(false);
            }
        };

        fetchVisitDetails();
    }, [visitId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!visit) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Не удалось загрузить данные о визите</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <View style={styles.card}>
                <Text style={styles.title}>ID визита</Text>
                <Text style={styles.details}>{visit.id}</Text>
            </View> */}
            <View style={styles.card}>
                <Text style={styles.title}>Дата визита</Text>
                <Text style={styles.details}>{visit.date}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>Время визита</Text>
                <Text style={styles.details}>{visit.time}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>Врач</Text>
                <Text style={styles.details}>{visit.name_doctor} {visit.surname_doctor}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>Рекомендации</Text>
                {visit.visits_recommendations.length > 0 ? (
                    visit.visits_recommendations.map((rec, index) => (
                        <Text key={index} style={styles.details}>{rec.recomendation}</Text>
                    ))
                ) : (
                    <Text style={styles.details}>Рекомендаций нет</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#D0DCF8',
        marginTop: 50
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderColor: '#263C70',
        borderWidth: 3
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 5,
    },
    details: {
        fontSize: 16,
        color: '#495057',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});


export default VisitDetailsScreen;
