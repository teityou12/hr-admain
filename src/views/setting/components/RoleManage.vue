<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click="
        roleDialogVisible = true;
        isEdit = false;
        form = {};
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column label="角色名" prop="name" width="160px" sortable>
      </el-table-column>
      <el-table-column label="描述" prop="description" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="showRoleDialog(scope.row)"
            >修改</el-button
          >
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[2, 3, 4, 5, 6]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-row>
    <!-- 权限分配 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible">
      <!-- v-if作用：保证每次对话框关闭的时候 让tree销毁 再显示对话框的时候 看到的tree是一个新的el-tree -->
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="permissions"
        :props="{ label: 'name' }"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermissions"
      >
      </el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增和编辑的规划框 -->
    <el-dialog :title="isEdit? '编辑' : '新增'" :visible.sync="roleDialogVisible" @close="reset">
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description">></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="roleDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { tranferListToTree } from '@/utils'
import { getPermissions, getPermissionsById } from '@/api/permission'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 默认拿第一页数据
        pagesize: 4// 每页数量
      },
      roleList: [],
      total: null,
      rightVisible: false,
      permissions: [],
      selectedPermissions: [],
      id: null,
      roleDialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      this.roleList = res.rows
      this.total = res.total // 用于分页
    },
    handleCurrentChange (page) {
      console.log(page)
      this.paramsObj.page = page
      this.getRoleList()
    },
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    },

    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        // 删除当前这一页最后一页 就应该跑到上一页
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showRightDialog (id) {
      this.id = id
      // 获取所有权限点
      const res = await getPermissions()
      console.log(res)
      this.permissions = tranferListToTree(res, '0')
      // 获取当前权限点
      const res1 = await getPermissionsById(id)
      console.log(res1)
      this.selectedPermissions = res1.permIds
      this.rightVisible = true
    },
    async save () {
      const res = await getPermissionsById(this.id, this.$refs.myTree.getCheckedKeys())
      console.log(res)
      this.rightVisible = false // 把弹出层关闭
    },
    onClick () {
      // 二次校验
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
        }

        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    reset () {
      this.$refs.myForm.resetFields()
    },
    showRoleDialog (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      this.form = { ...row } // 浅拷贝
      // this.form = Object.assign({}, row)
    }
  }

}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
