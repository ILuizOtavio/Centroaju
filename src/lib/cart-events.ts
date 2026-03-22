export const CART_CHANGE_EVENT = 'centroaju-cart-changed'

export type CartChangeDetail = {
  /** Mostrar toast de confirmação ao adicionar */
  productName?: string
}

export function notifyCartChanged(detail?: CartChangeDetail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail }))
}
