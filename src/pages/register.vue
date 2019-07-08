<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item>
			<el-input v-model="form.name" placeholder="邮箱"></el-input>
			</el-form-item>
			<el-form-item>
			<el-input v-model="form.password" placeholder="至少6位密码,区分大小写"></el-input>
			</el-form-item>
			<el-form-item>
			<el-input v-model="form.password2" placeholder="确认密码"></el-input>
			</el-form-item>
			<el-form-item>
			<el-input v-model="form.phone" placeholder="手机号"></el-input>
			</el-form-item>
		</el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          // name: '',
          // region: '',
          // date1: '',
          // date2: '',
          // delivery: false,
          // type: [],
          // resource: '',
          // desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>

<style>
</style>
