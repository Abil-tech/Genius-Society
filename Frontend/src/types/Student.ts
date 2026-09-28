export type StudentStatus = 'aktif' | 'nonaktif'
export type Gender = 'L' | 'P'

export interface Student {
  id: string
  name: string
  email: string
  nis: string
  nisn: string
  nik: string
  gender: Gender
  birthPlace: string
  birthDate: string
  phone: string
  address: string
  className: string
  major: string
  grade: number
  academicYear: string
  homeroomTeacher: string
  status: StudentStatus
  username: string
  lastLogin: string
  createdAt: string
}

export interface StudentFormValues {
  name: string
  nis: string
  nisn: string
  nik: string
  gender: Gender
  birthPlace: string
  birthDate: string
  email: string
  phone: string
  address: string
  className: string
  major: string
  grade: number
  academicYear: string
  username: string
  password: string
  status: StudentStatus
}