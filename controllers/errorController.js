
const sendDev = (err, res) =>{
    res.statusCode(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack
    })
}

const sendProd = (err, res)=>{
    if(err.isOperational){
        res.statusCode(err.statusCode).json({
            status: err.status,
            message: err.message 
        })
    }else{
        console.log("ERROR", err)

        res.statusCode(500).json({
            status: "error",
            message: "something went wrong"
        })
    }
}


module.exports = (err, res, req, next)=>{
    this.statusCode = this.statusCode || 500
    this.status = this.status || "error"

    if(process.env.NODE_ENV === 'development'){
        sendDev(err, res)
    }else if(process.env.NODE_ENV === 'production'){
        sendProd(err, res)
    }
}