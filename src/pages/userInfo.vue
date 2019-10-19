<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>个人资料</span>
    </div>
    <div class="mb20">
      <el-button type="success" size="medium" @click="userDataHandle"><i class="el-icon-edit"></i>编辑资料</el-button>
      <el-button type="primary" size="medium" @click="editPwdHandle"><i class="el-icon-edit-outline"></i>修改密码</el-button>
    </div>
    <div class="mt10">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="avatarBox">
            <!--<img src="../assets/image/flat-avatar.png" class="avatar" />
						<el-button type="primary" icon="el-icon-edit" size="mini" class="avatarButton">修改</el-button>
						<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="showFileList" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"></el-upload>-->
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form :model="userData" ref="userData" label-width="88px">
            <el-form-item label="用户名">
              <el-input v-model="userData.userName" readonly />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="userData.name" readonly />
            </el-form-item>
            <el-form-item label="用户角色">
              <el-input v-model="userData.userRole" readonly />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="userData.mobileNum" readonly />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userData.email" readonly />
            </el-form-item>
            <el-form-item label="公司">
              <el-input v-model="userData.company" readonly />
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="userData.department" readonly />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="userData.remark" readonly />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!--编辑资料-->
    <el-dialog title="个人信息编辑" :visible.sync="userDataModel" :close-on-click-modal="false" :before-close="closeUserDataModel"
      center width="30%">
      <el-form :model="userData" ref="userData" class="demo-dynamic" label-width="88px">
        <el-form-item label="姓名">
          <el-input v-model="userData.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="userData.mobileNum"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="userData.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="closeUserDataModel" size="medium">取消</el-button>
      </span>
    </el-dialog>
    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="changePwdModel" :close-on-click-modal="false" :before-close="closePwdModel"
      center width="30%">
      <el-form :model="pwdData" ref="pwdData" class="demo-dynamic" label-width="88px" :rules="editPwdRules">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="userData.oldPwd" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="userData.newPwd" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input v-model="userData.checkPwd" show-password clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="closePwdModel" size="medium">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'userInfo',
    data() {
      return {
        showFileList: false,
        userDataModel: false,
        changePwdModel: false,
        imageUrl: 'http://img.52z.com/upload/news/image/20180510/20180510081058_38160.jpg',
        pwdData: {
          oldPwd: '',
          newPwd: '',
          checkPwd: ''
        },
        userData: {
          userName: '张三',
          name: '李四',
          userRole: '管理员',
          mobileNum: '13875201452',
          email: '4798798@wdcsa.com',
          company: 'AccelPower',
          department: '运营部',
          remark: 'XXXXXXX'
        },
        editPwdRules: {
          oldPwd: [{
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }],
          newPwd: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
          checkPwd: [{
            required: true,
            message: '请确认新密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      //头像上传
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG || !isPNG) {
          this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isPNG && isLt2M;
      },
      //修改个人信息弹窗
      userDataHandle() {
        let _this = this;
        _this.userDataModel = true;
      },
      //关闭修改信息弹窗
      closeUserDataModel() {
        let _this = this;
        _this.userDataModel = false;
      },
      //修改密码弹窗
      editPwdHandle() {
        let _this = this;
        _this.changePwdModel = true;
      },
      //关闭修改密码弹窗
      closePwdModel() {
        let _this = this;
        _this.changePwdModel = false;
        _this.pwdData = {
          oldPwd: '',
          newPwd: '',
          checkPwd: ''
        }
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
