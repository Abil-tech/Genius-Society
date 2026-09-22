export type SubjectGroup = 'umum' | 'kejuruan' | 'muatan_lokal'
export type SubjectStatus = 'aktif' | 'nonaktif'

export interface SubjectTeacher {
  name: string
  nip: string
  classes: string[]
}

export interface Subject {
  id: string
  code: string
  name: string
  group: SubjectGroup
  grades: number[]
  status: SubjectStatus
  description: string
  teachers: SubjectTeacher[]
  classes: string[]
  curriculums: string[]
}

export interface SubjectFormValues {
  name: string
  code: string
  group: SubjectGroup
  grades: number[]
  description: string
  status: SubjectStatus
}