import type { ScheduleDay, WeekSummary } from '../../types/Guru/teachingSchedule'

export const weekSummary: WeekSummary = {
  totalHours: 32.5,
  kpiProgress: 82,
  nextClass: {
    subject: 'Mekanika Fluida',
    time: '13:00',
  },
}

export const weeklySchedule: ScheduleDay[] = [
  {
    day: 'Senin',
    date: '15 April',
    sessions: [
      {
        id: 'sen-1',
        startTime: '08:00',
        endTime: '10:00',
        subject: 'Mekanika Fluida',
        className: 'XII PPLG 1',
        room: 'Lab Teknik 1',
        status: 'selesai',
      },
      {
        id: 'sen-2',
        startTime: '10:30',
        endTime: '12:30',
        subject: 'Desain Sistem Industri',
        className: 'X PPLG 2',
        room: 'Ruang 204',
        status: 'berlangsung',
      },
      {
        id: 'sen-3',
        startTime: '13:00',
        endTime: '15:00',
        subject: 'Mekanika Fluida',
        className: 'XII PPLG 2',
        room: 'Lab Teknik 1',
        status: 'mendatang',
      },
    ],
  },
  {
    day: 'Selasa',
    date: '16 April',
    sessions: [
      {
        id: 'sel-1',
        startTime: '13:00',
        endTime: '15:00',
        subject: 'Termodinamika Lanjut',
        className: 'XI PPLG 2',
        room: 'Ruang 201',
        status: 'mendatang',
      },
    ],
  },
  {
    day: 'Rabu',
    date: '17 April',
    sessions: [
      {
        id: 'rab-1',
        startTime: '08:00',
        endTime: '10:00',
        subject: 'Desain Sistem Industri',
        className: 'X PPLG 1',
        room: 'Ruang 204',
        status: 'mendatang',
      },
      {
        id: 'rab-2',
        startTime: '10:30',
        endTime: '12:30',
        subject: 'Mekanika Fluida',
        className: 'XII PPLG 1',
        room: 'Lab Teknik 1',
        status: 'mendatang',
      },
    ],
  },
  {
    day: 'Kamis',
    date: '18 April',
    sessions: [
      {
        id: 'kam-1',
        startTime: '09:15',
        endTime: '10:45',
        subject: 'Termodinamika Lanjut',
        className: 'XI PPLG 1',
        room: 'Ruang 201',
        status: 'mendatang',
      },
    ],
  },
  {
    day: 'Jumat',
    date: '19 April',
    sessions: [
      {
        id: 'jum-1',
        startTime: '08:00',
        endTime: '09:30',
        subject: 'Desain Sistem Industri',
        className: 'X PPLG 2',
        room: 'Ruang 204',
        status: 'mendatang',
      },
    ],
  },
]