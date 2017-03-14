<template>
  <div class="cartControl">
    <transition  name="move">
      <div class="cart-decrease"
           v-show="food.count>0"
           @click="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>

    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
      props:{
          food:{
              type:Object
          }
      },
      created(){

      },
      methods:{
        addCart(event){
          if (!event._constructed){//解决pc端点击事件相应两次
            return
          }
          if(!this.food.count){
              Vue.set(this.food,'count',1);
          }else{
              this.food.count++;
          }
          this.$emit('target',event.target);
          //this.$dispatch("card.add",event.target)

        },
        decreaseCart(event){
          if (!event._constructed){//解决pc端点击事件相应两次
            return
          }
          if(this.food.count){
            this.food.count--;
          }
        }
      },

  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .cartControl{
    font-size: 0;
    .cart-decrease{
      display: inline-block;
      padding:6px;
      transition:all 0.4s linear;
      &.move-enter-active ,&.move-leave{
        opacity: 1;
        transform:translate3d(0,0,0);
        .inner{
          transform:rotate(0);
        }
      }
      &.move-enter,&.move-leave-active{
        opacity: 0;
        transform:translate3d(24px,0,0);
        .inner{
          transform:rotate(180deg);
        }
      }

      .inner{
        display: inline-block;
        transition:all 0.4s linear;
        line-height: 24px;
        font-size: 24px;
        color:rgb(0,160,220);
        transform:rotate(0)
      }
    }
    .cart-count{
      display: inline-block;
      font-size: 10px;
      vertical-align: top;
      width:12px;
      padding-top:6px;
      line-height: 24px;
      text-align: center;
      color:rgb(147,153,159)
    }
    .cart-add{
      display: inline-block;
      padding:6px;
      line-height: 24px;
      font-size: 24px;
      color:rgb(0,160,220)
    }

  }
</style>
