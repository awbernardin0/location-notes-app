import { useDispatch as reduxUseDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

export const useDispatch = () => reduxUseDispatch<AppDispatch>();
