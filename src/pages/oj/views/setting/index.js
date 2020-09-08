const Settings = () => import(/* webpackChunkName: "setting" */ './Settings.vue')
const ProfileSetting = () => import(/* webpackChunkName: "setting" */ './children/ProfileSetting.vue')
const SecuritySetting = () => import(/* webpackChunkName: "setting" */ './children/SecuritySetting.vue')
const AccountSetting = () => import(/* webpackChunkName: "setting" */ './children/AccountSetting.vue')
const PerformanceSetting = () => import(/* webpackChunkName: "setting" */ './children/PerformanceSetting.vue')
export {Settings, ProfileSetting, SecuritySetting, AccountSetting, PerformanceSetting}
