<template>
  <vs-popup
    title="Enviar recordatorio de pago"
    :active.sync="show"
  >
    <form
      v-loading="loading"
      element-loading-text="Enviando recordatorio de pago, por favor espere..."
      @submit.prevent="sendRememberPaymentInvoice()"
      data-vv-scope="remember-payment"
    >
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label>Email</label>
                <el-input
                  v-model="email.email"
                  name="email"
                  v-validate="'required'"
                ></el-input>
                <label v-show="errors.has('new-email.email')" class="error">
                  {{ errors.first("new-email.email") }}
                </label>
              </div>

              <div class="form-group">
                <label>Asunto</label>
                <el-input
                  v-model="email.subject"
                  name="subject"
                  v-validate="'required'"
                ></el-input>
                <label v-show="errors.has('new-email.subject')" class="error">
                  {{ errors.first("new-email.subject") }}
                </label>
              </div>

              <div class="form-group">
                <label>Contenido</label>
                <ckeditor
                  name="body"
                  v-validate="'required'"
                  :editor="editor"
                  v-model="email.body"
                  :config="editorConfig"
                ></ckeditor>
                <label v-show="errors.has('new-email.body')" class="error">
                  {{ errors.first("new-email.body") }}
                </label>
              </div>
            </div>
          </div>

          <div class="text-center mt-30">
            <vs-button button="submit" type="gradient">
              Enviar
            </vs-button>
          </div>
        </div>
      </div>
      
    </form>
  </vs-popup>
</template>

<script>
import emailsService from "@/services/emails.service";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { mapState } from "vuex";

export default {
  name: "payment-remember-modal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataEmail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      type_template_email: "remember_payment",
      email: {
        email: "",
        subject: "Recordatorio de pago",
        body: ""
      },
      editorConfig: {
        toolbar: [
          "Heading",
          "undo",
          "redo",
          "|",
          "bold",
          "italic",
          "bulletedList",
          "numberedList"
        ],
        language: "es"
      },
      editor: ClassicEditor,
      loading: false
    };
  },
  methods: {
    close() {
      this.$emit("closeModal", false);
      this.resetDataForm();
    },
    resetDataForm() {
      Object.assign(this.$data.email, this.$options.data().email);
      this.$validator.reset();
    },
    sendRememberPaymentInvoice(scope) {
      this.$validator.validateAll(scope).then(valid => {
        if (valid) {
          this.loading = true;
          emailsService
            .sendRememberPaymentInvoice(this.email)
            .then(res => {
              this.$message({
                showClose: true,
                message: "El recordatorio de pago se envio correctamente",
                type: "success",
                duration: 1500
              });
              this.$emit("closeModal");
              this.loading = false;
              this.resetDataForm();
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: error.message,
                type: "error"
              });
              this.loading = false;
            });
        } else {
          this.$message({
            showClose: true,
            message: "invalido",
            type: "error"
          });
          this.loading = false;
        }
      });
    }
  },
  computed: {
    ...mapState(["templates_email", "company_default"])
  },
  watch: {
    dataEmail(newData) {
      let templates = JSON.parse(JSON.stringify(this.templates_email));

      let template = templates.find(i => {
        return i.type === this.type_template_email;
      });

      template.body = template.body.replace(
        "{client_name}",
        newData.item.client.name
      );
      template.body = template.body.replace(
        "{reference}",
        newData.item.reference
      );
      template.body = template.body.replace(
        "{expiration_date}",
        this.$options.filters.moment(newData.item.expiration_date, "DD-MM-YYYY")
      );

      this.email.email = newData.item.client.email;
      this.email.subject = template.subject;
      this.email.body = template.body;
      this.email.client_id = newData.item.client.id;
      this.email.invoice_id = newData.item.id;
    },
    show(newVal) {
      if (!newVal) {
        this.close()
      }
    },
    visible(newVal) {
      this.show = newVal
    }
  },
  mounted() {
    this.$store.dispatch("getTemplatesEmail");
  },
  components: {
    ckeditor: CKEditor.component
  }
};
</script>

<style scoped>
  .con-vs-popup .vs-popup {
    width: 500px !important;
  }
</style>
