export interface TaskManagementFilterValues {
  search: string
  teacher: string
  subject: string
  className: string
  status: string
  academicYear: string
  dateRange: 'semua' | 'hari_ini' | '7_hari' | '30_hari' | 'custom'
  customFrom: string
  customTo: string
}

export const emptyTaskManagementFilters: TaskManagementFilterValues = {
  search: '',
  teacher: 'semua',
  subject: 'semua',
  className: 'semua',
  status: 'semua',
  academicYear: 'semua',
  dateRange: 'semua',
  customFrom: '',
  customTo: '',
}