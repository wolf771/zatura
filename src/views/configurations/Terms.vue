<template>
<div class="row" v-loading="loading" element-loading-text="Guardando datos...">
  <div class="col-md-12">
      <div class="row">
          <div class="col-md-12">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">Terminos y condiciones</h4>
              </div>

              <div class="card-body">
                <form @submit.prevent="updateTerm()">
                <el-tabs tab-position="left" v-model="tab" @tab-click="changeTab">
                  <el-tab-pane v-for="t in terms" :key="t.id" :label="t.name">
                    <div class="form-group">
                      <label>Contenido</label>
                      <el-input rows="12" type="textarea" v-model="term.body"/>
                    </div>
                  </el-tab-pane>
                </el-tabs>

                <div class="col-md-12 text-center">
                  <vs-button type="gradient" button="submit">
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
  name: 'terms',
  data() {
    return {
      terms: [],
      term: {
        body: ""
      },
      tab: "",
      loading: true
    }
  },
  computed: {
  },
  methods: {
    updateTerm() {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.loading = true;
          this.term.company_id = this.$route.params.company_id;
          configurationService.updateTerm(this.term)
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
            this.loading = false;
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
            this.loading = false;
          })
        } else {
          /*this.$notify({
              title: 'faltan datos',
              type: 'error'
            });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'faltan datos',
            type: 'error'
          });
            this.loading = false;
        }
      });  
    },
    getTerms() {
      let company_id = this.$route.params.company_id;
      configurationService.getTerms(company_id)
      .then(res => {
        this.terms = res.data;
        this.term = this.terms[0]
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
        this.loading = false;
      });
    },
    changeTab(name) {
      this.term = this.terms.find((element, index) => {
        return index === parseInt(this.tab)
      })
    }
  },
  created() {
    this.getTerms();
  }
}
</script>

<style scoped>
</style>
