<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Navigator></Navigator>
        </el-aside>
        <el-main style="padding-top:10px">
          <el-col :span="20" :offset="1">
            <el-table border :data="receiptList" class="content">
              <el-table-column align="center" prop="id" label="ID" min-width="5%"></el-table-column>
              <el-table-column prop="doctoraddress" label="医生地址" min-width="30%"></el-table-column>
              <el-table-column prop="patientaddress" label="患者地址" min-width="30%"></el-table-column>
              <el-table-column prop="recordhash" label="详情哈希" min-width="30%"></el-table-column>
              <el-table-column align="center" prop="details" label="病历详情" min-width="10%">
                <template #default="scope">
                  <el-button type="text" @click="fetchDetail(scope.row)">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" label="签字确认" min-width="10%">
                <template #default="scope">
                  <el-button
                    
                    type="primary"
                    @click="signRecord(scope.row.recordId)"
                  >签字</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[3, 5, 7]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
          </el-col>
        </el-main>
      </el-container>
    </el-container>

    <!-- 查看详情对话框 -->
    <el-dialog :visible.sync="detailDialogVisible" title="病历详情">
      <template >
        <el-form :model="detailInfo" label-width="100px">
          <el-form-item label="病历编号">
            <el-input v-model="detailInfo.recordId" disabled></el-input>
          </el-form-item>
          <el-form-item label="医生地址">
            <el-input v-model="detailInfo.doctoraddress" disabled></el-input>
          </el-form-item>
          <el-form-item label="患者地址">
            <el-input v-model="detailInfo.patientaddress" disabled></el-input>
          </el-form-item>
          <el-form-item label="详情哈希">
            <div class="input-button-container">
              <el-input v-model="detailInfo.recordhash" disabled></el-input>

              <el-button
                type="primary"
                @click="downloadFile(detailInfo.recordhash)"
                >下载文件</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="医生是否签字">
            <el-input v-model="detailInfo.docsign" disabled></el-input>
          </el-form-item>
          <el-form-item label="患者是否签字">
            <el-input v-model="detailInfo.usersign" disabled></el-input>
          </el-form-item>
          <el-form-item label="医院是否签字">
            <el-input v-model="detailInfo.hospitalsign" disabled></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Navigator from "@/components/Navigator";
import Header from '@/components/Header';

export default {
  name: "Home",
  data() {
    return {
      receiptList: [],
      detailDialogVisible: false,
      detailInfo: {
        recordId: "",
        doctoraddress: "",
        patientaddress: "",
        recordhash: "",
        docsign: "",
        usersign: "",
        hospitalsign: "",
      },
      userRole: '',
      userAddress: '',
      // 分页相关数据
      currentPage: 1,
      pageSize: 5,
      total: 0
    };
  },
  components: {
    Navigator,
    Header
  },
  methods: {
    query() {
      const address = this.$cookies.get('address');
      let data = {
        address: address,
        page: this.currentPage,
        size: this.pageSize
      }
      let hospitalData = {
        page: this.currentPage,
        size: this.pageSize
      }
      let apiUrl = '';
      if (this.userRole === "1") {
        apiUrl = '/record/getUserPageFalse';
        this.axios.post(apiUrl, data)
        .then((response) => {
          this.receiptList = response.data.list;
          this.total = response.data.total;
        })
        .catch((error) => {
          this.$message.error(`网络错误: ${error.message}`);
        });
      }else if(this.userRole === "0"){
        apiUrl = '/record/getUserPageFalse';
        this.axios.post(apiUrl, data)
        .then((response) => {
          this.receiptList = response.data.list;
          this.total = response.data.total;
        })
        .catch((error) => {
          this.$message.error(`网络错误: ${error.message}`);
        });
      }else if (this.userRole === "2") {
        // 医院查看全部未确认病历
        apiUrl = '/record/getHPPageFalse';
        this.axios.post(apiUrl, hospitalData)
        .then((response) => {
          this.receiptList = response.data.list;
          this.total = response.data.total;
        })
        .catch((error) => {
          this.$message.error(`网络错误: ${error.message}`);
        });
      }

    
    },
    
    canSign(row) {
      if (this.userRole === "1") {
        return row.patientAddress === this.userAddress && row.patientSigned === 'false';
      } else if (this.userRole === "0") {
        return row.doctorAddress === this.userAddress && row.doctorSigned === 'false';
      } else if (this.userRole === "2") {
        return row.hospitalSigned === 'false';
      }
      return false;
    },
    signRecord(id) {
      let signData = {
        id: id,
        address: this.userAddress
      }
      this.axios.post('/record/sign', signData)
      .then((response) => {
        if (response.data.code === 200) {
          this.$message.success('签字成功');
          this.query(); // 重新查询病历列表
        } else {
          this.$message.error(`签字失败: ${response.data.data}`);
        }
      })
      .catch((error) => {
        this.$message.error(`网络错误: ${error.message}`);
      });
    },
    fetchDetail(row) {
      this.detailDialogVisible = true;
      this.detailInfo = { ...row };
    },
    downloadFile(recordhash) {
      const url = `http://127.0.0.1:8090/ipfs/${recordhash}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", recordhash);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  mounted() {
    this.userRole = this.$cookies.get('role');
    this.userAddress = this.$cookies.get('address');
    this.query();
  },
  created() {
    console.log("******* in home ******");
    console.log(this.$cookies.get("token"));
    console.log(this.$cookies.get("address"));
  }
};
</script>

<style>
.header {
  background-color: #409EFF;
  color: #fff;
  line-height: 20px;
}
.content {
  font-size: 16px;
}
</style>