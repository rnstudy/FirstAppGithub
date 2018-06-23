

export default function makeCancelable(promise) {
    let hasCanceled_ = false;
    const wrappedPromis = new Promise((resolve,reject)=>{
        promise.then((val)=>{
            hasCanceled_ ? reject({isCanceled:true}):resolve(val)
        });
        promise.catch((error)=>{
            hasCanceled_ ? reject({isCanceled:true}):resolve(val)
        });
    })
    return{
        promise:wrappedPromis,
        cancel(){
            hasCanceled_ = true;
        }
    }

}