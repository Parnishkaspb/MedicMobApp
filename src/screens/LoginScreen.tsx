import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import SecureStorage from 'react-native-secure-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from '../axios/axiosConfig';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type LoginFormProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginForm: React.FC = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigation = useNavigation<LoginFormProps>();

    const handleLogin = async () => {
        try {
            const response = await axios.post('login', {
                login,
                password
            });

            const access_token = response.data.data.access_token;

            await SecureStorage.setItem('access_token', access_token);

            navigation.navigate('Main');
        } catch (error) {
            const axiosError = error as Error;

            setError('Ошибка входа! Попробуйте позже');
            console.error('Login error:', axiosError.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Цифровой Диетолог</Text>
            </View>
            <View style={styles.centerContainer}>
                <Text style={styles.subtitle}>Вход</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Логин"
                    value={login}
                    onChangeText={setLogin}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.buttonContainer}>
                    <Button title="Войти" onPress={handleLogin} color="#FFFFFF" />
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.footer}>Мир Здоровья</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D0DCF8',
    },
    topContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
    },
    centerContainer: {
        flex: 2,
        justifyContent: 'center',
        padding: 10,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#263C70',
    },
    input: {
        height: 50,
        borderColor: '#263C70',
        backgroundColor: 'white',
        borderWidth: 3,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 23,
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
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 14,
    },
    buttonContainer: {
        backgroundColor: '#263C70',
        borderRadius: 25,
        overflow: 'hidden',
    },
    footer: {
        fontSize: 16,
        color: '#263C70',
    }
});


export default LoginForm;
