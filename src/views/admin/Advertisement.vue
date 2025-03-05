<template>
  <div class="row">
    <div class="col-md-12">
      <form @submit.prevent="storeAdvertisement()">
        <div class="row">
          <div class="col-md-10 offset-md-1">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title d-flex justify-content-between align-items-center">
                  <div>Anuncio</div>
                  <div>
                    <vs-switch v-model="advertisement.active">
                      <span slot="on">Activado</span>
                      <span slot="off">Desactivado</span>
                    </vs-switch>
                  </div>
                </h4>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label>Título</label>
                  <el-input name="title" v-model="advertisement.title" v-validate="'required'"></el-input>
                  <label v-show="errors.has('title')" class="error">
                    {{ errors.first('title') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Contenido</label>
                  <quill-editor name="content" v-validate="'required'" v-model="advertisement.content"></quill-editor>
                  <label v-show="errors.has('content')" class="error">
                    {{ errors.first('content') }}
                  </label>
                </div>

                <div class="text-center mt-10">
                  <vs-button type="gradient" button="submit">
                    <i class="fa fa-save"></i>
                    Guardar
                  </vs-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import utilitiesService from '@/services/utilities.service'

export default {
  name: 'advertisement',
  components: {
    quillEditor
  },
  data() {
    return {
      advertisement: {
        id: "",
        title: "",
        content: "",
        code: "",
        type: "",
        active: 0
      }
    }
  },
  methods: {
    async storeAdvertisement() {
      try {
        let res = await utilitiesService.storeAdvertisement(this.advertisement)
        if(res.data.success) {
          /*this.$notify({
            title: "Anuncio actualizado correctamente",
            type: "success"
          })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'Anuncio actualizado correctamente',
            type: 'success'
          });
        }
      } catch(err) {
        /*this.$notify({
          type: "error",
          title: err
        })*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: err,
          type: 'error'
        });
      }
    },
    async getAdvertisement() {
      try {
        let res = await utilitiesService.getAdvertisementAdmin()
        this.advertisement = res.data
        this.advertisement.active = parseInt(this.advertisement.active)
      } catch(err) {
        /*this.$notify({
          type: "error",
          title: err
        })*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: err,
          type: 'error'
        });
      }
    }
  },
  created() {
    this.getAdvertisement()
  }
}
</script>

<style>

</style>
