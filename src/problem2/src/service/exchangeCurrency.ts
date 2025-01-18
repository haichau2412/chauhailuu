
interface ExchangeAPIPros {
    targetId: string,
    sourceId: string,
    value: number
}

export const fakeExchange = async ({ targetId, sourceId, value }: ExchangeAPIPros) => {


    if (typeof targetId === 'string' && typeof sourceId === 'string' && typeof value === 'number') {
        console.log('Sending . . . ', targetId, "==>", sourceId)

        return new Promise((r) => {
            setTimeout(() => {
                r(true)
            }, 2000)
        })
    }

    return false
}