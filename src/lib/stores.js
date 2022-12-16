import { writable } from 'svelte/store'

export const isPlaying = writable(false)
export const isPlayerTurn = writable(false)
export const oppHoverColumn = writable(false)
export const oppDropColumn = writable(false)
export const hoverColumn = writable(false	)
export const dropColumn = writable(false)
