import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import SecureStorage from 'react-native-secure-storage';
import axios from '../axios/axiosConfig';

interface User {
    id: number;
    name: string;
    surname: string;
    address: string;
    passport: string;
    telephone: string;
    login: string;
}

const EditScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
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
    }, []);

    const handleSave = async () => {
        try {
            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            if (user) {
                const response = await axios.patch(`update/${user.id}`, {
                    name: user.name,
                    surname: user.surname,
                    address: user.address,
                    passport: user.passport,
                    telephone: user.telephone,
                    login: user.login,
                    password: "no_password, but need",
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                console.log('User data updated:', response.data);
                navigation.navigate('Profile', { updatedUser: user });
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Редактировать профиль</Text>
                {user ? (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Имя</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Имя"
                                value={user.name}
                                onChangeText={(text) => setUser({ ...user, name: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Фамилия</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Фамилия"
                                value={user.surname}
                                onChangeText={(text) => setUser({ ...user, surname: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Адрес</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Адрес"
                                value={user.address}
                                onChangeText={(text) => setUser({ ...user, address: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Паспорт</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Паспорт"
                                value={user.passport}
                                onChangeText={(text) => setUser({ ...user, passport: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Телефон</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Телефон"
                                value={user.telephone}
                                onChangeText={(text) => setUser({ ...user, telephone: text })}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Сохранить" onPress={handleSave} color="#FFFFFF" />
                        </View>
                    </>
                ) : (
                    <Text style={styles.loadingText}>Загрузка...</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#D0DCF8',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#D0DCF8',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 20,
        color: '#1F2937',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
        marginBottom: 5,
        color: '#495057',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#263C70',
        backgroundColor: 'white',
        borderWidth: 3,
        paddingHorizontal: 10,
        borderRadius: 25,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#6c757d',
    },
    buttonContainer: {
        backgroundColor: '#263C70',
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 30,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default EditScreen;