<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
<style lang="scss" scoped >
::v-deep .scrollbar-wrapper {
  background: url("~@/./assets/common/leftnavBg.png") no-repeat 0 100%;
}
::v-deep .el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
  a {
    li {
      .svg-icon {
        color: #fff;
        font-size: 18px;
        vertical-align: middle;
        .icon {
          color: #fff;
        }
      }
      span {
        color: #fff;
      }
      &:hover {
        .svg-icon {
          color: #43a7fe;
        }
        span {
          color: #43a7fe;
        }
      }
    }
  }
}
</style>
