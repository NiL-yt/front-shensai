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
        <el-main style="padding-top: 10px">
          <el-row>
            <!-- 根据用户角色判断是否显示新增病历按钮 -->
            <el-button
              v-if="isDoctor"
              type="primary"
              size="default"
              @click="addRecord"
              icon="Plus"
              >新增病历</el-button
            >
            <el-col :span="20" :offset="1">
              <el-table border :data="receiptList" class="content">
                <el-table-column
                  align="center"
                  prop="id"
                  label="ID"
                  min-width="4%"
                ></el-table-column>
                <el-table-column
                  prop="doctoraddress"
                  label="医生地址"
                  min-width="30%"
                ></el-table-column>
                <el-table-column
                  prop="patientaddress"
                  label="患者地址"
                  min-width="30%"
                ></el-table-column>
                <el-table-column
                  prop="recordhash"
                  label="详情哈希"
                  min-width="37%"
                ></el-table-column>
                <el-table-column align="center" prop="details" label="病历详情" min-width="5%">
                  <template #default="scope">
                    <el-button type="text" @click="fetchDetail(scope.row)"
                      >查看</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页组件 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[3, 5, 7]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>

    <!-- 新增病历对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="新增病历">
      <template>
        <el-form :model="form" label-width="80px">
          <el-form-item label="患者地址">
            <el-input v-model="form.patientAddress"></el-input>
          </el-form-item>
          <el-form-item label="详情哈希">
            <el-upload
              class="upload-demo"
              ref="uploadRef"
              :action="uploadUrl"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
              :show-file-list="false"
              style="float: right"
            >
              <el-button type="primary">上传文件</el-button>
            </el-upload>
            <!-- 显示已选择的文件名 -->
            <span v-if="selectedFile" style="display: block; text-align: left"
              >已选择文件: {{ selectedFile.name }}</span
            >
            <!-- 提供重新选择文件的按钮 -->
            <el-button
              v-if="selectedFile"
              style="display: block; text-align: left"
              @click="clearSelectedFile"
              >删除文件</el-button
            >
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <!-- 根据用户角色判断是否禁用提交按钮 -->
          <el-button
            type="primary"
            @click="submitForm"
            :disabled="!isDoctor || !selectedFile"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog :visible.sync="detailDialogVisible" title="病历详情">
      <template>
        <el-form :model="detailInfo" label-width="100px">
          <el-form-item label="病历编号">
            <el-input v-model="detailInfo.id" disabled></el-input>
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
import Header from "@/components/Header";

export default {
  name: "Home",
  data() {
    return {
      receiptList: [],
      dialogVisible: false,
      detailDialogVisible: false,
      form: {
        patientAddress: "",
        recordHash: "",
      },
      detailInfo: {
        recordId: "",
        doctoraddress: "",
        patientaddress: "",
        recordhash: "",
        docsign: "",
        usersign: "",
        hospitalsign: "",
      },
      uploadUrl: "http://127.0.0.1:5001/api/v0/add", // IPFS 上传接口地址
      uploadedFileName: "",
      // 存储用户角色
      userRole: "",
      // 判断是否为医生
      isDoctor: false,
      // IPFS 文件的 URL
      ipfsFileUrl: "",
      // 分页相关数据
      currentPage: 1,
      pageSize: 5,
      total: 0,
      // 存储选择的文件
      selectedFile: null,
    };
  },
  components: {
    Navigator,
    Header,
  },
  methods: {
    query() {
      const address = this.$cookies.get("address");
      let data = {
        address: address,
        page: this.currentPage,
        size: this.pageSize,
      };
      let hospitalData = {
        page: this.currentPage,
        size: this.pageSize,
      };

      let apiUrl = "";
      if (this.userRole === "1" || this.userRole === "0") {
        apiUrl = "/record/getUserPage";
        this.axios
          .post(apiUrl, data)
          .then((response) => {
            console.log(response.data.list);
            this.receiptList = response.data.list;
            console.log(this.receiptList);
            this.total = response.data.total;
          })
          .catch((error) => {
            this.$message.error(`网络错误: ${error.message}`);
          });
      } else if (this.userRole === "2") {
        // 医院查看全部病历
        apiUrl = "/record/getHPPage";
        this.axios
          .post(apiUrl, hospitalData)
          .then((response) => {
            console.log(response.data);
            this.receiptList = response.data.list;
            this.total = response.data.total;
          })
          .catch((error) => {
            this.$message.error(`网络错误: ${error.message}`);
          });
      }
    },
    addRecord() {
      if (this.isDoctor) {
        this.dialogVisible = true;
      } else {
        this.$message.error("只有医生可以新增病历");
      }
    },
    beforeUpload(file) {
      const isAllowed = ["pdf", "doc", "docx"].includes(
        file.name.split(".").pop().toLowerCase()
      );
      if (!isAllowed) {
        this.$message.error("仅支持上传 PDF、DOC、DOCX 文件");
        return false;
      }
      // 阻止自动上传
      return false;
    },
    handleFileChange(file) {
      this.selectedFile = file.raw;
    },
    clearSelectedFile() {
      this.selectedFile = null;
      this.$refs.uploadRef.clearFiles();
    },
    submitForm() {
      if (!this.isDoctor) {
        this.$message.error("只有医生可以提交新增病历");
        return;
      }
      if (!this.selectedFile) {
        this.$message.error("请选择文件");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      this.axios
        .post(this.uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.Hash) {
            console.log(response.data.Hash);
            this.form.recordHash = response.data.Hash;

            // 从 cookies 中获取医生地址
            const doctorAddress = this.$cookies.get("address");
            console.log(doctorAddress);
            let addData = {
              patientAddress: this.form.patientAddress,
              hash: this.form.recordHash,
              doctorAddress: this.$cookies.get("address"),
            };
            this.axios
              .post("/record/add", addData)
              .then((response) => {
                console.log(addData);

                if (response.data.code === 200) {
                  this.$message.success("新增病历成功");
                  this.dialogVisible = false;
                  this.form = {
                    patientAddress: "",
                    recordHash: "",
                  };
                  this.selectedFile = null;
                  this.$refs.uploadRef.clearFiles();
                  this.query();
                } else {
                  this.$message.error(`病历新增失败: ${response.data.data}`);
                }
              })
              .catch((error) => {
                this.$message.error(`网络错误: ${error.message}`);
              });
          } else {
            this.$message.error("文件上传到 IPFS 失败");
          }
        })
        .catch((error) => {
          this.$message.error(`网络错误: ${error.message}`);
        });
    },
    fetchDetail(row) {
      this.detailDialogVisible = true;
      this.detailInfo = { ...row };
      this.ipfsFileUrl = `http://127.0.0.1:8090/ipfs/${row.recordhash}`;
    },
    downloadFile(recordhash) {
      console.log(recordhash);
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
    // 获取用户角色
    this.userRole = this.$cookies.get("role");
    // 判断是否为医生
    this.isDoctor = this.userRole === "0";
    this.query();
  },
  created() {
    console.log("******* in home ******");
    console.log(this.$cookies.get("role"));
    console.log(this.$cookies.get("address"));
  },
};
</script>

<style>
.header {
  background-color: #409eff;
  color: #fff;
  line-height: 20px;
}
.content {
  font-size: 16px;
}
.input-button-container {
  display: flex;
  align-items: center;
}
.input-button-container .el-input {
  flex: 1;
  margin-right: 10px; /* 可以根据需要调整输入框和按钮之间的间距 */
}
</style>
