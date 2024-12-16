export default defineEventHandler(async (event) => {
    const {tokenApi, serverApi} = useRuntimeConfig()
    const {url, grade, question, section} = getQuery(event)
    const params = { 
        method : "POST" , 
        headers : { Authorization : tokenApi }, 
        body : {
            question : question,
            grade : grade,
            section : section
        }
    }
    
    const data = await $fetch(serverApi+"/link/"+url+"/answer",params)

    return data

})