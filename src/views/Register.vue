<template>
  <el-row style="height: 100%;">
    <el-col :span="8" :offset="8" style="border-style: solid;border-color: #e6e6e6;margin-top: 5%">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form label-width="100px">
            <h3>注册界面</h3>
            <el-form-item label="用户名称:">
              <el-input type="primary" v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="账户地址:">
              <el-input type="primary" v-model="address"></el-input>
            </el-form-item>
            <el-form-item label="用户密码:">
              <el-input type="password" v-model="password"></el-input>
            </el-form-item>
            <el-form-item label="请选择角色:">
              <el-radio-group v-model="role">
                <!-- :label为待填内容 -->
              <el-radio :label="0">医生</el-radio>
              <el-radio :label="1">患者</el-radio>
              <el-radio :label="2">医院</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="padding-bottom:20px">
        <!-- click为待填内容 -->
        <el-button type="primary" @click="register">注册</el-button>
        <el-button type="primary" @click="goback">返回</el-button>
      </el-row>
    </el-col>

  </el-row>

</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      role: '',
      name: '',
      address:'',
      password: '',
    }
  },
  methods: {
    register: function () {
      if (this.address == "") {
        alert("区块链地址不能为空！")
      }else {
        let postData = {
          role: this.role,
          name: this.name,
          address:this.address,
          password: this.password
        }
        this.axios.post('/user/register', postData).then((response) => {
          if (response.data.code == 200) {
            alert('注册成功')
            this.$router.push('/login')
          }else {
            alert(`注册失败, ${response.data.data}`)
          }
        })
      }
    },
    goback: function () {
      this.role = ''
      this.name =  ''
      this.address = ''
      this.password = ''
      this.$router.push('/login')
    }

  }
}
</script>

<style scoped>

</style>