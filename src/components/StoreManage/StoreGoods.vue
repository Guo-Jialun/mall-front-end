<template>
  <div style="position: relative; left: 250px; width: 84%;">
    <div v-if="storeStatus === 1">
      <h4 style="text-align: left;">商品管理</h4>
      <p style="font-size: 18px; margin-right: 30px">{{ this.storeName }}</p>
      <el-table :data="singlePageOrdersList"
                style="width: 100%; font-size: 16px; border-radius: 10px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);"
                border stripe empty-text="暂无数据">
        <el-table-column label="商品 ID" sortable prop="goodsId"></el-table-column>
        <el-table-column label="商品名称" sortable prop="name" width="200"></el-table-column>
        <el-table-column label="价格" sortable width="120" prop="sellPrice"></el-table-column>
        <el-table-column label="分类" sortable prop="category" width="150"></el-table-column>
        <el-table-column label="库存" sortable prop="stock" width="150"></el-table-column>
        <el-table-column label="图片" prop="img">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right-end" :close-delay=0>
              <img :src="baseURL + scope.row.img" alt="加载失败" style="width: 200px; height: 200px">
              <div slot="reference" class="name-wrapper" style="width: 70px">
                <el-tag size="medium">查看图片</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" width="500"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="success" round @click="modify(scope.row.goodsId)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteGoods(scope.row.goodsId)">
              <el-button style="margin-left: 15px" type="danger" round slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <br><br>
      <div style="display: inline-block; float: right">
        <el-button
            type="primary" round @click="add"
            style="float: left; margin-bottom: 20px">
          添加商品
        </el-button>
      </div>
      <div style="display: inline-block">
        <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            @current-change="currentChange"
            :page-size="pageSize"
            :total="totalOrders">
        </el-pagination>
      </div>
      <br>
      <el-dialog :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form :model="form" style="text-align: left">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="form.productName" autocomplete="off" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="商品类别" :label-width="formLabelWidth">
            <el-select v-model="form.categoryId" placeholder="请选择商品类别">
              <el-option v-for="item in this.categories.keys()"
                         :key="item"
                         :label="categories.get(item)"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品图片" :label-width="formLabelWidth">
            <el-upload
                style="width: 300px"
                class="upload-demo"
                ref="upload"
                action=""
                :before-upload="beforeUpload"
                :limit="1"
                list-type="picture"
                :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" @click="photoSelected = true">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">图片比例为1:1</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="售价" :label-width="formLabelWidth">
            <el-input v-model="form.price" autocomplete="off" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="库存" :label-width="formLabelWidth">
            <el-input v-model="form.stock" autocomplete="off" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" :label-width="formLabelWidth">
            <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入描述信息"
                v-model="form.content">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm1">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-else>
      <p style="margin-top: 38vh">您还没有店铺哦</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreGoods',
  data() {
    return {
      baseURL: this.$imgBaseUrl,
      storeId: null,
      storeName: '',
      storeStatus: null,
      tableData: [],
      selectedGoodsId: null,
      dialogFormVisible: false,
      dialogType: 0, //0为新增，1为编辑
      form: {
        productName: '',
        categoryId: '',
        productImg: '',
        price: null,
        stock: null,
        content: '',
      },
      photoSelected: false,
      categories: new Map,
      currentPage: 1,
      totalOrders: 0,
      pageSize: 8,
      singlePageOrdersList: [],
      formLabelWidth: '120px',
    }
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
      this.dialogType = 0
    },
    modify(goodsId) {
      this.selectedGoodsId = goodsId;
      this.dialogFormVisible = true;
      this.dialogType = 1;
      for (let i of this.tableData) {
        if (this.selectedGoodsId === i.goodsId) {
          this.form.productName = i.name;
          this.form.categoryId = i.categoryId;
          this.form.price = i.sellPrice;
          this.form.stock = i.stock;
          this.form.content = i.description;
          break;
        }
      }
    },
    deleteGoods(a) {
      this.$http
      .get('/shop/deleteproduct', {
        productId: a,
      })
      .then(res => {
        if (res.code === 10000) {
          this.getGoodsList();
          this.$message.success('删除成功')
        } else {
          this.$message.error('未知错误')
        }
      })
    },
    closeDialog() {
      this.form = {
        productName: '',
        categoryId: '',
        productImg: '',
        price: null,
        stock: null,
        content: '',
      }
    },
    submitForm1() {
      let obj = {
        productName: this.form.productName,
        categoryId: this.form.categoryId,
        rootCategoryId: 0,
        content: this.form.content,
        shopID: this.storeId,
        productStatus: 1,
        skus:
            [
              {
                sellPrice: this.form.price,
                stock: this.form.stock,
                status: 1,
              }
            ],
      };
      if (this.dialogType === 1) {
        obj.productId = this.selectedGoodsId;
      }
      this.$http
          .post(this.dialogType === 1 ? '/shop/updateproduct' : '/shop/addproduct', obj)
          .then(res => {
            if (res.code === 10000) {
              this.$message.success('操作成功');
              this.getGoodsList();
              this.selectedGoodsId = res.data;
              if (this.photoSelected) {
                this.$refs.upload.submit();
                this.photoSelected = false;
              }
            } else {
              this.$message.error('未知错误')
            }
          });

      this.dialogFormVisible = false;
    },
    getGoodsList() {
      this.$http
          .get('shop/list', {
            shopID: this.storeId,
          })
          .then(res => {
            if (res.code === 10000) {
              this.tableData = [];
              for (let item of res.data) {
                this.tableData.push({
                  goodsId: parseInt(item.productId),
                  name: item.productName,
                  sellPrice: item.skus && item.skus.length ? item.skus[0].sellPrice : null,
                  categoryId: item.categoryId,
                  category: this.categories.get(item.categoryId),
                  description: item.content,
                  img: item.imgs && item.imgs.length ? item.imgs[0].url : null,
                  stock: item.skus && item.skus.length ? item.skus[0].stock : null,
                });
              }
              this.totalOrders = this.tableData.length;
              this.currentChange(this.currentPage);
            } else {
              this.$message.error('获取店铺信息失败');
            }
          });
    },
    currentChange(pageNum) {
      this.currentPage = pageNum;
      let start = (pageNum - 1) * this.pageSize;
      this.singlePageOrdersList = this.tableData.slice(start, start + this.pageSize);
    },
    beforeUpload(file) {
      let fd = new FormData();
      fd.append('file', file);
      fd.append('productId', this.selectedGoodsId);
      this.$http.post('file/productimg', fd)
          .then(res => {
            if (res.code === 10000) {
              this.$message.success('上传图片成功！');
              this.getGoodsList();
            } else {
              this.$message.error(res.msg);
            }
          });
      return false;
    },
  },
  created() {
    this.$http
        .get('/shop/listshopsbyuserid', {
          userId: JSON.parse(localStorage.getItem('userInform')).userId
        })
        .then(res => {
          if (res.code === 10000) {
            this.storeId = res.data[0].shopID;
            this.storeName = res.data[0].shopName;
            this.storeStatus = res.data[0].status;
            if (this.storeStatus === 1) {
              this.$http
                  .get('/index/category-recommends')
                  .then(res => {
                    if (res.code === 10000) {
                      for (let item of res.data) {
                        this.categories.set(item.categoryId, item.categoryName);
                      }
                      this.getGoodsList();
                    } else {
                      this.$message.error(res.msg)
                    }
                  });
            }
          } else {
            this.$message.error(res.msg);
          }
        });
  }
}
</script>

<style>

.form1 .el-form-item__label {
  font-size: 18px;
  font-weight: bold;
}

.inputWidth {
  width: 300px;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

