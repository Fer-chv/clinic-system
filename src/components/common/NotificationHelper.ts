import { message } from 'antd'

export const showSuccessMessage = (text: string, duration: number = 2) => {
  message.success({
    content: text,
    duration,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
  })
}

export const showErrorMessage = (text: string, duration: number = 3) => {
  message.error({
    content: text,
    duration,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
  })
}

export const showWarningMessage = (text: string, duration: number = 2) => {
  message.warning({
    content: text,
    duration,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    },
  })
}

export const showInfoMessage = (text: string, duration: number = 2) => {
  message.info({
    content: text,
    duration,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
  })
}

// Mensajes comunes predefinidos
export const CommonMessages = {
  // Success
  createdSuccess: (entity: string) => `${entity} creado exitosamente`,
  updatedSuccess: (entity: string) => `${entity} actualizado exitosamente`,
  deletedSuccess: (entity: string) => `${entity} eliminado exitosamente`,
  savedSuccess: 'Cambios guardados exitosamente',

  // Error
  createError: (entity: string) => `Error al crear ${entity}`,
  updateError: (entity: string) => `Error al actualizar ${entity}`,
  deleteError: (entity: string) => `Error al eliminar ${entity}`,
  saveError: 'Error al guardar los cambios',
  loadError: (entity: string) => `Error al cargar ${entity}`,
  validationError: 'Por favor, revise los campos requeridos',

  // Warning
  deleteWarning: (entity: string) => `¿Estás seguro de que deseas eliminar ${entity}?`,
  unsavedChanges: 'Tienes cambios sin guardar',

  // Info
  noData: (entity: string) => `No hay ${entity} disponibles`,
  loading: 'Cargando...',
}

// Hook para manejo de errores en operaciones async
export const handleAsyncError = (error: any, fallbackMessage: string) => {
  const message = error?.message || fallbackMessage
  showErrorMessage(message)
  console.error('Error:', error)
}

// Hook para confirmación de eliminación
export const confirmDelete = (callback: () => void, entity: string) => {
  if (window.confirm(CommonMessages.deleteWarning(entity))) {
    callback()
  }
}
