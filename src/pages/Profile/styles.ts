import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.ScrollView`
    flex: 1;
    padding: 0 30px ${Platform.OS === 'android' ? 80 : 40}px;
`;

export const Buttons = styled.View`
    margin-top: 60px;
    flex-direction: row;
    justify-content: space-between;
`;

export const BackButton = styled.TouchableOpacity``;

export const LogOutButton = styled.TouchableOpacity``;

export const Title = styled.Text`
    font-size: 20px;
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
    width: 140px;
    height: 140px;
    border-radius: 70px;
    align-self: center;
`;
