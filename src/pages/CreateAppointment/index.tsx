import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
    Content,
    ProvidersList,
    ProvidersListContainer,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    DateText,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
    Schedule,
    Section,
    SectionTitle,
    SectionContent,
    Hour,
    HourText,
    CreateAppointmentButton,
    CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
    providerId: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {
    const [providers, setProvider] = useState<Provider[]>([]);
    const { user } = useAuth();
    const route = useRoute();
    const { goBack, navigate } = useNavigation();

    const routeParams = route.params as RouteParams;

    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProvider, setSelectedProvider] = useState(
        routeParams.providerId,
    );
    const [selectedHour, setSelectedHour] = useState(0);

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

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);

            date.setHours(selectedHour);
            date.setMinutes(0);
            date.setSeconds(0);

            const formattedDate = format(date, 'yyyy-MM-dd:HH:mm:ss');

            await api.post('appointments', {
                provider_id: selectedProvider,
                date: formattedDate,
            });

            const providerFind = providers.find(
                provider => provider.id === selectedProvider,
            );

            if (!providerFind) {
                throw new Error('Unable to find provider');
            }

            const providerName = providerFind.name;

            navigate('AppointmentCreated', {
                date: date.getTime(),
                providerName,
            });
        } catch (err) {
            Alert.alert('Erro ao criar agendamento', `${err}`);
        }
    }, [navigate, selectedProvider, selectedDate, selectedHour, providers]);

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

    const formattedDate = useMemo(() => {
        const date = new Date(selectedDate);

        date.setHours(selectedHour);
        date.setMinutes(0);
        date.setSeconds(0);

        return format(date, "EEEE', dia' dd 'de' MMMM 'de' yyyy.", {
            locale: ptBR,
        });
    }, [selectedDate, selectedHour]);

    const morningAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour < 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                    available,
                };
            });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour >= 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                    available,
                };
            });
    }, [availability]);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <HeaderTitle>Cabeleireiros</HeaderTitle>
                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>

            <Content>
                <ProvidersListContainer>
                    <ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={provider => provider.id}
                        renderItem={({ item: provider }) => (
                            <ProviderContainer
                                onPress={() =>
                                    handleSelectProvider(provider.id)
                                }
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
                    <DateText>{formattedDate}</DateText>
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

                <Schedule>
                    <Title>Escolha o horário</Title>
                    <Section>
                        <SectionTitle>Manhã</SectionTitle>
                        <SectionContent>
                            {morningAvailability.map(
                                ({ hourFormatted, available, hour }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        key={hourFormatted}
                                        available={available}
                                        onPress={() => handleSelectHour(hour)}
                                    >
                                        <HourText
                                            selected={selectedHour === hour}
                                        >
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                                ),
                            )}
                        </SectionContent>
                    </Section>
                    <Section>
                        <SectionTitle>Tarde</SectionTitle>
                        <SectionContent>
                            {afternoonAvailability.map(
                                ({ hourFormatted, available, hour }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        key={hourFormatted}
                                        available={available}
                                        onPress={() => handleSelectHour(hour)}
                                    >
                                        <HourText
                                            selected={selectedHour === hour}
                                        >
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                                ),
                            )}
                        </SectionContent>
                    </Section>
                </Schedule>

                <CreateAppointmentButton>
                    <CreateAppointmentButtonText
                        onPress={handleCreateAppointment}
                    >
                        Agendar
                    </CreateAppointmentButtonText>
                </CreateAppointmentButton>
            </Content>
        </Container>
    );
};

export default CreateAppointment;
