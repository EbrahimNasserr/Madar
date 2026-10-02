'use client'

import { useState } from 'react'
import type { CreateGroupInput, Group } from '@/src/lib/api/groupsApi'
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from '@/src/lib/api/groupsApi'
import { Modal, ModalBody, ModalError } from '@/components/ui/Modal'
import { GroupForm } from './GroupForm'
import { getApiErrorMessage } from './shared/constants'
import { toast } from 'sonner'

type GroupModalProps = {
  group?:  Group   // present → edit mode
  onClose: () => void
}

export function GroupModal({ group, onClose }: GroupModalProps) {
  const isEdit = Boolean(group)

  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation()
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation()
  const isSubmitting = isCreating || isUpdating

  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (data: CreateGroupInput) => {
    setFormError(null)
    try {
      if (isEdit && group) {
        await updateGroup({ id: group._id, body: data }).unwrap()
        toast.success('تم تعديل المجموعة بنجاح')
      } else {
        await createGroup(data).unwrap()
        toast.success('تم إنشاء المجموعة بنجاح')
      }
      onClose()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    }
  }

  return (
    <Modal
      title={isEdit ? 'تعديل المجموعة' : 'إنشاء مجموعة جديدة'}
      onClose={onClose}
      size="lg"
    >
      <ModalBody>
        <ModalError message={formError} />

        <GroupForm
          group={group}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </ModalBody>
    </Modal>
  )
}
