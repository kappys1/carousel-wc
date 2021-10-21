import { CAROUSEL_MODE } from './carousel.constants'

export const checkDefaultProps = <T>(prop: T | undefined, minimumCondition: T, defaultValue?: T) => prop && prop >= minimumCondition ? prop : defaultValue || minimumCondition
export const checkModeProp = (value: string) => value === CAROUSEL_MODE.HORIZONTAL ? CAROUSEL_MODE.HORIZONTAL : CAROUSEL_MODE.VERTICAL
