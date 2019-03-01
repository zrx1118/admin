export function param2obj(url) {
    let search = url.split('?')[1]
    if (!search) {
        return {}
    } else {
        return JSON.parse(
            '{"' +
            decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
            + '"}'
        )
    }
}
