import React, { useCallback, useRef } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationsErros from '../../utils/getValidationsErros';

import {
    Container,
    Buttons,
    BackButton,
    LogOutButton,
    Title,
    UserAvatarButton,
    UserAvatar,
} from './styles';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const SignUp: React.FC = () => {
    const { user, updateUser, signOut } = useAuth();

    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const oldPasswordInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    const handleUpdateAvatar = useCallback(() => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            response => {
                if (response.didCancel) {
                    return;
                }

                if (response.errorCode) {
                    Alert.alert('Erro ao atualizar seu avatar');
                }

                const data = new FormData();

                data.append('avatar', {
                    uri: response.uri,
                    name: response.fileName,
                    type: response.type,
                });

                api.patch('/users/avatar', data).then(userResponse => {
                    updateUser(userResponse.data);
                });
            },
        );
    }, [updateUser]);

    const handleSignUp = useCallback(
        async (data: ProfileFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigat??rio'),
                    email: Yup.string()
                        .required('E-mail obrigat??rio')
                        .email('Insira um e-mail v??lido'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is(val: string | any[]) {
                            return !!val.length;
                        },
                        then: Yup.string()
                            .min(6, 'No m??nimo 6 d??gitos')
                            .required('Campo Obrigat??rio'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is(val: string | any[]) {
                                return !!val.length;
                            },
                            then: Yup.string().required('Campo Obrigat??rio'),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref('password'), null],
                            'Senhas devem ser iguais.',
                        ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const {
                    name,
                    email,
                    old_password,
                    password,
                    password_confirmation,
                } = data;

                const formData = {
                    name,
                    email,
                    ...(old_password
                        ? {
                              old_password,
                              password,
                              password_confirmation,
                          }
                        : {}),
                };

                const response = await api.put('/profile', formData);
                await updateUser(response.data);

                Alert.alert('Perfil Atualizado com Sucesso');

                navigation.goBack();
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationsErros(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                Alert.alert(
                    'Erro na atualiza????o do perfil',
                    'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
                );
            }
        },
        [navigation, updateUser],
    );

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

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
                        <Buttons>
                            <BackButton onPress={handleGoBack}>
                                <Icon
                                    name="chevron-left"
                                    size={24}
                                    color="#999591"
                                />
                            </BackButton>

                            <LogOutButton onPress={signOut}>
                                <Icon name="power" size={24} color="#999591" />
                            </LogOutButton>
                        </Buttons>

                        <UserAvatarButton onPress={handleUpdateAvatar}>
                            <UserAvatar source={{ uri: user.avatar_url }} />
                        </UserAvatarButton>

                        <View>
                            <Title>Meu perfil</Title>
                        </View>
                        <Form
                            initialData={user}
                            onSubmit={handleSignUp}
                            ref={formRef}
                        >
                            <Input
                                autoCapitalize="words"
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}
                            />
                            <Input
                                ref={emailInputRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    oldPasswordInputRef.current?.focus();
                                }}
                            />
                            <Input
                                ref={oldPasswordInputRef}
                                textContentType="newPassword"
                                secureTextEntry
                                name="old_password"
                                icon="lock"
                                placeholder="Senha atual"
                                returnKeyType="next"
                                containerStyle={{ marginTop: 16 }}
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={passwordInputRef}
                                textContentType="newPassword"
                                secureTextEntry
                                name="password"
                                icon="lock"
                                placeholder="Nova senha"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    confirmPasswordInputRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={confirmPasswordInputRef}
                                textContentType="newPassword"
                                secureTextEntry
                                name="password_confirmation"
                                icon="lock"
                                placeholder="Confirmar senha"
                                returnKeyType="go"
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
                            Confirmar mudan??as
                        </Button>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default SignUp;
