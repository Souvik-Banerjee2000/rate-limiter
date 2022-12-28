class Err {
    constructor(
        message = "Some Error Occured",
        data = null,
        status = 500,
        isError = true
       
    ){
        this.status = status;
        this.message = message;
        this.isError = isError;
        this.data = data
    }

    get getValues(){
        return {
            'error':this.isError,
            'status':this.status,
            'data':this.data,
            'message':this.message
        }
    }

}

export default Err 
