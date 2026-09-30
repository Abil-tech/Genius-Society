import { getStudentDashboard } from '../services/studentService'
import { useAsync } from './useAsync'

export const useStudentDashboard = () => useAsync(getStudentDashboard)
