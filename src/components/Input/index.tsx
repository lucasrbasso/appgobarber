import React, {
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
    useCallback,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon, Error } from './styles';

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
    containerStyle?: {};
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
    { name, containerStyle = {}, icon, ...rest },
    ref,
) => {
    const inputElementRef = useRef<any>(null);

    const { registerField, defaultValue = '', fieldName, error } = useField(
        name,
    );
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

    const [isFocused, setIsFocused] = useState(false);
    const [isField, setIsField] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        setIsField(!!inputValueRef.current.value);
    }, []);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        },
    }));

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',

            setValue(reference: any, value: string) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear();
            },
        });
    }, [fieldName, registerField]);

    return (
        <>
            <Container
                style={containerStyle}
                isFocused={isFocused}
                isErrored={!!error}
            >
                <Icon
                    name={icon}
                    size={20}
                    color={isFocused || isField ? '#ff9000' : '#666360'}
                />
                <TextInput
                    ref={inputElementRef}
                    keyboardAppearance="dark"
                    defaultValue={defaultValue}
                    placeholderTextColor="#666360"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChangeText={value => {
                        inputValueRef.current.value = value;
                    }}
                    {...rest}
                />
            </Container>
            {error && <Error>* {error}</Error>}
        </>
    );
};

export default forwardRef(Input);
