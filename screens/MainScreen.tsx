// src/screens/MainScreen.tsx
import React from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {logout} from '../redux/slices/authSlice';

const MainScreen: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <View>
      <Text>Welcome, {user?.email ?? 'Guest'}</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
};

export default MainScreen;
