<template>
  <el-row class="tac">
    <el-col :span="24">
    <el-menu
      style="height: 100%;" @select="handleSelect">
      <el-menu-item index="1"><h2>相关病历</h2></el-menu-item>
      <el-menu-item index="2"><h2>待确认</h2></el-menu-item>
      <el-menu-item index="3"><h2>已确认</h2></el-menu-item>
      <el-menu-item index="4"><h2>账户信息</h2></el-menu-item>
    </el-menu>
    </el-col>
  </el-row>
</template>
 
<script>
export default {
  name: "Navigator",
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      if (key == '1') {
        this.$router.push('/home')
      }
      if (key == '2') {
        this.$router.push('/toBeConfirmed')
      }
      if (key == '3') {
        this.$router.push('/confirmed')
      }
      if (key == '4') {
        this.$router.push('/individual')
      }

    },
  }
}
</script>

<style>

</style>