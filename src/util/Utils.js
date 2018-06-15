export default class Utils {

    /**
     * 检查该Item 有没有收藏过
     * @param item
     * @param items
     * @returns {boolean}
     */
    static checkFavorite(item, items) {
        for (let i = 0; i < items.length; i++) {
            let id = item.id ? item.id > toString() : item.fullName
            if (id === items[i]) {
                return true;
            }
        }
        return false;
    }
}
