<template>
  <el-card :body-style="{ padding: '15px' }" class="card">
    <img :src="goodsData.imgs && goodsData.imgs.length ? baseURL + goodsData.imgs[0].url : ''"
         :onerror="this.src = baseURL + 'img/加载失败.png'"
         class="image"
         @click="showDetail(goodsData.productId)" alt="">
    <div style="padding: 14px; text-align: left">
      <p style="height: 30px">{{goodsData.productName ? goodsData.productName : '加载失败'}}</p>
      <p class="description">{{ goodsData.content }}</p>
      <div class="bottom clearfix">
        <span class="price">￥{{ goodsData.skus && goodsData.skus.length ? goodsData.skus[0].sellPrice : '加载失败' }}</span>
        <el-button type="text" @click="showDetail(goodsData.productId)">查看详情</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Card",
  props: ['data'],
  data() {
    return {
      baseURL: this.$imgBaseUrl,
      goodsData: {},
    }
  },
  methods: {
    showDetail(id) {
      this.$router.push('/goods/' + id);
    }
  },
  mounted() {
    this.goodsData = this.data;
  }
}
</script>

<style scoped>
.card {
  margin: 10px;
  border-radius: 10px;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}

.bottom button {
  float: right;
  font-size: 18px;
}

.price {
  font-size: 27px;
  font-weight: bold;
  color: red;
}

.image {
  width: 100%;
  border-radius: 10px;
  height: 200px;
  display: block;
}

.description {
  font-size: 16px;
  color: #888;
  text-align: left;
  height: 70px;
  overflow-y: scroll
}

.description::-webkit-scrollbar {
  display: none
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>