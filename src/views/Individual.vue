<template>
  <div id="app">
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <Header />
      </el-header>
      <!-- 主体容器 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <Navigator />
        </el-aside>
        <!-- 主内容区域 -->
        <el-main style="padding-top: 50px">
          <el-row>
            <el-col :span="12" :offset="6">
              <!-- 显示账户类型 -->
              <el-row>
                账户类型：{{ getRoleText() }}
              </el-row>
              <!-- 显示账户地址 -->
              <el-row style="padding-top: 10px">
                账户地址：{{ address }}
              </el-row>
              <!-- 根据用户角色显示不同信息 -->
              <el-row v-if="userRole === '0'" style="padding-top: 10px">
                您是医生，可以新增病历和管理自己创建的病历。
              </el-row>
              <el-row v-if="userRole === '1'" style="padding-top: 10px">
                您是患者，可以查看自己的病历信息。
              </el-row>
              <el-row v-if="userRole === '2'" style="padding-top: 10px">
                您是医院，可以查看全部病历信息。
              </el-row>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Navigator from "@/components/Navigator";
import Header from "@/components/Header";
export default {
  name: "AccountInfo",
  data() {
    return {
      userRole: "",
      address: "",
      role:''
    };
  },
  components: {
    Navigator,
    Header,
  },

  methods: {
    // 根据用户角色返回对应的文本描述
    getRoleText() {
      switch (this.userRole) {
        case "0":
          this.role= "医生";
          break;
        case "1":
          this.role= "患者";
          break;
        case "2":
          this.role= "医院";
          break;
        default:
          this.role= "未知角色";
          
      }
      return this.role;
    },
  },
  mounted() {
    // 从 cookies 中获取用户角色和地址
    this.userRole = this.$cookies.get("role");
    this.address = this.$cookies.get("address");
    // 检查是否成功获取到信息
    if (!this.userRole || !this.address) {
      this.$message.error("获取账户信息失败，请重新登录。");
    }
  },
};
</script>

<style scoped>
.header {
  background-color: #409eff;
  color: #fff;
  line-height: 20px;
}
.content {
  font-size: 16px;
}
</style>