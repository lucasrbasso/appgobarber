import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ContainerProps {
    isFocused: boolean;
    isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
    width: 100%;
    height: 60px;
    padding: 0 16px;
    background: #232129;
    margin-bottom: 8px;

    border-radius: 10px;
    border-width: 2px;
    border-color: #232129;

    ${props =>
        props.isErrored &&
        css`
            border-color: #c53030;
        `}

    ${props =>
        props.isFocused &&
        css`
            border-color: #ff9000;
        `}

    flex-direction: row;
    align-items: center;
`;

export const TextInput = styled.TextInput`
    flex: 1;
    color: #ffffff;
    font-size: 16px;
    font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
    margin-right: 16px;
`;

export const Error = styled.Text`
    margin-top: 0;
    padding: 0px;
    margin-bottom: 8px;
    color: #c53030;
`;
