class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went worng",
        errors=[],
        statck=""


    ){
        super(message)
        this.statusCode=statusCode
        this.Data=null
        this.message=message
        this.success=false
        this.errors=errors
        if(stack){
            this.stack=statck

        }else{
            Error.captureStackTrace(this,this.constructor)
            
        }
    }
}

export {ApiError}; 