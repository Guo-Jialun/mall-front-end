<template>
    <div style="margin-bottom: 100px">
      <el-carousel :interval="1500">
        <el-carousel-item v-for="item in this.indexImg" :key="item.imgId">
          <img :src="baseURL + item.imgUrl" style="width: 100%; height: 100%;" alt="" @click="showDetail(item.prodId)">
        </el-carousel-item>
      </el-carousel>
      <div v-for="(category, index) in this.categoryList" :key=index>
        <h2 class="category">
          {{ category }}
        </h2>
        <div class="categoryBlock">
          <el-row>
            <el-col :lg="6" :md="8" :sm="12" :xs="24" v-for="o in goodsData.get(category)" :key="o.productId">
              <Card :data="o"></Card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
</template>

<script>
import Card from "../components/Card";

export default {
  components: {Card},
  name: "DefaultResult",
  data() {
    return {
      baseURL: this.$imgBaseUrl,
      indexImg: null,
      goodsData: new Map,
      categoryList: [],
    }
  },
  methods: {
    showDetail(id) {
      this.$router.push('/goods/' + id);
    }
  },
  created() {
    this.$http
    .get('/index/indeximg')
    .then(res => {
      if (res.code === 10000) {
        this.indexImg = res.data;
      } else if (res.msg === 'fail') {
        this.$message.info('轮播图为空');
      } else {
        this.$message.error('未知错误');
      }
    })
    this.$http
        .get('/index/category-recommends')
        .then(res => {
          if (res.code === 10000) {
            this.categoryList = [];
            for (let item of res.data) {
              this.categoryList.push(item.categoryName);
              this.goodsData.set(item.categoryName, item.products);
            }
          } else {
            this.$message.error('未知错误');
          }
        });
  }
}
</script>

<style scoped>
.category {
  text-align: left;
}

.categoryBlock {
  padding: 20px;
  background-color: #eeeeee;
  border-radius: 20px;
}
</style>