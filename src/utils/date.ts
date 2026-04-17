import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

export const formatDate = (date: string) => dayjs(date).format('DD/MM/YYYY')
export const todayISO = () => dayjs().format('YYYY-MM-DD')
