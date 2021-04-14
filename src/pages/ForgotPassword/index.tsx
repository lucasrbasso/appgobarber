import React, { useCallback, useRef } from 'react';
import {
    Image,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import getValidationsErros from '../../utils/getValidationsErros';

import {
    Container,
    Title,
    SendEmailButton,
    SendEmailButtonText,
} from './styles';
import api from '../../services/api';

interface SignInFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Insira um e-mail válido'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/password/forgot', {
                email: data.email,
            });

            Alert.alert(
                'E-mail enviado com sucesso',
                'Visite sua caixa de entrada para resetar sua senha',
            );

            navigation.navigate('SignIn');
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationsErros(err);
                formRef.current?.setErrors(errors);

                return;
            }

            Alert.alert(
                'Erro ao enviar e-mail',
                'Ocorreu um erro ao enviar e-mail para resetar a senha, cheque as credenciais',
            );
        }
    }, []);

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}
                >
                    <Container>
                        <Image source={logoImg} />
                        <View>
                            <Title>Resetar sua senha</Title>
                        </View>
                        <Form onSubmit={handleSignIn} ref={formRef}>
                            <Input
                                containerStyle={{ marginBottom: 20 }}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordRef.current?.focus();
                                }}
                            />
                        </Form>

                        <Button
                            onPress={() => {
                                formRef.current?.submitForm();
                            }}
                        >
                            Enviar
                        </Button>
                    </Container>
                    <SendEmailButton
                        onPress={() => {
                            navigation.navigate('SignIn');
                        }}
                    >
                        <Icon name="log-in" size={20} color="#FF9000" />
                        <SendEmailButtonText>
                            Voltar para login
                        </SendEmailButtonText>
                    </SendEmailButton>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default ForgotPassword;
