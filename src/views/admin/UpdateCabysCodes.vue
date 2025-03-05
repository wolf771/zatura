<template>
  <div class="row">
    <div class="col-md-12">
      <form @submit.prevent="updateCabysCodes()">
        <div class="row">
          <div class="col-md-10 offset-md-1">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">Actualizar codigos cabys</h4>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label>Excel con los codigos</label>
                  <el-upload
                    action="#"
                    :on-change="fileSelect"
                    v-model="config.excel_file"
                    name="excel_file"
                    class="upload-demo"
                    ref="excel_file"
                    :auto-upload="false"
                  >
                    <el-button slot="trigger" size="small" type="primary"
                      >Selecciona un archivo</el-button
                    >
                  </el-upload>
                  <label v-show="errors.has('excel_file')" class="error">
                    {{ errors.first("excel_file") }}
                  </label>
                </div>
              </div>
              <div class="col-md-12 text-center p-5">
                <button type="submit" class="btn btn-lg btn-success">
                  <i class="fa fa-upload"></i>
                  Subir y Procesar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import utilitiesService from "@/services/utilities.service";
export default {
  name: "update-cabys-codes",
  data: () => {
    return {
      config: {
        excel_file: ""
      }
    };
  },
  methods: {
    updateCabysCodes() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("excel_file", this.config.excel_file);
          utilitiesService
            .updateCabysCodes(formData)
            .then(res => {
              this.$message({
                showClose: true,
                message: res.message,
                type: "success"
              });
            })
            .catch(() => {
              alert("error");
            });
        } else {
          this.$message({
            showClose: true,
            message: "faltan datos",
            type: "error"
          });
        }
      });
    },
    fileSelect(file) {
      console.log(file);
      this.config.excel_file = file.raw;
    }
  }
};
</script>
