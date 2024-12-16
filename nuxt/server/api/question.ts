export default defineEventHandler(async (event) => {
    const {tokenApi, serverApi} = useRuntimeConfig()
    const params = { headers : { Authorization : tokenApi, time:Date()}}
    const {url} = getQuery(event)
    const data = await $fetch(serverApi+"/link/"+url+"/ask",params)
    return data
})