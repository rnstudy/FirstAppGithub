import {
    AsyncStorage
} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
    constructor(flag) {
        this.flag = flag;
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }

    /**
     * 收藏项目，保存收藏的项目
     * @param key   项目ID 或者 项目名称
     * @param value  要收藏的项目
     * @param callback
     */
    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error) => {
            if (!error) {
                this.updateFavoriteKeys(key,true);
            }
        })
    }

    /**
     * 更新Favorite key 集合
     * @param key
     * @param isAdd  true 添加，false 删除
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                var favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result)
                }
                var index = favoriteKeys.indexOf(key);
                console.log('当前key');
                console.log(key);
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key);
                    }
                    console.log('addKeys');
                    console.log(favoriteKeys);
                } else {
                    console.log('rm');
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1);
                    }
                    console.log('removeKeys');
                    console.log(favoriteKeys);
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
            }
        });
    }

    /**
     * 获取收藏的项目对应的Key方法
     * @returns {Promise<any>}
     */
    getFavoriteKeys(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
                if(!error){
                    try {
                        console.log('Current FavoriteKey!')
                        console.log(JSON.parse(result))
                        resolve(JSON.parse(result));
                    }catch (e) {
                        reject(e);
                    }

                }else{
                    reject(error);
                }
            })
        })
    }

    /**
     * 取消收藏，移除已经收藏的项目
     * @param key
     */
    removeFavoriteItem(key){
        this.updateFavoriteKeys(key,false);
    }

    /**
     * 获取用户所收藏的项目
     */
    getAllItems(){
        return new Promise((resolve,reject)=>{
            this.getFavoriteKeys()
                .then(keys=>{
                    var items = [];
                    if(keys){
                        AsyncStorage.multiGet(keys,(err,stores)=>{
                            try {
                                stores.map((result,i,store)=>{
                                    let value = store[i][1];
                                    if(value)items.push(JSON.parse(value));
                                })
                                resolve(items);
                            }catch (e) {
                                reject(e);
                            }

                        })
                    }else{
                        resolve(items);
                    }
                })
        })
    }

}