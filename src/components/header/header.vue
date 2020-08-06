<template>
<div id="header">
    <div class="logo">
        <!-- <img src="static/images/logo.png" class="logo-img"/> -->
        <em class="name">数据平台</em>
    </div>
    <div class="userinfo">
        <el-dropdown trigger="hover">
            <span class="el-dropdown-link userinfo-inner">
                <i class="icon iconfont el-icon-mc-yonghuzhongxin_f c-vertical-middle"></i>
                <em class="name c-vertical-middle">{{sysAdminName}}</em>
            </span>
            <el-dropdown-menu slot="dropdown" class="c-header-dropdown">
                <el-dropdown-item divided>版本V{{version}}</el-dropdown-item>
                <el-dropdown-item divided @click.native="resetPassword">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

    <!-- <dialog-reset-password v-if="dialogResetPasswordFlag" @cancleFunc="cancleFunc"></dialog-reset-password> -->
</div>
</template>
<script>
import { mapActions } from 'vuex';
import { removeAuthInfo } from '@/session/index';
// import DialogResetPassword from "./components/resetPassword.vue";
export default {
    name: "HeaderBar",
    // components: {
    //     DialogResetPassword
    // },
    data() {
        return {
            dialogResetPasswordFlag: false,
            sysAdminName: this.$store.state.admin.adminName,
            version: window.config.version
        }
    },
    methods: {
        ...mapActions(['goLogOut']),
        //退出登录
        logout: function() {
            this.$confirm('确认退出吗?', '提示', {
            }).then(() => {
                 this.$router.push({ path: '/login' });
                // this.goLogOut().then(res => {
                //     // this.$message({
                //     //     type: 'success',
                //     //     duration: '1500',
                //     //     message: res.message,
                //     //     showClose: true
                //     // });  
                //     removeAuthInfo();
                //     localStorage.removeItem("yk-token");
                //     this.$router.push({ path: '/login' });
                // });
            }).catch(err => {
                console.log("取消退出！");
            });
        },
        resetPassword(){ 
            this.dialogResetPasswordFlag = true;
        },
        cancleFunc() {
            this.dialogResetPasswordFlag = false;
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
#header {
    background: #1a1d20;
    position: relative;
    padding: 11px 20px;
    height: 28px;
    @include layoutMode(between);
    .userinfo {
        .userinfo-inner {
            cursor: pointer;
            color: #999;
            .icon {
                font-size: 28px;
                line-height: 28px;
                margin-right: 10px;
            }
        }
    }
    .logo {
        @include layoutMode(align);
        .logo-img {
            height: 26px;
            margin-right: 10px;
        }
        .name {
            font-size: 24px;
            line-height: 28px;
            color: #fff;
            letter-spacing: 3px;
        }
    }
}
</style>
