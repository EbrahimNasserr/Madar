'use client'

import { useState } from 'react'
import { Loader2, PowerOff } from 'lucide-react'
import type { Group } from '@/src/lib/api/groupsApi'
import { useDeleteGroupMutation } from '@/src/lib/api/groupsApi'
import { Modal, ModalBody, ModalFooter, ModalError } from '@/components/ui/Modal'
import { getApiErrorMessage } from './shared/constants'

type DeactivateModalProps = {
  group:   Group
  onClose: () => void
}

export function DeactivateModal({ group, onClose }: DeactivateModalProps) {
  const [deleteGroup, { isLoading }] = useDeleteGroupMutation()
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setError(null)
    try {
      await deleteGroup(group._id).unwrap()
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <Modal title="تعطيل المجموعة" onClose={onClose} size="sm">
      <ModalBody scrollable={false}>
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <PowerOff className="h-6 w-6 text-red-500" />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              هل تريد تعطيل مجموعة{' '}
              <span className="text-red-600">"{group.name}"</span>؟
            </p>
            <p className="mt-1 text-sm text-slate-500">
              سيتم تعطيل المجموعة ولن تظهر في القوائم النشطة.
            </p>
          </div>
        </div>

        <ModalError message={error} />
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition disabled:opacity-50"
        >
          إلغاء
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-60"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          تعطيل المجموعة
        </button>
      </ModalFooter>
    </Modal>
  )
}
