import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import 'moment/locale/id'
moment.locale('id')
momentDurationFormatSetup(moment)
export const perbedaanWaktu = waktu => {
  if (!waktu || waktu === '-') {
    return ''
  }
  const now = moment()

  return moment.duration(moment(now).diff(waktu)).format('D [day], H [hour]')
}
