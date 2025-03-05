<template>
  <div class="content-component">
    <div style="position:relative">
      <div style="position:relative">
        <input
          @keyup.enter="search()"
          style="width: 100%;border-radius:100px"
          type="text"
          v-model.trim="search_string"
          placeholder="Buscar"
        />
        <div>
          <span class="search-button text-primary" @click="search()">
            <i class="fa fa-search icon-searchh"></i>
          </span>

          <span @click="toggleOptions()" class="options">
            <i class="fa fa-sliders-h text-primary" v-if="options.length"></i>
          </span>
        </div>
      </div>
    </div>

    <div :class="['list-options', { show: showList }]">
      <ul>
        <li v-for="(opt, i) in options" :key="i">
          <label :for="i">
            <input
              :id="i"
              type="checkbox"
              :value="opt.value"
              v-model="checkedOptions"
            />
            {{ opt.label }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "search-filter",
  props: {
    options: {
      type: Array,
      default: () => [
        { label: "Aceptado", value: "aceptado" },
        { label: "Rechazado", value: "rechazado" }
      ]
    },
    checkedDefault: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkedOptions: [],
      showList: false,
      search_string: ""
    };
  },
  methods: {
    toggleOptions() {
      this.showList = !this.showList;
    },
    search() {
      let options =
        this.checkedOptions.length > 0
          ? this.checkedOptions.join(",")
          : this.checkedDefault.join(",");
      let search = {
        term: this.search_string,
        options: options
      };
      this.showList = false;
      this.$emit("executeSearch", search);
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.showList = false;
      }
    }
  },
  computed: {},
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>

<style scoped>
.content-component {
  position: relative;
  display: inline-block;
}

.options {
  font-size: 16px;
  padding: 8px;
  cursor: pointer;
  position: absolute;
  top: 3px;
  right: 40px;
}

.search-button {
  position: absolute;
  top: -2px;
  bottom: 0;
  right: 2px;
  color: white;
  padding: 5px 5px;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
  font-size: 18px;
}

.search-button:hover {
  color: rgb(48, 0, 48) !important;
}

.options:hover {
  color: rgb(48, 0, 48) !important;
}

.list-options {
  border: 1px solid rgb(240, 235, 235);
  padding: 5px;
  position: absolute;
  z-index: 1000;
  background: white;
  right: 0;
  left: 0;
  border-radius: 2px;
  display: none;
}

.list-options ul {
  list-style: none;
}

.list-options ul li {
  padding: 5px;
  display: flex;
  text-transform: capitalize;
}

input[type="text"] {
  border: 1px solid rgb(211, 218, 217);
  font-size: 16px;
  border-radius: 5px;
  padding: 8px;
  padding-right: 30px;
}

input[type="checkbox"] {
  font-size: 18px;
  margin-right: 10px;
}

.icon-searchh {
  padding: 8px 5px;
}

.show {
  display: block !important;
}
</style>
