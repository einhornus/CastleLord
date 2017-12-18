class MessageHandler{
    constructor(){

    }

    static handle(message, server){
        throw new utils.Exception("Abstract method");
    }
}