export function pickRandomElement(arr: any[]) {
    return arr[pickRandomInt(0, arr.length)]
}

export function pickRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * max)
}
