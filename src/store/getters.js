const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  roles: state => state.user.roles,
  account: state => state.user.account,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters