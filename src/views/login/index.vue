<template>
<div id="login-warpper">
    <div class="login-container">
        <img class="login-bg" src="static/images/login-bg.jpg">
        <div class="login-content">
            <div class="login-card">
                <div class="login-title">数据平台</div>
                <div class="login-item-box" v-show="!dragFlag">
                    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="right" label-width="105px" class="login-form">
                        <el-form-item prop="userPhone" label="用户名" class="login-item">
                            <el-input type="text" v-model.trim="loginForm.userPhone" :maxlength="40" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="密码" class="login-item">
                            <el-input type="password" v-model.trim="loginForm.password" :maxlength="20" placeholder="请输入密码" @keyup.enter.native="handleLogin"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button class="login-button" type="primary" :loading="loading" @click.native.prevent="handleLogin">登 录</el-button>
                </div>
            </div>
        </div>
    </div>
    <!-- 登录 -->
    <div class="login-bottom">
        <span>建议浏览器：Chrome</span>
        <span>建议分辨率：1920x1080</span>
    </div>
</div>
</template>

<script>
import md5 from 'js-md5'
import { mapActions } from 'vuex';
import { removeAuthInfo } from '@/session/index';
// import SlideVerify from './components/slideVerify.vue';
export default {
    name: 'Login',
    // components: {
    //     SlideVerify
    // },
    data() {
        let checkAdminName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写用户名'));
            }else {
                callback();
            }
        };
        let checkPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }else {
                callback();
            }
        };
        return {
            loginForm: {
                userPhone: '',
                password: '',
            },
            loginRules: {
                userPhone: [
                    { validator: checkAdminName, trigger: 'blur' }
                ],
                password: [
                    { validator: checkPassword, trigger: 'blur' }
                ]
            },
            loading: false
        }
    },
    created() {
        // let _data = localStorage.getItem("yk-token");
        // if(_data) {
        //     this.$router.push({ path: '/' });
        // }
    },
    methods: {
        ...mapActions(['goLogin']),
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    // let _password = this.loginForm.password.length > 20 ? this.loginForm.password : md5(md5(this.loginForm.password));
                    // let _param = Object.assign({}, this.loginForm, {
                    //     password: _password
                    // });
                    let _param = Object.assign({}, this.loginForm);
                    this.loginFunc(_param);
                    // this.loginFunc(this.loginForm);
                } else {
                    this.loading = false;
                    return false;
                }
            });
        },
        loginFunc(params) {
            this.goLogin(params).then(res => {
                if(res.code == 200000) {
                    localStorage.setItem("yk-token",res.data);
                    this.$router.push({ path: '/' });
                }else {
                    this.loading = false;
                    this.removeStorage();
                }
            }).catch(err => {
                this.loading = false;
                this.removeStorage();
            })
        },
        removeStorage() {
            removeAuthInfo();
            localStorage.removeItem("yk-token");
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
#login-warpper {
    font-family: MicrosoftYaHei;
    position: relative;
    height: 100%;
    background-color: #f2f2f2;
    letter-spacing: 2px;
    line-height: 40px;
    .login-logo {
        position: absolute;
        left: 49px;
        top: 36px;
    }
    .login-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom:0;
        .login-bg {
            width: 100%;
            height: 100%;
        }
    }
    .login-bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        text-align: right;
        color: #666;
        font-size: 14px;
        span {
            padding: 0 20px;
        }
    }
    .login-content {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        @include layoutMode();
        .login-card {
            position: absolute;
            background-color: rgba(255, 255, 255, .5);
            width: 440px;
            line-height: 50px;
        }
    }
    .login-title {
        font-size: 30px;
        height: 80px;
        letter-spacing: 3px;
        background-color: #f2f2f2;
        color: #000;
        @include layoutMode();
    }
    .login-item-box {
        padding: 40px 40px 57px;
        .login-item {
            background-color: #fff;
        }
    }
    .login-button {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        background-color: #3293bd;
        border-radius: 10px;
        font-size: 18px;
        color: #fff;
        border: none;
        margin-top: 30px;
    }
}
</style>
<style lang="scss">
@import "@/assets/scss/theme.scss";
.login-item-box {
    .el-form-item {
        margin-right: 0 !important;
    }
    .el-form-item__label {
        position: relative;
        color: #999;
        height: 50px;
        padding: 0;
        @include layoutMode();
        &:after {
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: #bfbfbf;
        }
    }
    .el-input__inner {
        font-size: 14px;
        background: transparent;        
        border: none !important;
        height: 50px;
        padding: 0 21px;
        @include layoutMode(pack);
        color: #333 !important;
        width: 100% !important;
    }
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        -webkit-text-fill-color: #333;
    }
    .el-button{
        i, span{
            line-height: 0;
            vertical-align: middle;
        }
    }
}
</style>