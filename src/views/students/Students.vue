<template>
  <div class="content">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <!-- <h4 class="font-weight-bold text-primary">Lista de estudiantes</h4> -->
              <registers-per-page
                @changeNumPerPage="changeNumPerPage"
              ></registers-per-page>
              <search-filter
                @executeSearch="search"
                :options="[]"
              ></search-filter>
            </div>
            <vs-button @click="newStudent()">
              <i class="fa fa-user-plus"></i>
              Nuevo Estudiante
            </vs-button>
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Nombre</vs-th>
                <vs-th>Apellido</vs-th>
                <vs-th>Representante</vs-th>
                <vs-th>Email</vs-th>
                <vs-th>Identificación</vs-th>
                <vs-th>Teléfono</vs-th>
                <vs-th>Balance</vs-th>
                <vs-th>Status</vs-th>
                <vs-th>Acciones</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="indextr"
                    v-for="(item, indextr) in data"
                  >
                    <vs-td>{{ indextr + 1 }}</vs-td>
                    <vs-td>{{ item.name | truncateText(0, 25) }}</vs-td>
                    <vs-td>{{ item.surname | truncateText(0, 25) }}</vs-td>
                    <vs-td>
                      <router-link
                        :to="{
                          name: 'client-detail',
                          params: { id: item.client.id }
                        }"
                        class="btn btn-link"
                      >
                        {{ item.client.name | truncateText(0, 25) }}
                      </router-link>
                    </vs-td>
                    <vs-td>{{ item.client.email | truncateText(0, 25) }}</vs-td>
                    <vs-td>{{ item.client.identification }}</vs-td>
                    <vs-td>{{ item.client.phone }}</vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.client.balance"
                        :currency="current_currency.id"
                        :exchange_rate="1"
                      >
                      </calc-price>
                    </vs-td>
                    <vs-td>
                      <span
                        :class="[
                          'badge',
                          {
                            'badge-success': item.active,
                            'badge-warning': !item.active
                          }
                        ]"
                      >
                        {{ item.active ? "Activo" : "Inactivo" }}
                      </span>
                    </vs-td>
                    <vs-td class="text-center">
                      <el-dropdown @command="listAction">
                        <!-- <el-button type="primary" size="small"> -->

                        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                        <!-- </el-button> -->
                        <i class="fa fa-cogs text-primary"></i>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            class="text-info"
                            :command="{
                              command: 'edit',
                              payload: { id: item.id }
                            }"
                          >
                            <i class="fa fa-edit"></i>
                            Editar
                          </el-dropdown-item>

                          <el-dropdown-item
                            :class="[
                              {
                                'text-success': !item.active,
                                'text-warning': item.active
                              }
                            ]"
                            :command="{
                              command: 'status',
                              payload: { id: item.id, active: item.active }
                            }"
                          >
                            <i
                              :class="{
                                'fas fa-user-check': !item.active,
                                'fas fa-user-slash': item.active
                              }"
                            ></i>
                            {{ !item.active ? "Activar" : "Desactivar" }}
                          </el-dropdown-item>
                          <el-dropdown-item
                            class="text-danger"
                            :command="{
                              command: 'delete',
                              payload: { id: item.id }
                            }"
                          >
                            <i class="fa fa-times"></i>
                            Eliminar
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>

            <div
              class="mt-4 text-center zatura-pagination"
              v-if="pageCount > 1"
            >
              <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
            </div>
          </div>

          <div class="col-md-12 text-center" v-if="items.length == 0">
            <p>No hay Estudiantes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- modal new student -->
    <vs-popup :active.sync="newStudentModal" title="Nuevo estudiante">
      <div
        class="col-md-12"
        v-loading="loading"
        element-loading-text="Guardando..."
      >
        <form @submit.prevent="storeStudent()">
          <div class="row">
            <div class="col-md-12">
              <div class="vx-card">
                <div class="card-body">
                  <div class="form-group">
                    <label>
                      <i class="fa fa-user-circle"></i>
                      Representante
                    </label>
                    <el-select
                      popper-class="el-select-float"
                      placeholder=""
                      no-data-text="No hay datos."
                      no-match-text="No hay resultados."
                      v-model="student.client"
                      value-key="id"
                      name="client"
                      v-validate="'required'"
                      filterable
                      class="form-control"
                    >
                      <el-option
                        v-for="client in clients"
                        :key="client.id"
                        :label="client.name"
                        :value="client"
                      >
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('client')" class="error">
                      {{ errors.first("client") }}
                    </label>
                  </div>

                  <text-input
                    name="name"
                    :label="'Nombre'"
                    v-validate="'required'"
                    :error="errors.first('name')"
                    v-model="student.name"
                    data-vv-as="Nombre"
                  >
                  </text-input>

                  <text-input
                    name="surname"
                    :label="'Apellido'"
                    v-validate="'required'"
                    :error="errors.first('surname')"
                    v-model="student.surname"
                    data-vv-as="Apellido"
                  >
                  </text-input>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 text-right pt-4">
            <vs-button type="filled" button="submit">
              <i class="fa fa-save"></i>
              Guardar
            </vs-button>
          </div>
        </form>
      </div>
    </vs-popup>
    <!-- end modal new student -->

    <!-- modal edit student -->
    <vs-popup :active.sync="editStudentModal" title="Editar estudiante">
      <div
        class="col-md-12"
        v-loading="loading"
        element-loading-text="Guardando..."
      >
        <form @submit.prevent="updateStudent()">
          <div class="row">
            <div class="col-md-12">
              <div class="vx-card">
                <div class="card-body">
                  <div class="form-group">
                    <label>
                      <i class="fa fa-user-circle"></i>
                      Representante
                    </label>
                    <el-select
                      popper-class="el-select-float"
                      placeholder=""
                      no-data-text="No hay datos."
                      no-match-text="No hay resultados."
                      v-model="student.client"
                      value-key="id"
                      name="client"
                      v-validate="'required'"
                      filterable
                      class="form-control"
                    >
                      <el-option
                        v-for="client in clients"
                        :key="client.id"
                        :label="client.name"
                        :value="client"
                      >
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('client')" class="error">
                      {{ errors.first("client") }}
                    </label>
                  </div>

                  <text-input
                    name="name"
                    :label="'Nombre'"
                    v-validate="'required'"
                    :error="errors.first('name')"
                    v-model="student.name"
                    data-vv-as="Nombre"
                  >
                  </text-input>

                  <text-input
                    name="surname"
                    :label="'Apellido'"
                    v-validate="'required'"
                    :error="errors.first('surname')"
                    v-model="student.surname"
                    data-vv-as="Apellido"
                  >
                  </text-input>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 text-right pt-4">
            <vs-button type="filled" button="submit">
              <i class="fa fa-save"></i>
              Actualizar
            </vs-button>
          </div>
        </form>
      </div>
    </vs-popup>
    <!-- end modal edit student -->
  </div>
