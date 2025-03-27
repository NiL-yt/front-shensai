<template>
  <el-row style="height: 100%">
    <el-col
      :span="8"
      :offset="8"
      style="border-style: solid; border-color: #e6e6e6; margin-top: 5%"
    >
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form label-width="80px">
            <h1>智慧医疗</h1>
            <h3>登录界面</h3>
            <el-form-item label="账户地址:">
              <el-input type="primary" v-model="address"></el-input>
            </el-form-item>
            <el-form-item label="用户密码:">
              <el-input type="password" v-model="password"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="primary" @click="register">注册</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      address: "",
      password: "",
    };
  },
  methods: {
    login: function () {
      if (this.address == "") {
        alert("区块链地址不能为空！");
      } else {
        let postData = {
          address: this.address,
          password: this.password,
        };
        this.axios.post("/user/login", postData).then((response) => {
          console.log(response.data);
          if (response.data.code == 200) {
            this.$cookies.set("address", this.address);
            this.$cookies.set("role", response.data.data.role);
            alert("登录成功");
            this.$router.push("/home");
          } else {
            alert(`登录失败, ${response.data.data}`);
          }
        });
      }
    },
    register: function () {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped></style>
