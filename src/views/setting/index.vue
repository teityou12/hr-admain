<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <RoleManager></RoleManager>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <CompanyIofo></CompanyIofo>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import RoleManager from './components/RoleManage'
import CompanyIofo from './components/CompanyIofo.vue'
export default {
  filters: {},
  components: { RoleManager, CompanyIofo },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
