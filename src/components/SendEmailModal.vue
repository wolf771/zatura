<template>
  <vs-popup title="Enviar factura por correo" :active.sync="show">
    <div class="card">
      <div class="card-body">
        <form v-loading="loading"  element-loading-text="Enviando email un momento por favor..." @submit.prevent="sendEmail('new-email')" data-vv-scope="new-email">
          <div class="row" >
            <div class="col-md-12">
              
              <div class="form-group">
                <label>Email</label>
                <el-input v-model="email.email" name="email" v-validate="'required'"></el-input>
                 <label v-show="errors.has('new-email.email')" class="error">
                  {{ errors.first('new-email.email') }}
                </label>
              </div>

              <div class="form-group">
                <label>Asunto</label>
                <el-input v-model="email.subject" name="subject" v-validate="'required'"></el-input>
                 <label v-show="errors.has('new-email.subject')" class="error">
                  {{ errors.first('new-email.subject') }}
                </label>
              </div>

              <div class="form-group">
                <label>Contenido</label>
                <ckeditor name="body" v-validate="'required'" :editor="editor" v-model="email.body" :config="editorConfig"></ckeditor>
                <!-- <el-input
                  type="textarea"
                  name="body"
                  v-validate="'required'"
                  :rows="2"
                  placeholder=""
                  v-model="email.body">
                </el-input> -->
                <label v-show="errors.has('new-email.body')" class="error">
                  {{ errors.first('new-email.body') }}
                </label>
              </div>

            </div>
          </div>
          
          <div class="text-center mt-30">
            <vs-button button="submit" type="gradient">
              Enviar
            </vs-button>
          </div>
        </form>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import emailsService from '@/services/emails.service';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  props:{
    vis: {
      type: Boolean,
      default: false
    },
    dataEmail: {
      type: Object,
      default: () => {}
    }
  },
  name: 'send-email-modal',
  data() {
    return {
      show: false,
      email: {
        email: "",
        subject: "",
        body: "",
        files: "",
        type: "",
        document: ""
      },
      editorConfig: {
        toolbar: ['Heading','undo', 'redo', '|', 'bold', 'italic', 'bulletedList', 'numberedList'],
        language: 'es'
      },
      editor: ClassicEditor,
      loading: false

    }
  },
  computed: {
    datos() {
      return this.dataEmail
    }
  },
  methods: {
    close() {
      this.$emit('closeModal', false);
      this.resetDataForm();
    },
    resetDataForm() {
      //Object.assign(this.$data.email, this.$options.data().email);
      this.$validator.reset();
    },
    sendEmail(scope) {
      this.$validator.validateAll(scope).then((valid) => {
        if(valid) {
          this.loading = true;
          emailsService.send(this.email)
          .then(res => {
            this.$emit('emailSent', res.data.item);
            /*this.$notify({
              title: 'Bien',
              message: 'El email se envio correctamente',
              type: 'success',
              duration: 1500
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'El email se envio correctamente',
              type: 'success',
              duration: 1500
            });
            this.loading = false;
            this.resetDataForm();
          })
          .catch(error => {
            /*this.$notify({
              title: error.message,
              type: 'error'
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error'
            });
            this.loading = false;
          });
        } else {
          /*this.$notify({
              title: 'invalido',
              type: 'error'
            });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'invalido',
            type: 'error'
          });
            this.loading = false;
        }
      });
      
    }
  },
  watch: {
    dataEmail (newData) {
      this.email.email = newData.email
      this.email.subject = newData.subject
      this.email.body = newData.body
      this.email.files = newData.files
      this.email.type = newData.type
      this.email.document = newData.document
    },
    show(newVal) {
      if (!newVal) {
        this.close()
      }
    },
    vis(newVal) {
      this.show = newVal
    }
  },
  components: {
    ckeditor: CKEditor.component
  }
}
</script>

<style scoped>
.el-input-number .el-input .el-input__inner {
  width: 100% !important; 
  background: red;
}
.el-date-editor {
  width: 100% !important;
}
.el-input__inner {
  display: block;
  width: 100% !important;
}
.mt-30 {
  margin-top: 30px
}
.con-vs-popup .vs-popup {
  width: 500px !important;
}
</style>
