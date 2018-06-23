import RepositoryDetail from "../pages/RepositoryDetail";

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

}