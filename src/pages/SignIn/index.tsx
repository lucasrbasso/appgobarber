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

import { useAuth } from '../../hooks/Auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import getValidationsErros from '../../utils/getValidationsErros';

import {
    Container,
    Title,
    ForgotPassword,
    ForgotPasswordText,
    CreateAccountButton,
    CreateAccountButtonText,
} from './styles';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { signIn } = useAuth();

    const formRef = useRef<FormHandles>(null);
    const passwordRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    const handleSignIn = useCallback(
        async (data: SignInFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Insira um e-mail válido'),
                    password: Yup.string().required('Insira a senha'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await signIn({
                    email: data.email,
                    password: data.password,
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationsErros(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                Alert.alert(
                    'Erro na autenticação',
                    'Ocorreu um erro ao fazer login, cheque as credenciais',
                );
            }
        },
        [signIn],
    );

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
                            <Title>Faça seu login</Title>
                        </View>
                        <Form onSubmit={handleSignIn} ref={formRef}>
                            <Input
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
                            <Input
                                ref={passwordRef}
                                secureTextEntry
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                            />
                        </Form>

                        <Button
                            onPress={() => {
                                formRef.current?.submitForm();
                            }}
                        >
                            Entrar
                        </Button>
                        <ForgotPassword
                            onPress={() => {
                                navigation.navigate('ForgotPassword');
                            }}
                        >
                            <ForgotPasswordText>
                                Esqueci minha senha
                            </ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                    <CreateAccountButton
                        onPress={() => {
                            navigation.navigate('SignUp');
                        }}
                    >
                        <Icon name="log-in" size={20} color="#FF9000" />
                        <CreateAccountButtonText>
                            Criar uma conta
                        </CreateAccountButtonText>
                    </CreateAccountButton>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default SignIn;
