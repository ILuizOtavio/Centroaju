'use client'

import { addEventConfirmXp, addPurchaseBonusXp, loadState, saveState } from './persistence'

/** +100 XP Explorador / bônus Guardião por produto (1x por dia por produto) */
export function grantPurchaseXp(productId: string) {
  const key = `${productId}-${new Date().toISOString().slice(0, 10)}`
  const s = loadState()
  const next = addPurchaseBonusXp(s, key)
  saveState(next)
  return next
}

export function grantEventConfirmXp(eventId: string) {
  const s = loadState()
  const next = addEventConfirmXp(s, eventId)
  saveState(next)
  return next
}
