import RepositoryDetail from "../pages/RepositoryDetail";
import {FLAG_STORAGE} from "../expand/dao/DataRepository";

export default class ActionUtil {
    /**
     * 跳转到详情页
     * @param params  要传递的参数
     */
    static onSelectRepository(params) {
        var {navigator} = params
        navigator.push({
            component: RepositoryDetail,
            params: {
                ...params
            }
        })
    }

    /**
     * favoiteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    static onFavorite(favoriteDao, item, isFavorite,flag) {
        let key = flag === FLAG_STORAGE.flag_trending? item.fullName:item.id.toString()
        ///let key = item.id?item.id.toString():item.fullName
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(key)
        }
    }


}