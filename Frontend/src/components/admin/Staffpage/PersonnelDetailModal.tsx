import Modal from '../Modal'
import type { Personnel } from '../../../types/Personnel'
import { ShieldCheck, Mail, CheckCircle2, User, BookOpen, School } from 'lucide-react'

interface PersonnelDetailModalProps {
  personnel: Personnel
  onClose: () => void
}

export default function PersonnelDetailModal({
  personnel,
  onClose,
}: PersonnelDetailModalProps) {
  return (
    <Modal title="Detail Personel" onClose={onClose} size="md">
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-brand-navy/10 pb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-light font-mono text-xl font-bold text-brand-orange">
            {personnel.initials}
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-navy">{personnel.name}</h3>
            <p className="font-mono text-xs text-brand-muted">NIP: {personnel.nip || '-'}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-blue-600">
                {personnel.type}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                  personnel.status === 'aktif'
                    ? 'bg-status-success-bg text-status-success'
                    : 'bg-status-danger-bg text-status-danger'
                }`}
              >
                {personnel.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="flex items-start gap-2.5">
            <Mail size={16} className="mt-0.5 text-brand-muted" />
            <div>
              <p className="font-semibold text-brand-navy">Email</p>
              <p className="text-brand-muted">{personnel.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <User size={16} className="mt-0.5 text-brand-muted" />
            <div>
              <p className="font-semibold text-brand-navy">Jabatan / Role</p>
              <p className="text-brand-muted">{personnel.role}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <BookOpen size={16} className="mt-0.5 text-brand-muted" />
            <div>
              <p className="font-semibold text-brand-navy">Mata Pelajaran / Penugasan</p>
              <p className="text-brand-muted">{personnel.assignment}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <School size={16} className="mt-0.5 text-brand-muted" />
            <div>
              <p className="font-semibold text-brand-navy">Status Walas</p>
              {personnel.homeroom.isHomeroom ? (
                <span className="inline-flex items-center gap-1 font-semibold text-status-success">
                  <CheckCircle2 size={13} />
                  Ya ({personnel.homeroom.className})
                </span>
              ) : (
                <p className="text-brand-muted">Tidak</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-brand-navy/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  )
}
