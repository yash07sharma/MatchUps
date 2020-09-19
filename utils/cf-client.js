const https = require('https')
class CF{
    constructor(handle){
        this.handle = handle
    }
    info()
    {
        const user = this
        return new Promise((resolve,reject)=>{
            https.get(`https://codeforces.com/api/user.info?handles=${user.handle}`,(res)=>{
                user.HTTPSstatus = res.statusCode
                if(res.statusCode!=200)
                    return resolve(user)
                console.log('getting user info in cf-client')
                var data = ''
                res.on('data',(d)=> data+=d)
                   .on('end',()=>{
                       const userInfo = JSON.parse(data)
                       user.maxRating = userInfo.result[0].maxRating
                       user.rating = userInfo.result[0].rating
                        console.log('response ended in https get in cf-client ')
                        return resolve(user)
                    })
            })
            .on('error',(err)=>{
                        console.log(err)
                        reject(err)
            })
        })
    }
}

module.exports = CF