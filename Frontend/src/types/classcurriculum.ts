export type ClassStatus = 'aktif' | 'nonaktif'
export type Gender = 'L' | 'P'
export type StudentStatus = 'aktif' | 'nonaktif' | 'pindah'

export interface ClassStudent {
  name: string
  nis: string
  nisn: string
  gender: Gender
  status: StudentStatus
}

export interface SchoolClass {
  id: string
  name: string
  grade: 10 | 11 | 12
  major: string
  homeroomTeacher: string
  academicYear: string
  status: ClassStatus
  students: ClassStudent[]
  subjects: string[]
}

export interface SchoolClassFormValues {
  name: string
  grade: 10 | 11 | 12
  major: string
  homeroomTeacher: string
  academicYear: string
  status: ClassStatus
}

export type CurriculumStatus = 'aktif' | 'nonaktif'

export interface CurriculumSubject {
  code: string
  name: string
  group: string
  hoursPerWeek: number
  status: 'aktif' | 'nonaktif'
}

export interface Curriculum {
  id: string
  name: string
  academicYear: string
  grade: string
  major: string
  status: CurriculumStatus
  subjects: CurriculumSubject[]
}