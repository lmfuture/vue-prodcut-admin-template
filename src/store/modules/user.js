import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken,setMenu } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  menu:''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENU:(state,menu)=>{
    state.menu=menu
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if(response.code==='100100'){
          const { result } = response;
          commit('SET_MENU',result.menu.children);
          commit('SET_TOKEN', result.username);
          if(result.menu.children.length>0){
            setToken(result.username);
          }
          setMenu(JSON.stringify(result.menu.children));
        }else{
          Message({
            message: response.msg || 'Error',
            type: 'error',
            duration: 3 * 1000
          });
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

