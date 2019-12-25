const state = {
	commonData1:''
}
const mutations = {
	GET_DATA1(state,data){
		state.commonData1 = data;
		console.log(state)
	}
}

const actions = {
	getData1({commit},data){
		commit('GET_DATA1',data)
	}
}

export default {
	namespaced:true,
	state,
	mutations,
	actions,
}