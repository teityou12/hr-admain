<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/png,image/jpg,image/jpeg,image/gif"
      :limit="limit"
      :class="{ hidden: filesList.length === limit }"
      :on-change="handleChange"
      :file-list="filesList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-progress :percentage="percent"></el-progress>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKID33tkPr7LMFwVt53nLgqm9KRPBkLkyyqb',
  SecretKey: 'lJfswnkYB9tQksoaBev0scBYiiW7pY9a'
})
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filesList: [],
      percent: 0
    }
  },
  methods: {
    handleRemove (file) {
      console.log(file)
      this.filesList = this.filesList.filter(item => item.uid !== file.uid)
      this.percent = 0
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file, fileList) {
      console.log(fileList)
      this.filesList = fileList
    },
    handleChange (file, fileList) {
      console.log(fileList)
      this.filesList = fileList
    },
    handleRequest (obj) {
      var that = this
      console.log(obj)
      cos.putObject({
        Bucket: 'heima321-1313062293', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + obj.file.name, /* 必须 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        onProgress: function (progressData) {
          that.percent = Math.ceil(progressData.loaded / progressData.total * 100)
        }
      }, (err, data) => {
        console.log(err || data)
        this.src = data.Location
      })
    }

  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
