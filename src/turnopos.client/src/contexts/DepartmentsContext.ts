import { createContext } from 'react';
import type Department from '../models/Department'

export default createContext<Department[]>([]);