</template>

<script>
import studentsService from "@/services/students.service";
import clientsService from "@/services/clients.service";
import loading from "@/components/Loading.vue";
import CalcPrice from "@/components/CalcPrice.vue";
import { mapState } from "vuex";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import helpers from "@/helpers/helpers";
import Modal from "@/components/Modal.vue";

export default {
  name: "students",
  data() {
    return {
      items: [],
      loading: true,
      pageCount: 1,
      searchData: {},
      perPage: 10,
      page: 1,
      newStudentModal: false,
      editStudentModal: false,
      student: {
        name: "",
        surname: "",
        client: ""
      },
      clients: []
    };
  },
  computed: {
    ...mapState(["current_currency"])
  },
  methods: {
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getStudents(1, false, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getStudents(1, false, this.searchData);
    },
    getStudents(page = 1, generic, search) {
      this.loading = true;
      studentsService
        .getStudents(page, generic, search)
        .then(res => {
          this.items = res.data.data.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          if (error.response.status == 401) {
            // localStorage.clear();
          }
        });
    },
    resetForm() {
      let data_form_initial = this.$options.data().student;
      Object.assign(this.$data.student, data_form_initial);
      this.$validator.reset();
    },
    newStudent() {
      this.resetForm();
      this.newStudentModal = true;
    },
    storeStudent() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let data = this.student;
          this.loading = true;

          studentsService
            .storeStudent(data)
            .then(({ data }) => {
              this.loading = false;

              if (data.success) {
                this.$message({
                  showClose: true,
                  message: data.message,
                  type: "success"
                });

                this.getStudents(1, false, this.searchData);
              } else {
                this.$message({
                  showClose: true,
                  message: data.message,
                  type: "error"
                });
              }

              this.newStudentModal = false;
            })
            .catch(function(error) {
              this.loading = false;
              this.$message({
                showClose: true,
                message: error.message,
                type: "error"
              });
            });
        }
      });
      this.loading = false;
    },
    updateStudent() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let data = this.student;
          this.loading = true;

          studentsService
            .updateStudent(data)
            .then(({ data }) => {
              this.loading = false;
              this.editStudentModal = false;

              if (data.success) {
                this.$message({
                  showClose: true,
                  message: data.message,
                  type: "success"
                });

                let index = this.items.findIndex(i => i.id === this.student.id);
                this.items[index] = data.item;
              } else {
                this.$message({
                  showClose: true,
                  message: data.message,
                  type: "error"
                });
              }
            })
            .catch(function(error) {
              this.loading = false;
              this.$message({
                showClose: true,
                message: error.message,
                type: "error"
              });
            });
        }
      });
    },
    editStudent(student_id) {
      this.editStudentModal = true;
      let student = this.items.find(i => i.id === student_id);
      this.student = JSON.parse(JSON.stringify(student));
    },
    goPage(numPage) {
      this.getStudents(numPage, false, this.searchData);
    },
    listAction(command) {
      switch (command.command) {
        case "edit":
          this.resetForm();
          this.editStudent(command.payload.id);
          break;
        case "status":
          this.$confirm(
            "¿ Deseas cambiar el estatus del estudiante ?",
            "Cambiar estatus Estudiante",
            {
              confirmButtonText: "Si, continuar",
              cancelButtonText: "Cancelar",
              type: "warning",
              center: true
            }
          )
            .then(() => {
              this.loading = true;

              let index = this.items.findIndex(
                i => i.id === command.payload.id
              );

              studentsService
                .activeDeactiveStudent(command.payload.id)
                .then(res => {
                  this.loading = false;
                  this.items[index] = res.data.item;

                  this.$message({
                    type: "success",
                    message: res.data.message
                  });
                })
                .catch(() => {
                  this.loading = false;
                  this.$message({
                    type: "error",
                    message: "Ocurrio un problema"
                  });
                });
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                type: "info",
                message: "Acción cancelada"
              });
            });
          break;
        case "delete":
          this.$confirm(
            "¿ Deseas eliminar el estudiante ?",
            "Eliminar Estudiante",
            {
              confirmButtonText: "Si, continuar",
              cancelButtonText: "Cancelar",
              type: "warning",
              center: true
            }
          )
            .then(() => {
              this.loading = true;
              let index = this.items.findIndex(
                i => i.id === command.payload.id
              );
              studentsService
                .deleteStudent(command.payload.id)
                .then(() => {
                  this.loading = false;
                  this.items.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "Estudiante eliminado"
                  });
                })
                .catch(() => {
                  this.loading = false;
                  this.$message({
                    type: "error",
                    message: "Ocurrio un problema"
                  });
                });
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                type: "info",
                message: "Acción cancelada"
              });
            });
          break;
      }
    },
    getClients(page = 0) {
      //Incllude client generic
      clientsService
        .getClients(page, true)
        .then(res => {
          //No provider
          this.clients = res.data.filter(i => i.provider === 0);
        })
        .catch(error => {});
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getStudents();
    this.getClients();
  },
  components: {
    loading,
    CalcPrice,
    SearchFilter,
    RegistersPerPage,
    Modal
  }
};
</script>

<style scope>
.box-shadow {
  box-shadow: 0 0 2px rgb(136, 124, 124) !important;
}

.oculto {
  display: none;
}
</style>
