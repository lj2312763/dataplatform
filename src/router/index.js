// import Vue from 'vue'  //加载优化
// import VueRouter from 'vue-router'  //加载优化
// Vue.use(VueRouter)  //加载优化

// 不在菜单导航里的路由
const Login = resolve => require(['@/views/login/index'], resolve)
const Err404 = resolve => require(['@/views/error/404'], resolve)
const Home = resolve => require(['@/views/home'], resolve)
    //重新加载当前路由
const Refresh = resolve => require(['@/views/refresh'], resolve)
    // this.$router.replace({
    //     path: '/refresh',
    //     params: {
    //         t: Date.now()
    //     }
    // })

// 在菜单导航里的路由
// 我的数据集
const Index = resolve => require(['@/views/index/index'], resolve)
const indexList = resolve => require(['@/views/index/components/list'], resolve)
const peoData = resolve => require(['@/views/index/components/peoData'], resolve)
const ageData = resolve => require(['@/views/index/components/ageData'], resolve)

// 公共数据集
const pubIndex = resolve => require(['@/views/pubData/index'], resolve)
const pubList = resolve => require(['@/views/pubData/components/pubList'], resolve)
const ecoData = resolve => require(['@/views/pubData/components/ecoData'], resolve)
const caseData = resolve => require(['@/views/pubData/components/caseData'], resolve)

// 数据处理
const dataDealIndex = resolve => require(['@/views/dataDeal/index'], resolve)
const unusual = resolve => require(['@/views/dataDeal/components/unusual'], resolve)
const defect = resolve => require(['@/views/dataDeal/components/defect'], resolve)
const unitCon = resolve => require(['@/views/dataDeal/components/unitCon'], resolve)
const separate = resolve => require(["@/views/dataDeal/components/separate"], resolve)
const merge = resolve => require(["@/views/dataDeal/components/merge"], resolve)
const replace = resolve => require(["@/views/dataDeal/components/replace"], resolve)
const columnMerge = resolve => require(['@/views/dataDeal/components/columnMerge'], resolve)
const rowMerge = resolve => require(['@/views/dataDeal/components/rowMerge'], resolve)
const Location = resolve => require(["@/views/dataDeal/components/Location"], resolve)
const character = resolve => require(["@/views/dataDeal/components/character"], resolve)
const calculate = resolve => require(["@/views/dataDeal/components/calculate"], resolve)

// 推断统计
const deduce = resolve => require(['@/views/deduce/index'], resolve)
const variance = resolve => require(['@/views/deduce/components/variance'], resolve)
const allVariance = resolve => require(['@/views/deduce/components/allVariance'], resolve)
const Tcheck = resolve => require(['@/views/deduce/components/Tcheck'], resolve)
const dbTcheck = resolve => require(['@/views/deduce/components/dbTcheck'], resolve)
const peiTcheck = resolve => require(['@/views/deduce/components/peiTcheck'], resolve)
const MannWhitney = resolve => require(['@/views/deduce/components/MannWhitney'], resolve)
const kruskal = resolve => require(['@/views/deduce/components/kruskal'], resolve)
const Wilcoxon = resolve => require(['@/views/deduce/components/Wilcoxon'], resolve)
    // 推断统计
const algorithm = resolve => require(['@/views/algorithm/index'], resolve)
const algorun = resolve => require(['@/views/algorithm/components/algorun'], resolve)
const algotest = resolve => require(['@/views/algorithm/components/algotest'], resolve)
const algoPre = resolve => require(['@/views/algorithm/components/algoPre'], resolve)
    // 不在菜单导航里的路由
export const publicRouterMap = [
        { path: '/login', name: 'Login', component: Login },
        { path: '/404', name: '404', component: Err404 },
        { path: '/refresh', name: 'Refresh', component: Refresh },
        { path: '*', redirect: '/404' }
    ]
    // 在菜单导航里的路由
