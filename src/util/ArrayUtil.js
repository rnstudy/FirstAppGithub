export default class ArrayUtil {
    /**
     * 更新数组，若Item已存在则从数据中将它移除，否则添加进数组
     */
   static updateArray(array,item){
       for(let i=0,len = array.length; i<len; i++){
           let temp =  array[i]
           if(temp === item){
               array.splice(i,1);
               return;
           }
       }
       array.push(item);
   }

    /**
     * 克隆一个数组
     * @param from 原始数组
     * @returns {Array}
     */
   static clone(from){
       if(!from)return[];
       let newArray = [];
       for(let i=0,len=from.length;i<len;i++){
           newArray[i] = from[i];
       }
       return newArray;
   }


    /**
     * 判断两个数组的元素是否一一对应
     * @param arr1
     * @param arr2
     * @returns {boolean} True or False
     */
   static isEqual(arr1,arr2){
       if(!(arr1 && arr2)) return false;
       if(arr1.length !== arr2.length) return false;
       for(let i=0,l=arr2.length; i<l;i++){
           if(arr1[i]!==arr2[i]) return false;
       }
       return true;
   }

    /**
     * 将数组中指定元素移除
     * @param arr
     * @param item
     */
    static remove(arr,item){
       if(!arr) return;
        for(let i=0,l=arr.length; i<l;i++){
            if(item===arr[i]) arr.splice(i,1);
        }
    }
}
