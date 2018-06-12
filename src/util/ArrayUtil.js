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
}
