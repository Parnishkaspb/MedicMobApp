import React, { useEffect, useState } from 'react';
import SecureStorage from 'react-native-secure-storage';
import { View, Button, Text, StyleSheet, ScrollView } from 'react-native';
import axios from '../axios/axiosConfig';

interface User {
    id: number;
    name: string;
    surname: string;
    address: string;
    passport: string;
    telephone: string;
}

const ProfileScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (route.params?.updatedUser) {
            setUser(route.params.updatedUser);
        } else {
            const getInfo = async () => {
                try {
                    const accessToken = await SecureStorage.getItem('access_token');
                    if (!accessToken) {
                        console.error('No access token found');
                        return;
                    }

                    const response = await axios.get('update', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    });

                    setUser(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };

            getInfo();
        }
    }, [route.params?.updatedUser]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Ваши данные</Text>
                {user ? (
                    <View style={styles.profileContainer}>
                        <Text style={styles.text}><Text style={styles.label}>Имя:</Text> {user.name}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Фамилия:</Text> {user.surname}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Адрес:</Text> {user.address}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Паспорт:</Text> {user.passport}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Телефон:</Text> {user.telephone}</Text>
                    </View>
                ) : (
                    <Text style={styles.loadingText}>Загрузка...</Text>
                )}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="Редактировать" color="#FFFFFF" onPress={() => navigation.navigate('Edit')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D0DCF8',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#343a40',
    },
    profileContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderColor: '#263C70',
        borderWidth: 3,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        color: '#495057',
    },
    label: {
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#6c757d',
    },
    buttonContainer: {
        padding: 30,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#1F2937',
    },
});

export default ProfileScreen;
