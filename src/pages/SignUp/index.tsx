import React, { useCallback, useRef } from 'react';
import {
    Image,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const navigation = useNavigation();

    const handleSignIn = useCallback((data: object) => {
        console.log(data);
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
                            <Title>Crie sua conta</Title>
                        </View>
                        <Form onSubmit={handleSignIn} ref={formRef}>
                            <Input name="name" icon="mail" placeholder="Nome" />
                            <Input
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                            />
                            <Input
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                            />
                        </Form>

                        <Button
                            onPress={() => {
                                formRef.current?.submitForm();
                            }}
                        >
                            Entrar
                        </Button>
                    </Container>
                    <BackToSignIn
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Icon name="arrow-left" size={20} color="#f4ede8" />
                        <BackToSignInText>Voltar para login</BackToSignInText>
                    </BackToSignIn>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default SignUp;
