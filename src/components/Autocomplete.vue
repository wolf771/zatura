<template>
  <div class="container-autocomplete">
    <input :value="value" @input="onChange($event.target.value)" />

    <ul :class="{ show: showList }">
      <li
        v-for="(item, i) in results"
        :key="i"
        @click="selectItem(item)"
        :class="{ selected: itemSelected === item.id }"
        :value="value"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "autocomplete",
  props: {
    items: {
      type: Array,
      required: true,
      default: []
    },
    index: {
      type: Number
    },
    value: {
      type: String
    },
    selected: {
      type: Number
    }
  },
  data() {
    return {
      show: false,
      itemSelected: false,
      results: []
    };
  },
  computed: {
    showList() {
      return this.show;
    },
    search() {
      return this.value;
    }
  },
  methods: {
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.show = false;
      }
    },
    displayList() {
      if (this.search && !this.results.length) return;
      this.show = true;
    },
    hideList() {
      this.show = false;
    },
    onChange(val) {
      if (val !== "") {
        this.results = this.items.filter(item => {
          return (
            item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            item.code.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        });
      } else {
        this.results = this.items;
      }

      if (!this.results.length) {
        this.hideList();
      } else {
        this.displayList();
      }
      this.$emit("input", val);
    },
    selectItem(item) {
      this.hideList();

      if (this.selected === item.id) {
        this.$emit("input", item.name);
        return;
      }

      this.$emit("input", "");

      this.itemSelected = item.id;
      this.$emit("selectItem", item, this.index);
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>

<style scoped>
.container-autocomplete {
  position: absolute;
  width: 17%;
}
.container-autocomplete ul {
  position: absolute;
  background-color: white;
  left: 0;
  right: 0;
  z-index: 1000 !important;
  list-style: none;
  box-shadow: 0 0 5px #dcdfe6;
  border-radius: 4px;
  margin: 0;
  padding: 10px;
  display: none;
  height: 300px;
  overflow-y: scroll;
}
.container-autocomplete ul li {
  padding: 3px 0;
  margin: 0;
  cursor: pointer;
}
.container-autocomplete ul li:hover {
  background-color: rgb(233, 239, 240);
}

.show {
  display: block !important;
}

.selected {
  color: rgb(0, 155, 216);
  font-weight: bold;
}

input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0px 15px;
  color: #606266;
  height: 40px;
  outline: 0;
  line-height: 40px;
  width: 100%;
}
</style>
