import React from 'react';
import { View } from 'react-native';
import { Container } from './styles';

const Profile: React.FC = () => {
    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Container />
        </View>
    );
};

export default Profile;
