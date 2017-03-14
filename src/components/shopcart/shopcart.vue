<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalCount>0}">
            ¥{{totalPrice}}
          </div>
          <div class="desc">另需配送费 ¥ {{delivery_price}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
        <div class="ball-container">
          <div v-for="ball in balls" >
            <transition name="drop" v-on:before-enter="beforeEnter"
                        v-on:enter="enter"
                        v-on:after-enter="afterEnter"
                        v-bind:css="false"
            >
              <div class="ball" v-show="ball.show">
                <div class="inner inner-hook">
                </div>
              </div>
            </transition>
          </div>

        </div>
        <transition name="fold">
          <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="list_content">
              <ul>
                <li class="food" v-for="food in selectFoods">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>¥{{food.price*food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </transition>

      </div>
    </div>
      <transition name="fade">
        <div class="list-mask" v-show="listShow" @click="hideList"></div>
      </transition>
  </div>



</template>

<script>
  import BScroll from 'better-scroll';
  import  cartcontrol from '../cartcontrol/cartcontrol.vue'
  export default {
    props:{
      selectFoods:{
         type:Array,
          default(){
             return [
               {
                   price:0,
                   count:1
               }
             ]
          }
      },
      delivery_price:{
        type:Number,
        default:0
      },
      min_price:{
        type:Number,
        default:0
      },
    },

    data(){
        return{
          balls:[
              {
                show:false
              },
              {
                show:false
              },
              {
                show:false
              },
              {
                show:false
              },
              {
                show:false
              },
            ],
          dropBall:[],
          fold:true
        }
    },
    computed:{
        totalPrice(){
          let total=0;
          this.selectFoods.forEach(function(food){
              return total+=food.price*food.count;
          })
          return total;
        },
        totalCount(){
          let count=0;
          this.selectFoods.forEach((food)=>{
              count+=food.count;
          });
          return count;
        },
        payDesc(){
            if(this.totalPrice===0){
                return `¥${this.min_price}元起送`
            }else if(this.totalPrice<this.min_price){
                let diff=this.min_price-this.totalPrice;
                return `还差¥${diff}元起送`
            }else{
                return "去结算";
            }
        },
        payClass(){
            if(this.totalPrice<this.min_price){
                return "not-enough"
            }else{
                return "enough"
            }
        },
        listShow(){
          if(!this.totalCount){
            this.fold=true;
            return false;
          }
          let show=!this.fold;
          if(show){
            this.$nextTick(()=>{
              if(!this.scroll){
                this.scroll=new BScroll(this.$refs.list_content,{
                  click:true
                })
              }else{
                this.scroll.refresh()
              }

            })
          }
          return show;
        },
    },
    methods:{
      pay(){
          if(this.totalPrice<this.min_price){
            return;
          }
          window.alert(`需要支付￥${this.totalPrice}元`)
      },
      hideList(){
          this.fold=true;
      },
      empty(){
          this.selectFoods.forEach((food)=>{
              food.count=0;
          })
      },
      ballTarget(target){
        for(let i=0;i<this.balls.length;i++){
            let ball=this.balls[i];
            if(!ball.show){
                ball.show=true;
                ball.target=target;
                this.dropBall.push(ball);
                return;
            }
        }

      },
      toggleList(){
        if(!this.totalCount){
            return
        }
        this.fold=!this.fold;
        console.log(this.listShow)
      },
      beforeEnter: function (el) {
        let count=this.balls.length;
        while(count--){
            let ball=this.balls[count];
            if(ball.show){
                let rect=ball.target.getBoundingClientRect();
                let x=rect.left-32;
                let y=-(window.innerHeight-rect.top-22)
                el.style.display="";
                el.style.webkitTransform=`translate3D(0,${y}px,0)`;
                el.style.transform=`translate3D(0,${y}px,0)`;
                let inner=el.getElementsByClassName("inner-hook")[0];
                inner.style.webkitTransform=`translate3D(${x}px,0,0)`;
                inner.style.transform=`translate3D(${x}px,0,0)`;
            }
        }
      },
      enter: function (el, done) {
          /* eslint-disable no-unused-vars*/
        let rf=el.offsetHeight;//浏览器重绘
        this.$nextTick(()=>{
          el.style.webkitTransform='translate3d(0,0,0)';
          el.style.transform='translate3d(0,0,0)';
          let inner=el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform='translate3d(0,0,0)';
          inner.style.transform='translate3d(0,0,0)';
          el.addEventListener("transitionend",done);//important
        })
      },
      afterEnter:function(el){
        let ball=this.dropBall.shift();
        if(ball){
            ball.show=false;
            el.style.display="none";
        }
      }
    },
    components:{
      cartcontrol:cartcontrol
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .shopcart{
    width:100%;
    height:48px;
    position: fixed;
    bottom: 0;
    left:0;
    z-index:50;
    .content{
      display: flex;
      background: #141d27;
      font-size: 0;
      .content-left{
        flex:1;
        .logo-wrapper{
          display: inline-block;
          position: relative;
          top:-10px;
          margin:0 12px;
          padding:6px;
          width:56px;
          height:56px;
          box-sizing:border-box;
          vertical-align: top;
          border-radius:50%;
          background: #141d27;
          .num{
            position: absolute;
            top:0;
            right:0;
            width:24px;
            height:16px;
            text-align: center;
            line-height: 16px;
            font-size: 9px;
            border-radius: 16px;
            font-weight: 700;
            color:#fff;
            background:rgb(240,20,20);
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
          }
          .logo{
            width:100%;
            height:100%;
            border-radius: 50%;
            background: #2b343c;
            text-align: center;
            &.highlight{
              background: rgb(0,160,220);
              .icon-shopping_cart{
                color:#fff;
              }
            }
            .icon-shopping_cart{
              font-size: 24px;
              color:#80858a;
              line-height: 44px;
            }
          }
        }
        .price{
          display: inline-block;
          line-height: 24px;
          margin-top:12px;
          padding-right:12px;
          box-sizing:border-box;
          border-right:1px solid rgba(255,255,255,0.1);
          font-size: 16px;
          font-weight:700;
          color:rgba(255,255,255,0.4);
          vertical-align:top;
          &.highlight{
            color:#fff;
          }
        }
        .desc{
          display: inline-block;
          vertical-align:top;
          line-height: 24px;
          margin-top:12px;
          margin-left:12px;
          font-size: 12px;
          color:rgba(255,255,255,0.4);
        }
      }
      .content-right{
        .pay{
          color:rgba(255,255,255,0.4);
          flex:0 0 105px;
          width:105px;
          background: #2b333b;
          text-align: center;
          height:48px;
          font-size: 12px;
          line-height: 48px;
          font-weight: 700;
          &.not-enough{
            background: #2b333b;
          }
          &.enough{
            background: #00b43c;
            color:#fff;
          }
        }
      }
      .ball-container{
        .ball{
          position:fixed;
          left:32px;
          bottom: 22px;
          z-index:200;
          transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
          .inner{
            width:16px;
            height:16px;
            border-radius: 50%;
            background: #00a0dc;
            transition:all 0.4s linear;
          }
        }
      }
      .shopcart-list{
        position: absolute;
        top:0;
        z-index:-1;
        left:0;
        width:100%;
        transition:all 0.5s;
        transform:translate3d(0,-100%,0);
        &.fold-enter{
          transform:translate3d(0,-100%,0);
        }
        &.fold-enter-active{
          transform:translate3d(0,0,0);
        }
        &.fold-leave{
          transform:translate3d(0,0,0);
        }
        &.fold-leave-active{
          transform:translate3d(0,0,0);
        }
        .list-header{
          height:40px;
          width:100%;
          line-height: 40px;
          padding:0 18px;
          box-sizing: border-box;
          background: #f3f5f7;
          border-bottom: 1px solid rgba(7,17,27,0.1);
          .title{
            float:left;
            font-size: 14px;
            color:rgb(7,17,27);
          }
          .empty{
            float:right;
            font-size: 14px;
            color:rgb(0,160,220);
          }
        }
        .list-content{
          padding:0 18px;
          max-height:217px;
          background: #fff;
          overflow: hidden;
          .food{
            position: relative;
            padding:12px 0;
            box-sizing: border-box;
            .border-1px(rgba(7,17,27,0.1));
            .name{
              line-height: 24px;
              font-size: 14px;
              color:rgb(7,17,27);
            }
            .price{
              position:absolute;
              right:90px;
              bottom: 12px;
              line-height: 24px;
              font-size: 14px;
              color:rgb(240,20,20);
              font-weight:700;
            }
            .cartcontrol-wrapper{
              position: absolute;
              right:0;
              bottom: 6px;
            }
          }
        }
      }
    }

  }
  .list-mask{
      position: fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      z-index:40;
      opacity:1;
      transition:all 0.5s;
      background:rgba(7,17,27,0.6);
      -webkit-backdrop-filter-filter:blur(10px);
      &.fade-enter{
        background:rgba(7,17,27,0.6)
      }
      &.fade-enter-active{
        background:rgba(7,17,27,0)
      }
    }

</style>