export const menuRouterMap = [{
    path: "/",
    name: "home",
    component: Home,
    redirect: "/index",
    children: [{
            name: "Index",
            path: "/index",
            component: Index,
            redirect: "/index/list",
            meta: {
                title: "我的数据集",
                icon: "el-icon-mc-app",
                enable: "Y"
            },
            children: [{
                    name: "indexList",
                    path: "/index/list",
                    component: indexList,
                    meta: {
                        title: "数据列表",
                        enable: "Y"
                    },
                    children: [],
                },
                //   {
                //       name: "peoData",
                //       path: "index/peoData",
                //       component: peoData,
                //       meta: {
                //           title: "人口数据",
                //           enable: "Y"
                //       },
                //       children: [
                //       ],
                //   },
                {
                    name: "ageData",
                    path: "/index/ageData",
                    component: ageData,
                    meta: {
                        title: "年龄数据",
                        enable: "Y"
                    },
                    children: [],
                },
            ]
        },
        {
            name: "pubIndex",
            path: "/pubIndex",
            component: pubIndex,
            redirect: "/pubIndex/list",
            meta: {
                title: "公共数据集",
                icon: "el-icon-suitcase",
                enable: "Y"
            },
            children: [{
                    name: "pubList",
                    path: "/pubIndex/list",
                    component: pubList,
                    meta: {
                        title: "数据列表",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "ecoData",
                    path: "/pubIndex/ecoData",
                    component: ecoData,
                    meta: {
                        title: "经济数据",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "caseData",
                    path: "/pubIndex/caseData",
                    component: caseData,
                    meta: {
                        title: "案例数据",
                        enable: "Y"
                    },
                    children: [],
                },
            ]
        },
        {
            name: "dataDealIndex",
            path: "/dataDealIndex",
            component: dataDealIndex,
            redirect: "/dataDeal/unusual",
            meta: {
                title: "数据处理",
                icon: "el-icon-suitcase",
                enable: "Y"
            },
            children: [{
                    name: "unusual",
                    path: "/dataDeal/unusual",
                    component: unusual,
                    meta: {
                        title: "异常值处理",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "defect",
                    path: "/dataDeal/defect",
                    component: defect,
                    meta: {
                        title: "缺失值处理",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "unitCon",
                    path: "/dataDeal/unitCon",
                    component: unitCon,
                    meta: {
                        title: "单位转化",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "separate",
                    path: "/dataDeal/separate",
                    component: separate,
                    meta: {
                        title: "字段拆分",
                        enable: "Y"
                    },
                    children: []
                },
                {
                    name: "merge",
                    path: "/dataDeal/merge",
                    component: merge,
                    meta: {
                        title: "字段合并",
                        enable: "Y"
                    },
                    children: []
                },
                {
                    name: "replace",
                    path: "/dataDeal/replace",
                    component: replace,
                    meta: {
                        title: "字段替换",
                        enable: "Y"
                    },
                    children: []
                },
                {
                    name: "Location",
                    path: "/dataDeal/Location",
                    component: Location,
                    meta: {
                        title: "字段按位置提取",
                        enable: "Y"
                    },
                    children: []
                },
                {
                    name: "character",
                    path: "/dataDeal/character",
                    component: character,
                    meta: {
                        title: "字段按字符提取",
                        enable: "Y"
                    },
                    children: []
                },
                {
                    name: "columnMerge",
                    path: "/dataDeal/columnMerge",
                    component: columnMerge,
                    meta: {
                        title: "列合并",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "rowMerge",
                    path: "/dataDeal/rowMerge",
                    component: rowMerge,
                    meta: {
                        title: "行合并",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "calculate",
                    path: "/dataDeal/calculate",
                    component: calculate,
                    meta: {
                        title: "数据简单计算",
                        enable: "Y"
                    },
                    children: [],
                }
            ]
        },
        {
            name: "deduce",
            path: "/deduce",
            component: deduce,
            redirect: "/deduce/variance",
            meta: {
                title: "推断统计",
                icon: "el-icon-suitcase",
                enable: "Y"
            },
            children: [{
                    name: "variance",
                    path: "/deduce/variance",
                    component: variance,
                    meta: {
                        title: "单因素方差分析",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "allVariance",
                    path: "/deduce/allVariance",
                    component: allVariance,
                    meta: {
                        title: "多因素方差分析",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "Tcheck",
                    path: "/deduce/Tcheck",
                    component: Tcheck,
                    meta: {
                        title: "单样本T检验",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "dbTcheck",
                    path: "/deduce/dbTcheck",
                    component: dbTcheck,
                    meta: {
                        title: "两独立样本T检验",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "peiTcheck",
                    path: "/deduce/peiTcheck",
                    component: peiTcheck,
                    meta: {
                        title: "配对样本T检验",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "MannWhitney",
                    path: "/deduce/MannWhitney",
                    component: MannWhitney,
                    meta: {
                        title: "Mann—Whitney U 检验",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "kruskal",
                    path: "/deduce/kruskal",
                    component: kruskal,
                    meta: {
                        title: "Kruskal-Wallis H 检验",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "Wilcoxon",
                    path: "/deduce/Wilcoxon",
                    component: Wilcoxon,
                    meta: {
                        title: "Wilcoxon符号秩检验",
                        enable: "Y"
                    },
                    children: [],
                },
            ]
        },
        {
            name: "algorithm",
            path: "/algorithm",
            component: algorithm,
            redirect: "/algorithm/algorun",
            meta: {
                title: "算法模型",
                icon: "el-icon-suitcase",
                enable: "Y"
            },
            children: [{
                    name: "algorun",
                    path: "/algorithm/algorun",
                    component: algorun,
                    meta: {
                        title: "逻辑回归-算法训练",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "algotest",
                    path: "/algorithm/algotest",
                    component: algotest,
                    meta: {
                        title: "逻辑回归-模型评估",
                        enable: "Y"
                    },
                    children: [],
                },
                {
                    name: "algoPre",
                    path: "/algorithm/algoPre",
                    component: algoPre,
                    meta: {
                        title: "逻辑回归-模型预测",
                        enable: "Y"
                    },
                    children: [],
                },
            ]
        },


    ]
}];
export default new VueRouter({
    // mode: 'history',
    routes: [
        ...publicRouterMap,
        ...menuRouterMap
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})
