<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
  >
    <el-col>
      <span>{{ node.data ? node.data.name : node.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="onCommand">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">添加子部门</el-dropdown-item>
              <template v-if="node.data">
                <el-dropdown-item command="b">查看部门</el-dropdown-item>
                <el-dropdown-item command="c">删除部门</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        @close="handleAddClose"
        @click.native.stop
      >
        <el-form
          ref="addFormRef"
          :model="addDepartmentForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="部门名称" prop="name">
            <el-input
              v-model="addDepartmentForm.name"
              placeholder="1-50个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门编码" prop="code">
            <el-input v-model="addDepartmentForm.code"></el-input>
          </el-form-item>
          <el-form-item label="部门负责人" prop="manager">
            <el-select
              v-model="addDepartmentForm.manager"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.username"
                :value="item.username"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门介绍" prop="introduce">
            <el-input
              v-model="addDepartmentForm.introduce"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import { getSimpleUserList } from '@/api/user'
import { delDepartment, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
export default {
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      // 拿到所有部门数据
      const res = await getDepartmentsList()
      if (this.isEdit) {
        // 标题不存在编辑
        const pid = this.node.data.pid
        // 排除自己 因为自己可以合自己重名
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名重复')) : callback()
      } else {
        // 待筛选的所有的子部门的Pid值
        const id = this.node.data ? this.node.data.id : ''
        // filter 筛选 只要子部门pid和当前部门id一样 说明就是它的子部门
        // some看有没有符合条件
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }

    return {
      dialogVisible: false,
      addDepartmentForm: {
        code: '', // 部门编码，同级部门不可重复
        introduce: '', // 介绍
        manager: '', // 负责人名称
        name: '', // 部门名称
        pid: ''// 父级部门ID

      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur' },
          { validator: validateName, trigger: 'change' }
        ]
      },
      users: {},

      isEdit: false // 用来判断当前是再做添加还是再做编辑
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      // if (this.users.length === 0) this.getSimpleUserList()
      if (key === 'a') {
        this.isEdit = false
        this.getSimpleUserList()
        this.dialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.dialogVisible = true
        this.getSimpleUserList()
        console.log('编辑')
        this.addDepartmentForm = { ...this.node.data }
      } else {
        try {
          await this.$confirm('确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.node.data.id)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('delDepartment')
        } catch (error) {
          console.log(error)
          this.$notify({
            message: '取消了删除',
            duration: 500
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      this.users = res
    },
    // 关闭dialog清空表单数据
    handleAddClose () {
      this.$refs.addFormRef.resetFields()
    },
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentForm.children // 把对象的children属性移除
        await editDepartment(this.addDepartmentForm)
      } else {
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
      }

      this.addDialogVisible = false
      this.$emit('delDepartment') // 子向父传值 数据更新要刷新tree
    }
  }
}

</script>

<style scoped lang='scss'>
</style>
