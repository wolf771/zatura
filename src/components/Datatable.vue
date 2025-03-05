<template>
  <table class="table">
      <thead>
        <tr>
          <th v-for="(col, i) in columns" :key="i">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in data" :key="i">
          <td v-for="(col, i) in columns" :key="i">
            {{ resolveColumn(col.field, row) }}
          </td>
        </tr>
      </tbody>
  </table>    
</template>

<script>
export default {
  props: {
    columns: {
      required: true,
      default: []
    },
    data: {
      required: true,
      default: []
    }
  },
  name: 'datatable',
  methods: {
    resolveColumn(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}
  }
  
}
</script>

<style>

</style>
