<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class='tab border-1px'>
       <router-link to="/goods" class='tab-item' >商品</router-link>
       <router-link to="/ratings" class='tab-item'>评价</router-link>
       <router-link to="/seller" class='tab-item'>商家</router-link>
    </div>
    <router-view v-bind:seller="seller" keep-alive></router-view>

  </div>

</template>

<script>
  import header from './components/header/header';
  import goods from './components/goods/goods';
  import {urlParse} from './common/js/util.js';

  const ERR_OK=0;
  export default {
      data(){
          return {
              seller:{
                  id: (()=>{
                      let queryParam=urlParse();
                      console.log(queryParam)
                      return queryParam.id;
                  })()
              },
              goods:[]
          }
      },
      created(){
        this.$http.get('./api/seller?id='+this.seller.id).then(response => {
          response=response.body;
          if(response.errno===ERR_OK){
              //this.seller=response.data;
              this.seller=Object.assign({},this.seller,response.data)
              console.log(this.seller.id)
          }

        }, response => {

        })

      },
      components: {
        'v-header': header
      }
  }
</script>

<style lang="less" >
  @import 'common/less/index.less';
    .tab{
      display:flex;
      width:100%;
      height:40px;
      line-height:40px;
      .border-1px(rgba(7,17,27,0.1));
      .tab-item{
        flex:1;
        text-align:center;
        font-size: 14px;
        color:rgb(77,85,93);
        &.active{
            color:rgb(240,20,20);
         }
      }
    }
</style>
