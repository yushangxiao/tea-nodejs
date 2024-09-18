const rateLimit = require('express-rate-limit')

const apilimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 300, 
    standardHeaders: true, 
    legacyHeaders: true,
    message:async (request, response) => {
        return {success:false,error:"请求过于频繁，请稍后再试"};
    },
    keyGenerator:(request, response)=>{
        if (request.cookies.token) {
            return request.cookies.token
        }
        return request.ip
    }
})

const login_signup_limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: true,
    message:async (request, response) => {
        return {success:false,error:"请求过于频繁，请稍后再试"};
    }
})

const fileLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 800,
    standardHeaders: true,
    legacyHeaders: true,
    message:async (request, response) => {
        return {success:false,error:"请求过于频繁，请稍后再试"};
    }
})

module.exports = { apilimiter,login_signup_limiter,fileLimiter};