// @ts-expect-error OSEF
export const dump = <T>(obj: T) => console.log(obj) || obj
