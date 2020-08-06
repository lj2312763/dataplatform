import { requestLogin} from '@/api/login';
import { 
	setAuthInfo, removeAuthInfo
} from '@/session/index';

const admin = {
	state: {
        token:''
	},
	mutations: {
		SET_LOGIN_INFO:(state, loginInfo) => {
			state.token = loginInfo;
		},
		REMOVE_LOGIN_INFO:(state) => {
			state.token = "";
		}
	},
	actions: {
		// 设置用户授权信息
		setAuthInfo:({commit}, authData) => {
			commit('SET_LOGIN_INFO', authData);
		},
		// 移除用户授权信息
		removeAuthInfo:({commit}) => {
			commit('REMOVE_LOGIN_INFO');
		},
		// 执行登录操作
		goLogin({commit}, loginForm) {
			return new Promise((resolve, reject) => {
				requestLogin(loginForm).then(res => {
					if(res.code == 200000) {
						setAuthInfo(res.data);
					}
					resolve(res);
				}).catch(error => {
					reject(error);
				});
			}).catch(error => {
				reject(error);
			});
		},
		// 退出
		goLogOut() {
			return new Promise((resolve, reject) => {
				requestLogout({}).then(res => {
					removeAuthInfo();
					resolve(res);
				});
				// resolve();
			}).catch(error => {
				reject(error);
			});
		}
	}
}

export default admin;