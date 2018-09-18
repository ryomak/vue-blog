<template>
  <div class="component-item-list">
    <el-card
      v-for="item in currentItems"
      :key="item.frontmatter.title"
      shadow="hover"
      @click.native="handlerClick(item.frontmatter.link)">
      <div class="title">{{ item.frontmatter.title }}</div>
      <div class="card-content">
        <img v-if="item.frontmatter.img" :src="`/img/${item.frontmatter.img}`" class="image">
        <div class="description">
          {{ item.frontmatter.description }}
        </div>
      </div>
      <div class="date">
        <i class="el-icon-date"></i>
        {{ formarter(item.frontmatter.date) }}
      </div>
    </el-card>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page="currNum"
      @size-change="pageSize = arguments[0]"
      @current-change="currNum = arguments[0]">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currNum: 1,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50]
    }
  },
  computed: {
    items () {
      console.log(this.$site.pages)
      return this.$site.pages.filter(function(v){
        return v.frontmatter.show
      })
    },
    total () {
      return this.items.length || 0
    },
    currentItems () {
      const start = (this.currNum - 1) * this.pageSize
      return this.items.slice(start, start + this.pageSize)
    }
  },
  methods: {
    formarter (data) {
      return data.substring(0, 10)
    },
    handlerClick (link) {
      this.$router.push(this.$page.path+link+".html")
    }
  }
}
</script>

<style lang="scss">
.component-item-list {
  .el-card {
    margin: 10px;
    cursor: pointer;
    &:hover {
      .title {
        color: #409eff;
      }
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 8px;
    }
    .date {
      text-align: right;
    }
    .card-content {
      display: flex;
      .image {
        
        height: 140px;
        border-radius: 6px;
        margin: 10px 20px 0px 10px;
      }
      .description {
        flex: 1;
        margin-top: 10px;
      }
    }
  }
  
}
</style>