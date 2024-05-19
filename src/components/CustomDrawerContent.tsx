
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={styles.exitContainer}>
                <DrawerItem
                    label="Exit"
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    exitContainer: {
        marginBottom: 20,
    },
});

export default CustomDrawerContent;
