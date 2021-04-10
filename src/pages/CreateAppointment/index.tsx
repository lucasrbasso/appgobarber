import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';
import { Provider } from '../Dashboard';

import {
    Container,
    Header,
    BackButton,
    HeaderTitle,
    UserAvatar,
    ProvidersList,
    ProvidersListContainer,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
} from './styles';

interface RouteParams {
    providerId: string;
}

interface AvailabilityItem {
    hour: number;
    availability: boolean;
}

const CreateAppointment: React.FC = () => {
    const [providers, setProvider] = useState<Provider[]>([]);
    const { user } = useAuth();
    const route = useRoute();
    const { goBack } = useNavigation();

    const routeParams = route.params as RouteParams;

    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProvider, setSelectedProvider] = useState(
        routeParams.providerId,
    );

    useEffect(() => {
        api.get<Provider[]>('providers').then(response => {
            setProvider(response.data);
        });
    }, []);

    const navigateBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleSelectProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker(state => !state);
    }, []);

    const handleDateChange = useCallback(
        (event: any, date: Date | undefined) => {
            if (Platform.OS === 'android') {
                setShowDatePicker(false);
            }

            if (date) {
                setSelectedDate(date);
            }
        },
        [],
    );

    useEffect(() => {
        api.get<AvailabilityItem[]>(
            `providers/${selectedProvider}/day-availability`,
            {
                params: {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth() + 1,
                    day: selectedDate.getDate(),
                },
            },
        ).then(response => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <HeaderTitle>Cabeleireiros</HeaderTitle>
                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>

            <ProvidersListContainer>
                <ProvidersList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={providers}
                    keyExtractor={provider => provider.id}
                    renderItem={({ item: provider }) => (
                        <ProviderContainer
                            onPress={() => handleSelectProvider(provider.id)}
                            selected={provider.id === selectedProvider}
                        >
                            <ProviderAvatar
                                source={{
                                    uri: provider.avatar_url
                                        ? provider.avatar_url
                                        : 'https://source.unsplash.com/random',
                                }}
                            />
                            <ProviderName
                                selected={provider.id === selectedProvider}
                            >
                                {provider.name}
                            </ProviderName>
                        </ProviderContainer>
                    )}
                />
            </ProvidersListContainer>

            <Calendar>
                <Title>Escolha a data</Title>
                <OpenDatePickerButton onPress={handleToggleDatePicker}>
                    <OpenDatePickerButtonText>
                        Selecionar outra data
                    </OpenDatePickerButtonText>
                </OpenDatePickerButton>

                {showDatePicker === true && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        onChange={handleDateChange}
                        is24Hour
                        display="calendar"
                    />
                )}
            </Calendar>
        </Container>
    );
};

export default CreateAppointment;
