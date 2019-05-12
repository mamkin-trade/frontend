// Dependencies
import { i18n } from '../plugins/i18n'

export function rowsPerPageItems(includeAll = true) {
  const values = [5, 10, 25] as any[]
  if (includeAll) {
    values.push({ text: i18n.t('all'), value: -1 })
  }
  return values
}
