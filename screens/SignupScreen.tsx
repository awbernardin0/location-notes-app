import React, { useState } from 'react';
import { TextInput, Button, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { signup } from '../redux/slices/authSlice';

const SignupScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  // Accessing the loading and error states from the auth slice
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const handleSignup = () => {
    if (!email.trim() || !password.trim()) {
      alert('Email and password cannot be empty.');
      return;
    }
    dispatch(signup(email, password));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Reusing styles for consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: 'gray',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignupScreen;
