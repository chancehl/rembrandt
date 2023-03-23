import dayjs from 'dayjs'
import plugin from 'dayjs/plugin/localizedFormat'

dayjs.extend(plugin)

export function formatter(date?: string | number | dayjs.Dayjs | Date | null | undefined) {
    return dayjs(date)
}
