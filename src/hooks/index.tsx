import React from 'react';

import { AuthProvider } from './Auth';

const AppProviders: React.FC = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
);

export default AppProviders;
