<template>
    <div class="goods">
      <div class="menu-wrapper"  ref="menu_wrapper" >
        <ul>
          <li v-for="(item,index) in goods" class="menu-item"
              v-bind:class="{'current':index===currentIndex}"
              @click="selectMenu(index,$event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon"
                    :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foods_wrapper">
        <ul>
          <li v-for="item in goods"
              class="food-list foot-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods"
                  class="food-item border-1px"
                  @click="selectFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" alt="" width="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">¥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"
                                 @target="receiveTarget">
                    </cartcontrol>
                  </div>
                </div>

              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :delivery_price="seller.deliveryPrice"
                :min_price="seller.minPrice"
                :selectFoods="selectFoods" ref="shopTarget">
      </shopcart>
      <food :food="selectedFood"
            ref="foodHook">
      </food>
    </div>


</template>

<script>
  import BScroll from 'better-scroll';
  import  shopcart from '../shopcart/shopcart.vue';
  import  cartcontrol from '../cartcontrol/cartcontrol.vue';
  import  food from '../food/foods.vue'
  const ERR_OK=0;
export default {
    props:{
        seller:{
            type:Object
        },
    },
    data(){
      return {
        goods:[],
        listHeight:[],
        scrollY:0,
        selectedFood:{}
      }
    },
    computed:{
        calc_target(event){
          console.log(event.target)
        },
        currentIndex(){
          for(let i=0;i<this.listHeight.length;i++){
            let height1=this.listHeight[i];
            let height2=this.listHeight[i+1];
//            console.log("scrollY:"+this.scrollY)
//            console.log("height1:"+height1)
//            console.log("height2:"+height2)
//            console.log(!height2 || (this.scrollY>=height1 && this.scrollY<height2))

            if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){
              console.log("i:"+i);
              return i;
            }
          }
        return 0;
      },
        selectFoods(){
            let foods=[];
            this.goods.forEach((good)=>{
                good.foods.forEach((food)=>{
                    if(food.count){
                        foods.push(food)
                    }
              });
            });
            return foods;
        }
    },
    created(){
      this.classMap=[
        'decrease','discount',"special","invoice","guarantee"
      ];
      this.$http.get('./api/goods').then(response => {
        response=response.body;
        if(response.errno===ERR_OK){
          this.goods=response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculatedHeight();
          })

        }

      }, response => {

      })
    },

    methods:{
        receiveTarget(target){
            this.$nextTick(()=>{
              this.$refs.shopTarget.ballTarget(target);
            })

        },
        _initScroll(){
            this.menuScroll=new BScroll(this.$refs.menu_wrapper,{
                click:true
            })
            this.foodScroll=new BScroll(this.$refs.foods_wrapper,{
                click:true,
                probeType:3
            })
            this.foodScroll.on("scroll",(pos)=>{
                this.scrollY=Math.abs(Math.round(pos.y))
            })
        },
        _calculatedHeight(){
          let foodList=this.$refs.foods_wrapper.getElementsByClassName("foot-list-hook");

          let height=0;
          this.listHeight.push(height);
          for(let i=0;i<foodList.length;i++){
              let item =foodList[i];
              height+=item.clientHeight;
              this.listHeight.push(height);
          }
        },
        selectMenu(index,event){
          if (!event._constructed){//解决pc端点击事件相应两次
              return
          }
          let foodList=this.$refs.foods_wrapper.getElementsByClassName("foot-list-hook");
          let el=foodList[index];
          this.foodScroll.scrollToElement(el,300);
        },
      selectFood(food,event){
        if (!event._constructed){//解决pc端点击事件相应两次
          return
        }
        this.selectedFood=food;
        this.$refs.foodHook.show();
      }
    },
    components:{
        shopcart:shopcart,
        cartcontrol:cartcontrol,
        food:food
    }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';

  .goods{
    display: flex;
    position:absolute;
    top:174px;
    bottom: 46px;
    width:100%;
    overflow: hidden;
    .menu-wrapper{
      flex:0 0 80px;
      width:80px;
      background: #f3f5f7;
      .menu-item{
        display: table;
        width:80px;
        height:54px;
        line-height: 14px;
        margin:0 auto;
        &.current{
          background: #fff;
          font-weight:700;
          position:relative;
          margin-top:-1px;
          z-index:10;
          .text{
            .border-none();
          }
        }
        .icon{
          display: inline-block;
          vertical-align: top;
          width:12px;
          height:12px;
          margin-right:2px;
          background-size:12px 12px;
          background-repeat: no-repeat ;
          &.decrease{
            .bg_3(decrease_3);
          }
          &.discount{
            .bg_3(discount_3);
          }
          &.guarantee{
            .bg_3(guarantee_3)
          }
          &.invoice{
            .bg_3(invoice_3)
          }
          &.special{
            .bg_3(special_3)
          }
        }
        .text{
          display: table-cell;
          vertical-align: middle;
          width:56px;
          font-size: 12px;
          text-align: center;
          .border-1px(rgba(7,17,27,0.1));
        }
      }
    }
    .foods-wrapper{
      flex:1;
      .food-list{
        .title{
          padding-left:14px;
          height:26px;
          line-height: 26px;
          border-left:2px solid #d9dde1;
          font-size: 12px;
          color:rgb(147,153,159);
          background: #f3f5f7;
        }
        .food-item{
          display: flex;
          margin:18px;
          padding-bottom:18px;
          .border-1px(rgba(7,17,27,0.1));
          &:last-child{
            .border-none();
            margin-bottom:0;
          }
          .icon{
            flex:0 0 57px;
            margin-right:10px;
          }
          .content{
            flex: 1;
            .name{
              margin:2px 0 8px 0;
              font-size: 14px;
              color:rgb(7,17,27);
              line-height: 14px;
              height:14px;
            }
            .extra{
              font-size:10px;
              line-height: 10px;
              color:rgb(147,153,159);
            }
            .extra{
              .count{
                margin-right:12px;
              }
            }
            .desc{
              color:rgb(147,153,159);
              font-size:10px;
              line-height: 12px;
              margin-bottom: 8px;
            }
            .price{
              font-weight:700;
              line-height: 24px;
              .now{
                margin-right:8px;
                font-size: 14px;
                color:rgb(240,20,20);
              }
              .old{
                text-decoration: line-through;
                font-size: 10px;
                color:rgb(147,153,159);
              }
            }
            .cartcontrol-wrapper{
              position:absolute;
              right:0;
              bottom:12px;
            }
          }
        }
      }
    }
  }
</style>
