export default class Utils {

    /**
     * 检查该Item 有没有收藏过
     * @param item
     * @param items
     * @returns {boolean}
     */
    static checkFavorite(item, items) {
        for (let i = 0; i < items.length; i++) {
            let id = item.id ? item.id.toString() : item.fullName
           // console.log('id:' + id+'-'+'itemID' + items[i]);
            if (id === items[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查项目更新时间
     * @param longTime  项目更新时间
     * @returns {boolean} true 不需要更新，false需要更新
     */
    static checkData(longTime) {  //保存5天
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDay() !== tDate.getDay()) return false;
        if (cDate.getHours() - tDate.getHours() > 4) return false;
        return true;
    }
}
