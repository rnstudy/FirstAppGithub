import {
    AsyncStorage
} from 'react-native';

import GitHubTrending from 'GitHubTrending'

export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending',flag_my:'my'}
export default class DataRepository {

    constructor(flag) {
        this.flag = flag;
        if (flag === FLAG_STORAGE.flag_trending) {
            this.trending = new GitHubTrending();
        }
    }

    /**
     *
     * @param url
     * @param items
     * @param callback
     */
    saveRepository(url, items, callback) {
        if (!url || !items) return;
        let wrapData;
        if(this.flag===FLAG_STORAGE.flag_my){
            wrapData={
                item:items,
                update_date: new Date().getTime()
            }
        }else{
            wrapData = {
                items: items,
                update_date: new Date().getTime()
            }
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    /**
     * 获取仓库数据
     * @param url
     * @returns {Promise<any>}
     */
    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            //获取本地的数据
            this.fetchLocalRepository(url)
                .then(result => {
                    if (result) {
                        resolve(result);
                    } else {
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result);
                            })
                            .catch(e => {
                                resolve(e);
                            })
                    }
                })
                .catch(e => {
                    this.fetchNetRepository(url)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(e => {
                            resolve(e);
                        })
                })
        })
    }

    /**
     * 获取本地数据
     * @returns {Promise<any>}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e)
                    }
                } else {
                    reject(error)
                }
            })

        })
    }

    /**
     * 获取网络数据
     * @param url
     * @returns {Promise<any>}
     */
    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            if(this.flag !== FLAG_STORAGE.flag_trending){
                fetch(url)
                    .then(response => response.json())
                    .catch((error)=>{
                        reject(error);
                    })
                    .then(responseData => {
                        if(this.flag === FLAG_STORAGE.flag_my && responseData){
                            this.saveRepository(url,responseData);
                            resolve(responseData);
                        }else if(responseData && responseData.items){
                            this.saveRepository(url, responseData.items);
                            resolve(responseData);
                        }else{
                            reject(new Error('responseData is null!'));
                        }
                    })
                    .catch(error => {
                        reject(error)
                    })
            }else{
                this.trending.fetchTrending(url)
                    .then(result=>{
                        if(!result){
                            reject(new Error('responsedData is null'));
                            return;
                        }
                        this.saveRepository(url,result);
                        resolve(result);
                    })
            }
        })
    }


    /**
     * 判断数据是否过时 (有效天数为5天)
     * @param longTime
     * @returns {boolean}
     */
    checkData(longTime) {  //保存5天
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDay() !== tDate.getDay()) return false;
        if (cDate.getHours() - tDate.getHours() > 4) return false;
        return true;
    }




}