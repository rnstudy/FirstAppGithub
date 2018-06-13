import {
    AsyncStorage
} from 'react-native';

export default class DataRepository {

    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            //获取本地的数据
            this.fetchLocalRepository(url)
                .then(result=>{
                    if(result){
                        resolve(result);
                    }else{
                        this.fetchNetRepository(url)
                            .then(result=>{
                                resolve(result);
                            })
                            .catch(e=>{
                                resolve(e);
                            })
                    }
                })
                .catch(e=>{
                    this.fetchNetRepository(url)
                        .then(result=>{
                            resolve(result);
                        })
                        .catch(e=>{
                            resolve(e);
                        })
                })
        })
    }


    /**
     *
     * @param url
     * @param items
     * @param callback
     */
    saveRepository(url,items,callback){
        if(!url || !items) return;
        let wrapData = {
            items:items,
            update_date:new Date().getTime()
        }
        AsyncStorage.setItem(url,JSON.stringify(wrapData),callback);
    }

    /**
     * 判断数据是否过时 (有效天数为5天)
     * @param longTime
     * @returns {boolean}
     */
    checkData(longTime){  //保存5天
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        if(cDate.getMonth() !== tDate.getMonth()) return false;
        if(cDate.getDay() !== tDate.getDay()) return false;
        if(cDate.getHours() - tDate.getHours() >4) return false;
        return true;
    }

    /**
     * 获取本地数据
     * @returns {Promise<any>}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url,(error,result)=>{
                if(!error){
                    try{
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e)                    }
                }else{
                    reject(error)
                }
            })

        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if(!result){
                        reject(new Error('responsedData is null'));
                        return;
                    }
                    resolve(result.items);
                    this.saveRepository(url,result.items);
                })
                .then(error => {
                    reject(error)
                })
                .done();
        })
    }
}