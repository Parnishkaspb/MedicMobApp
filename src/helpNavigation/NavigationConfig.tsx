import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import LogoutScreen from '../screens/LogoutScreen';
import EditScreen from '../screens/EditScreen';
import NewWriteScreen from '../screens/NewWriteScreen';
import VisitDetailsScreen from '../screens/VisitDetailsScreen';

import { RootStackParamList, DrawerParamList } from './navigationTypes';
import { StyleSheet } from 'react-native';
import { CustomDrawerContent } from './CustomDrawerContent';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

export const styles = StyleSheet.create({
    exitButtonContainer: {
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
});

export const MainDrawer = () => (
    <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen name="Profile" options={{ title: 'Настройки' }} component={ProfileScreen} />
        <Drawer.Screen name="Home" options={{ title: 'Ваши записи' }} component={HomeScreen} />
        <Drawer.Screen name="NewWrite" options={{ title: 'Записаться к врачу' }} component={NewWriteScreen} />
    </Drawer.Navigator>
);

export const RootNavigator = () => (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainDrawer} />
        <Stack.Screen name="Logout" component={LogoutScreen} />
        <Stack.Screen name="Edit" options={{ title: 'Редактировать данные' }} component={EditScreen} />
        <Stack.Screen name="VisitDetails" component={VisitDetailsScreen} />
    </Stack.Navigator>
);
