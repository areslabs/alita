import mockRepos from "./reposData"
export function formatK(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k"
    }

    return num
}
export const token = `8f01f66946cf40b508a322b9dc57be124b24e7c8`
export function fetchRepos(page, perPage) {
    const items = mockRepos.items.slice((page - 1) * perPage, page * perPage)
    const resData = Object.assign({}, mockRepos, {
        items: items
    })
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(resData)
        }, 200)
    })
}
