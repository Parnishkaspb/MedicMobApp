import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SecureStorage from 'react-native-secure-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from '../axios/axiosConfig';

import { RootStackParamList } from '../helpNavigation/navigationTypes';
type LoginFormProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LogoutScreen: React.FC = () => {

    const navigation = useNavigation<LoginFormProps>();

    useEffect(() => {
        const logout = async () => {
            const accessToken = await SecureStorage.getItem('access_token');
            if (accessToken) {
                await axios.post('logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
            }

            await SecureStorage.removeItem('access_token');
            navigation.navigate('Login');
        };

        logout();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Logging out...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#000',
    },
});

export default LogoutScreen;
