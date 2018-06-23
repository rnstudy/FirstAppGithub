import {
    AsyncStorage
} from 'react-native';

import DataRepository ,{FLAG_STORAGE} from "./DataRepository";
import Utils from'../../util/Utils'
var itemMap = new Map();
export default class RepositoryUtils {
    constructor(aboutCommon){
        this.aboutCommon = aboutCommon;
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my);
    }

    /**
     * 更新数据
     * @param k
     * @param v
     */
    updateData(k,v){
        itemMap.set(k,v);
        var arr = [];
        for(let value of itemMap.values()){
            arr.push(value)
        }
        this.aboutCommon.onNotifyDataChanged(arr);
    }

    /**
     * 获取制定url下的数据
     * @param url
     */
    fetchRepository(url){
        this.dataRepository.fetchRepository(url)
            .then(result=>{
                if(result){
                    this.updateData(url,result);
                    if(Utils.checkData(result.update_date)){
                        return this.dataRepository.fetchNetRepository(url);
                    }

                }
            }).then((item)=>{
                if(item){
                    this.updateData(url,item);
                }
        }).catch(e=>{

        })
    }

    /**
     * 批量获取urls对应的数组
     * @param urls
     */
    fetchRepositorys(urls){
        for(let i =0;i<urls.length;i++){
            let url = urls[i]
            this.fetchRepository(url);
        }
    }

}