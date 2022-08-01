<template>
  <div class="navbar">
    <div class="app-breadcrumb">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      江苏传智播客教育科技股份有限公司
      <span class="breadBtn">体验版</span>

      <breadcrumb class="breadcrumb-container" />
      <div
        style="
          float: right;
          height: 100%;
          line-height: 50px;
          margin-right: 20px;
        "
      >
        <ThemePicker
          style="vertical-align: bottom; height: 40px; margin-right: 10px"
        ></ThemePicker>
        <FullScreen></FullScreen>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <svg-icon
              icon-class="language"
              style="color: #fff; font-size: 20px"
            ></svg-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh">中文</el-dropdown-item>
            <el-dropdown-item command="en">en</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img v-imgerror :src="avatar" class="user-avatar" />
            <span class="name">{{ name }}</span>
            <i class="el-icon-caret-bottom" style="color: #fff" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item> 首页 </el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://gitee.com/shuiruohanyu/hrsaas139">
              <el-dropdown-item>项目地址</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import Cookies from 'js-cookie'
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleCommand (command) {
      console.log(command)
      i18n.locale = command
      Cookies.set('locale', command)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  .app-breadcrumb {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      vertical-align: middle;
    }
    .name {
      color: #fff;
      vertical-align: middle;
      margin-left: 5px;
    }
    .user-dropdown {
      color: #fff;
    }
  }
}
</style>
