import React from 'react';
import { View, Button } from 'react-native';
import { Container } from './styles';

import { useAuth } from '../../hooks/Auth';

const Dashboard: React.FC = () => {
    const { signOut } = useAuth();

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Container>
                <Button title="Sair" onPress={signOut}>
                    Sign Out
                </Button>
            </Container>
        </View>
    );
};

export default Dashboard;
