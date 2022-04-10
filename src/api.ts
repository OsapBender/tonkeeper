type Methods = 'GET' | 'POST'

const genericRequest = (method: Methods) => async <T>(
    apiRequestUrl: string,
    body?: {},
    headers?: {},
): Promise<T> => {
    const headersEntity = new Headers({ 'Content-Type': 'application/json', ...headers })

    const options: RequestInit = {
        body: body ? JSON.stringify(body) : null,
        headers: headersEntity,
        method,
    }

    return fetch(apiRequestUrl, options)
        .then(async response => {
            const data: T = await response.json()

            if (!response.ok) {
                throw data
            }

            return data
        })
        .catch(error => {
            throw error
        })
}

export const api = {
    post: genericRequest('POST'),
    get: genericRequest('GET'),
}
