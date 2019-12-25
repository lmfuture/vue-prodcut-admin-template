const state = {
	baseInfo:''
}
const mutations = {
	GET_BASEINFO(state,data){
		state.baseInfo = data;
	}
}

const actions = {
	getBaseInfo({commit},data){
		commit('GET_BASEINFO',data)
	}
}

const getters = {
	baseInfo: state => state.baseInfo
}

export default {
	namespaced:true,
	state,
	mutations,
	actions,
	getters
}