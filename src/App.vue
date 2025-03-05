<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import themeConfig from "@/../themeConfig.js";
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["company_default"])
  },
  watch: {
    "$store.state.theme"(val) {
      this.toggleClassInBody(val);
    }
  },
  created() {
    let token = localStorage.getItem("token");
    if (token) {
      this.getUser({}).then(res => {
        let currency = JSON.parse(
          res.company_default.general_configurations.currency
        );
        this.$CurrencyFilter.setConfig({
          symbol: currency.symbol,
          thousandsSeparator: ".",
          fractionCount: 2,
          fractionSeparator: ",",
          symbolPosition: "front",
          symbolSpacing: false
        });

        this.$store.commit("updateCompanyDefault", {
          company_default: res.company_default
        });
        localStorage.removeItem("company_default");
        localStorage.setItem(
          "company_default",
          JSON.stringify(res.company_default)
        );

        localStorage.setItem("user", JSON.stringify(res));

        this.$store.commit("updateGeneralConfigurations", {
          general_configurations: res.company_default.general_configurations
        });
        this.$store.commit("updateCurrentCurrency", {
          current_currency: currency
        });
        this.$store.commit("updateUser", { user: res });
      });
    }
  },
  methods: {
    ...mapActions(["getUser"]),
    toggleClassInBody(className) {
      if (className == "dark") {
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className == "semi-dark") {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
      }
    }
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme);
  }
};
</script>

<!--estilos de las nuevas tablas-->
<style lang="scss">
//Table with divs
.rTable {
  display: block;
  width: 100%;
}
.rTableHeading,
.rTableBody,
.rTableFoot,
.rTableRow {
  clear: both;
}
.rTableHead,
.rTableFoot {
  background-color: rgb(233, 233, 233);
  font-weight: bold;
  display: flex;
  align-items: center;
}
.rTableCell,
.rTableHead {
  float: left;
  height: 75px;
  overflow: hidden;
  padding: 5px 10px;
}

.rTableHead {
  height: 40px;
}

.rTable:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.table_economic_activity {
  width: 8%;
}

.table_cabys_code_ac {
  width: 8%;
}

.table_cabys_code {
  width: 16%;
}

.table_name {
  width: 18%;
}
.table_quantity {
  width: 15%;
}
.table_amount {
  width: 15%;
}
.table_discount {
  width: 10%;
}
.table_tax {
  width: 10%;
}
.table_total {
  width: 15%;
}

#data-list-list-view {
  .vs-con-table {
    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 10px;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 10px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>

<style>
@import "~vue-snotify/styles/material.css";

.el-select-float {
  z-index: 60000 !important;
}

.zatura-pagination .vs-row > :first-child {
  display: none !important;
}

.zatura-pagination .vs-row > :last-child {
  justify-content: center !important;
}

.zatura-pagination .vs-row {
  justify-content: center !important;
}

.vs-popup--header .vs-icon {
  background: #cd1b1b !important;
  color: #fff;
  font-size: bold;
}

/*para quitar padding y border de los card que esten dentro de los modales*/
.con-vs-popup .vs-popup--content {
  padding: 0 !important;
}
.con-vs-popup .vs-popup--content .card {
  border: none !important;
}
.vs-popup--header {
  background-color: #10163a !important;
  border-radius: 5px 5px 0 0 !important;
}
.vs-popup--header .vs-popup--title h3 {
  color: #fff !important;
}

.customizer-btn {
  top: 80% !important;
}

.el-notification.right {
  margin-left: auto !important;
  margin-right: auto !important;
  left: 0 !important;
  right: 0 !important;
}

/* tables in mode dark */
body.theme-dark table {
  color: white;
}

body.theme-dark table tr td a {
  color: white;
}

body.theme-dark table tr:hover {
  background: black;
  color: white;
}

body.theme-dark .bg-white {
  background: #10163a !important;
}

body.theme-dark .nav-bar-title {
  color: white !important;
}
body.theme-dark .el-tabs__item {
  color: white !important;
}
/* end theme dark */

.separator-horizontal {
  margin: 0;
  border-bottom: 2px solid rgb(226, 218, 218);
  width: 100%;
}

.el-select.form-control {
  margin-bottom: 1em;
}
.p-t-20 {
  padding-top: 20px;
}
.el-input-number {
  width: 110px !important;
}

.error {
  color: #f44336;
}

.el-dropdown-menu__item {
  font-weight: bold;
}
.el-dropdown-menu__item i {
  margin-right: 5px;
}

/*Sobre escribiendo element ui para que salga bien el placeholder*/
.el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  height: auto !important;
}

.card {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
}

.form-control {
  border: none !important;
  background: none;
}

/* Estilos paginador */
.pagination li:last-child {
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 20px;
}

.pagination li:first-child {
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 20px;
}

.pagination .page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 2px;
  color: white;
  width: 40px;
  height: 40px;
}

.pagination .page-link a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
}

/* Estilo table */
.table {
  font-size: 13px;
  margin-top: 8px;
}

.table tr td:last-child {
  text-align: center;
}

.table tr td a {
  color: black;
}

.table tr td a:hover {
  color: blue;
}

.table thead tr td {
  color: black;
}

.separator-horizontal {
  margin: 1em;
  padding: 1em;
  font-weight: bold;
}

.vs-navbar,
.vx-navbar {
  z-index: 1 !important;
}

.router-view {
  padding: 10px !important;
}

.el-select {
  padding: 0;
  margin: 0;
}

.card-title {
  margin: 0 !important;
  font-weight: bold;
}

@media screen and (max-width: 600px) {
  .router-view {
    padding: 1px !important;
  }
  .col,
  .col-1,
  .col-10,
  .col-11,
  .col-12,
  .col-2,
  .col-3,
  .col-4,
  .col-5,
  .col-6,
  .col-7,
  .col-8,
  .col-9,
  .col-auto,
  .col-lg,
  .col-lg-1,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-auto,
  .col-md,
  .col-md-1,
  .col-md-10,
  .col-md-11,
  .col-md-12,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-auto,
  .col-sm,
  .col-sm-1,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-auto,
  .col-xl,
  .col-xl-1,
  .col-xl-10,
  .col-xl-11,
  .col-xl-12,
  .col-xl-2,
  .col-xl-3,
  .col-xl-4,
  .col-xl-5,
  .col-xl-6,
  .col-xl-7,
  .col-xl-8,
  .col-xl-9,
  .col-xl-auto {
    padding: 5px;
  }
}
</style>
