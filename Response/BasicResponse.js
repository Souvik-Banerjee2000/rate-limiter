class Res {
    constructor(
        data = [],
        status = 200,
        message = "OK !",
        isError = false,

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

export default Res