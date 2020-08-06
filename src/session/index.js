import store from '../store/index';

const adminId = 'adminId';
const adminName = 'adminName';
const operations = 'operations';
const token = 'token';

// loginId
export function getAdminId() {
  return sessionStorage.getItem(adminId);
}

export function setAdminId(adminId) {
  return sessionStorage.setItem(adminId, adminId);
}

export function removeAdminId() {
  return sessionStorage.removeItem(adminId);
}

// global
export function setAuthInfo(data) {
	let token = data;
	sessionStorage.setItem('token', token);
	store.dispatch('setAuthInfo', {
		token: token
	});

}

export function getAuthInfo() {
	return {
		// adminName: sessionStorage.getItem(adminName),
		// adminId: sessionStorage.getItem(adminId),
		// operations: sessionStorage.getItem(operations),
		token: sessionStorage.getItem(token)
	}
}

// 移除所有cookie
export function removeAuthInfo() {
	// sessionStorage.removeItem(adminName);
	// sessionStorage.removeItem(adminId);
	// sessionStorage.removeItem(operations);
	sessionStorage.removeItem(token);
	//sessionStorage.clear();
	store.dispatch('removeAuthInfo');
}
