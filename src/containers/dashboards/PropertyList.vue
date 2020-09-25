<template>
  <b-card :title="title.concat(' ', propertyData.length)">
    <vuetable
      ref="vuetable"
      :api-mode="false"
      :data="propertyData"
      :fields="properties.fields"
      :per-page="6"
      pagination-path
      @vuetable:pagination-data="onPaginationData"
    ></vuetable>
    <vuetable-pagination-bootstrap
      ref="pagination"
      @vuetable-pagination:change-page="onChangePage"
    />
  </b-card>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../components/Common/VuetablePaginationBootstrap";

export default {
  props: ["title", "propertyData"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap
  },
  data() {
    return {
      properties: {
        fields: [
          {
            name: "type",
            sortField: "type",
            title: "Type",
            titleClass: "",
            dataClass: "list-item-heading"
          },
          {
            name: "bedrooms",
            sortField: "bedrooms",
            title: "Beds",
            titleClass: "",
            dataClass: "text-muted"
          },
          {
            name: "bathrooms",
            sortField: "bathrooms",
            title: "Bathrooms",
            titleClass: "",
            dataClass: "text-muted"
          },
          {
            name: "price",
            sortField: "price",
            title: "Price",
            titleClass: "",
            dataClass: "text-muted"
          }
        ]
      }
    };
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    }
  }
};
</script>
