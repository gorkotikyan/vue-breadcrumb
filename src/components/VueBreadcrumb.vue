<template>
  <nav>
    <ul
      :class="ulClass"
      :style="ulStyle"
    >
      <template
        v-for="(crumb, i) in breadcrumbs"
      >
        <li
          :key="i"
          :class="i !== breadcrumbs.length - 1 ? crumbClass : activeCrumbClass"
          :style="i !== breadcrumbs.length - 1 ? crumbStyle : activeCrumbStyle"
        >
          <router-link
            v-if="crumb.to"
            :to="crumb.to"
          >
            <slot
              name="crumb"
              :crumb="crumb"
            >
              {{ crumb.name }}
            </slot>
          </router-link>
          <template
            v-else
          >
            <slot
              name="active-crumb"
              :crumb="crumb"
            >
              {{ crumb.name }}
            </slot>
          </template>
        </li>
        <li
          v-if="i !== breadcrumbs.length - 1 && !disableDelimiter"
          :key="i + 'delimiter'"
          :class="delimiterClass"
          :style="delimiterClass"
        >
          <slot name="delimiter">
            /
          </slot>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'VueBreadcrumb',
  props: {
    disableDelimiter: {
      type: Boolean,
      default: false,
    },
    delimiterClass: {
      type: String,
      default: null,
    },
    delimiterStyle: {
      type: String,
      default: null,
    },
    crumbClass: {
      type: String,
      default: null,
    },
    crumbStyle: {
      type: String,
      default: null,
    },
    activeCrumbClass: {
      type: String,
      default: null,
    },
    activeCrumbStyle: {
      type: String,
      default: null,
    },
    liStyle: {
      type: String,
      default: null,
    },
    liClass: {
      type: String,
      default: null,
    },
    ulStyle: {
      type: String,
      default: null,
    },
    ulClass: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      breadcrumbs: [],
      activePage: '',
    };
  },
  watch: {
    $route() {
      this.breadcrumbs = [];
      this.initBreadcrumb();
    },
  },
  mounted() {
    // Init gathering crumbs from router
    this.initBreadcrumb();
  },
  methods: {
    /**
     * Function gets breadcrumb object from current route meta and push it into `breadcrumbs` array
     * if it has `parent` property, it initiates recursive search in router tree
     * last step, it revers whole `breadcrumbs` array
     */
    initBreadcrumb() {
      const item = this.$route.meta.breadcrumb;
      // If current route doesn't have breadcrumb property return null
      if (!item) return;
      // Push crumb into `breadcrumb` array
      this.breadcrumbs.push({
        name: item.name,
        to: null,
      });
      // If current route breadcrumb has parent property initiate `selectParent` recursive function
      // with `parent` route name and whole router routes
      if (item.parent) {
        this.selectParent(item.parent, this.$router.options.routes);
      }
      // Reverse `breadcrumbs` array
      this.breadcrumbs.reverse();
    },
    /**
     * Recursive function which search through whole routes and finds the parent route and push it
     * into `breadcrumbs` array, if the found route also has `parent` property function searches
     * the `parent` route via the same logic
     * @param parentName {string} - Wanted parent name
     * @param routes {array} - Array of Vue Routes
     * @returns {null}
     */
    selectParent(parentName, routes) {
      // Look thorough the whole routes
      for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i];
        if (route.name === parentName) { // `parentName` route has been found
          const breadCrumb = {};
          // Get breadcrumb name from `route.meta`
          breadCrumb.name = route.meta.breadcrumb.name;
          // Init `identifyParameterKey` in order to get param name from `router.path`
          const paramKey = this.identifyParameterKey(route.path);
          // If `paramKey` has found assign route to the `breadcrumb.to` property with params
          if (paramKey) {
            breadCrumb.to = {
              name: route.name,
              params: { paramKey: this.$route.params[paramKey] },
            };
          } else { // Else assign route to the `breadcrumb.to` property without params
            breadCrumb.to = { name: route.name };
          }
          // Push `breadCrumb` into `breadcrumbs` array
          this.breadcrumbs.push(breadCrumb);
          // if `route` also has parent property, restart function with current route `parent`
          if (route.meta.breadcrumb.parent) {
            return this.selectParent(route.meta.breadcrumb.parent, this.$router.options.routes);
          }
        } else if (route.children) { // if not found, execute the same function on it's children
          return this.selectParent(parentName, route.children);
        }
      }
    },
    /**
     * Function identifies if in URI has `param` and returns `param` otherwise return `null`
     * @param path {string} - URI of the router with `params` or not
     * @returns {null|string}
     */
    identifyParameterKey(path) {
      const paramStartIndex = path.indexOf('/:');
      if (paramStartIndex !== -1) return null;
      const paramEndIndex = path.indexOf('/', paramStartIndex + 1);
      return path.slice(paramStartIndex + 2, paramEndIndex);
    },
  },
};
</script>

<style scoped>
    ul {
        list-style: none;
        padding-top: 20px;
    }

    ul li {
        display: inline;
    }
</style>
