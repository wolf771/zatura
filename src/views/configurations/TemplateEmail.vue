<template>
<div class="row" v-loading="loading" element-loading-text="Guardando datos...">
  <div class="col-md-12">
      <div class="row">
          <div class="col-md-12">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">Plantillas para correos</h4>
              </div>
              <div class="card-body">
                <form @submit.prevent="updateTemplate()">
                <el-tabs tab-position="left" v-model="tab" @tab-click="changeTab">
                  <el-tab-pane v-for="t in templates" :key="t.id" :label="t.name">
                    <div class="form-group">
                      <label>Asunto</label>
                      <el-input v-model="template.subject"/>
                    </div>
                    <div class="form-group">
                      <label>Contenido</label>
                      <el-input rows="12" type="textarea" v-model="template.body"/>
                    </div>
                  </el-tab-pane>
                </el-tabs>

                <div class="col-md-12 text-center">
                  <vs-button type="gradient" button="submit" class="btn btn-lg btn-success">
                    <i class="fa fa-save"></i>
                    Guardar
                  </vs-button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
  </div>
</div>
</template>

<script>
import configurationService from '@/services/configurations.service';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'template-email',
  data() {
    return {
      templates: [],
      template: {
        subject: "",
        body: ""
      },
      tab: "",
      loading: true
    }
  },
  computed: {
  },
  methods: {
    updateTemplate() {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.loading = true
          this.template.company_id = this.$route.params.company_id;
          configurationService.updateTemplateEmail(this.template)
          .then(res => {
            /*this.$notify({
              title: res.data.message,
              type: 'success'
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'success'
            });
            this.loading = false
            //this.$router.push({name: 'companies'})
          })
          .catch(error => {
            /*this.$notify({
              title: error.message,
              type: 'error'
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error'
            });
            this.loading = false
          })
        } else {
          /*this.$notify({
              title: 'flatan datos',
              type: 'error'
            });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'flatan datos',
            type: 'error'
          });
            this.loading = false;
        }
      });  
    },
    getTemplatesEmail() {
      let company_id = this.$route.params.company_id;
      configurationService.getTemplatesEmail(company_id)
      .then(res => {
        this.templates = res.data;
        this.template = this.templates[0]
        this.loading = false
      })
      .catch(error => {
        /*this.$notify({
          title: error.message,
          type: 'error'
        })*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: error.message,
          type: 'error'
        });
        this.loading = false
      });
    },
    changeTab(name) {
      this.template = this.templates.find((element, index) => {
        return index === parseInt(this.tab)
      })
    }
  },
  created() {
    this.getTemplatesEmail();
  }
}
</script>

<style scoped>
</style>
