<template>
<section class="home-container">
    <header-bar></header-bar>
    <section class="main-container">
        <section class="menu-wrapper">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <!-- <div class="menuShow" @click="collapse">
                         <i class="el-icon-guide" ></i>
                    </div> -->
                    <!--导航菜单-->
                    <el-menu 
                        class="el-menu-vertical-demo"
                        :default-active="$route.path"
                        unique-opened 
                        router 
                        @open="handleopen" 
                        @close="handleclose" 
                        @select="handleselect" 
                        :collapse="isCollapse">
                        <template v-for="(item,index) in menuRouterMap[0].children" v-if="item.meta.enable == 'Y'">
                            <!-- <template v-if="item.children.length == 0">
                                <el-menu-item :index="item.path" :key="item.meta.title" v-if="item.meta.enable == 'Y'">
                                    <i :class="item.meta.icon" v-if="item.meta.icon"></i>
                                    <span>{{item.meta.title}}</span>
                                </el-menu-item>
                            </template> -->
                            <el-submenu :index="index+''" :key="index" v-if="item.children.length > 0" ref="submenu">
                                <template v-if="item.meta.enable == 'Y'">
                                    <template slot="title">
                                        <i :class="item.meta.icon" v-if="item.meta.icon"></i>
                                        <span>{{item.meta.title}}</span>
                                    </template>
                                    <template v-for="(itemChild, itemIndex) in item.children">
                                        <el-submenu :index="itemIndex+''" :key="itemIndex" v-if="itemChild.children.length > 0">
                                            <template v-if="itemChild.meta.enable == 'Y'">
                                                <template slot="title">
                                                    <i :class="item.meta.icon" v-if="itemChild.meta.icon"></i>
                                                    <span>{{itemChild.meta.title}}</span>
                                                </template>
                                                <template v-for="(itemSubChild) in itemChild.children">
                                                    <el-menu-item :index="itemSubChild.path" :key="itemSubChild.name" v-if="itemSubChild.meta.enable == 'Y'" :class="$route.meta.active == itemChild.name ? 'is-active' : ''">
                                                        <i :class="itemSubChild.meta.icon" v-if="itemSubChild.meta.icon"></i>
                                                        <span slot="title">{{itemSubChild.meta.title}}</span>
                                                    </el-menu-item>
                                                </template>
                                            </template>
                                        </el-submenu>
                                        <template v-else>
                                            <el-menu-item :index="itemChild.path" :key="itemChild.name" v-if="itemChild.meta.enable == 'Y'" :class="$route.meta.active == itemChild.name ? 'is-active' : ''">
                                                <i :class="itemChild.meta.icon" v-if="itemChild.meta.icon"></i>
                                                <span slot="title">{{itemChild.meta.title}}</span>
                                            </el-menu-item>
                                        </template>
                                    </template>
                                </template>
                            </el-submenu>
                        </template>
                    </el-menu>
                </div>
            </div>
        </section>

        <section class="content-container">
            <!-- <el-breadcrumb class="c-title" separator-class="el-icon-arrow-right" v-if="$route.meta.enable == 'Y' && $route.meta.title != '首页'">
                <el-breadcrumb-item class="c-title-item">{{realBreadlist[realBreadlist.length-1].meta.title}}</el-breadcrumb-item>
            </el-breadcrumb> -->
            <!-- :class="($route.meta.enable == 'Y' && $route.meta.title != '首页') ? 'c-content-wrapper-inner' : ''" -->
            <section class="c-content-wrapper" >
                <div class="c-scroll-wrap" ref="scorllWrap">
                    <div class="c-scroll-inner">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </div>
                </div>
            </section>

        </section>

    </section>
</section>
</template>

<script>
import HeaderBar from '@/components/header/header.vue'
import { menuRouterMap } from '@/router';
export default {
    data() {
        return {
            isCollapse: false,
            menuRouterMap: menuRouterMap
        }
    },
    components: {
        HeaderBar
    },
    computed: {
        realBreadlist() {
            let _breadlist = [];
            for (const routeInfo of this.$route.matched) {
                if (typeof routeInfo.name === 'string' && routeInfo.name !== 'home') {
                    _breadlist.push(routeInfo);
                }
            }
            return _breadlist;
        }
    },
    watch: {
        deep: true,
        "$route"(newVal, oldVal) {
            this.$refs.scorllWrap.scrollTop = 0;
        },
    },
    mounted() {
    },
    methods: {
        handleopen() {
          
        },
        handleclose() {
          
        },
        handleselect: function(a, b) {
          
        },
        //折叠导航栏
        collapse: function() {
            this.isCollapse = !this.isCollapse;
        }
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/theme.scss";
.home-container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .main-container {
        width: 100%;
        display: flex;
        position: absolute;
        top: 50px;
        bottom: 0;
        overflow: hidden;
        justify-content: space-between;
        .menu-wrapper {
            height: 100%;
            width: 210px;
            //position: relative;
           // position: absolute;
            // top: 0;
            // bottom: 0;
            // left: 0;
            background-color: #1a1d20;
            .menuShow{
                text-align: right;
                font-size: 20px;
                color: #fff;
                padding-right: 25px;
                cursor: pointer;
            }
            .c-scroll-wrap::-webkit-scrollbar-thumb { /*滚动条里面可以拖动的那部分（位置5）*/
                // background: rgba(245, 147, 7, .5);
                background: rgba(255, 255, 255, .5);
            }
        }
        .content-container {
            flex:1;
            height: 100%;
            // position: relative;
            // left: 15%;
            // top: 0;
            // right: 0;
            // bottom: 0;
            .c-content-wrapper {
                position: relative;
                height: 100%;
                width:100%;
            }
            .c-content-wrapper-inner {
                height: calc(100% - 54px);
            }
        }
    }
}
</style>
<style lang="scss">
.el-menu-vertical-demo {
    background-color: #1a1d20 !important;
    &.el-menu {
        border: none;
    }
    .el-menu-item{
        font-size: 14px;
        color: #999;
        height: 46px;
        line-height: 46px;
        padding: 0 20px 0 24px;
        border-bottom: 1px solid #1a1d20;
        &:focus,
        &:hover {
            color: #fff;
            background-color: transparent;
        }
        &.is-active {
            // color: #f59307 !important;
            background: #32373c;
            border-bottom-color: #586069;
        }
        i {
            color: inherit;
        }
    }
    .el-submenu {
        .el-menu {
            background: transparent;
            padding: 2px 0;
            .el-menu-item{
                position: relative;
                // padding-left: 52px !important;
                min-width: auto;
                height: 36px;
                line-height: 36px;
                border: none;
                &.is-active {
                    color: #2ea7d4 !important;
                    &:after {
                        content: "";
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translate(0, -50%);
                        border-width: 8px;
                        border-style: solid;
                        border-color:transparent #f5f5f5 transparent transparent;
                    }
                }
            }
        }
        &.is-opened {
        // &.is-active {
        // .is-active {
            background-color: #32373c;
            .el-submenu__title{
                 border-bottom-color: #586069 !important;
            }
        }
    }
    [class^=el-icon-] {
        color: #999;
        font-size: 16px;
    }
    .el-submenu__title{
        // padding: 0 0 0 24px;
        height: 46px;
        line-height: 46px;
        color: #999;
        &:focus,
        &:hover {
            color: #fff;
            background-color: transparent;
        }
    }
}
.el-menu-vertical-demo > .el-submenu> .el-submenu__title{
        border-bottom: 1px solid #1a1d20 !important;
    }
</style>
