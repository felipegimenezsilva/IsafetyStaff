export default defineEventHandler(async (event) => {
    const {tokenApi, serverApi} = useRuntimeConfig()
    const params = { headers : { Authorization : tokenApi}}
    const {url} = getQuery(event)
    const data = await $fetch(serverApi+"/link/"+url+"/sections",params)
    return data

})