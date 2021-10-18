export const checkDefaultProps = <T>(prop: T | undefined, minimumCondition: T, defaultValue?: T) => prop && prop >= minimumCondition ? prop : defaultValue || minimumCondition
