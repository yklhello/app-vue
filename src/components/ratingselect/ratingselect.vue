<template>
    <div class="ratingselect">
      <div class="rating-type border-1px">
        <span class="block positive"
              :class="{'active':type===2}"
              @click="select(2,$event)">
          {{desc.all}}
          <span class="count">{{ratings.length}}</span>
        </span>
        <span class="block positive"
              :class="{'active':type===0}"
              @click="select(0,$event)">
          {{desc.positive}}<span class="count">{{positives.length}}</span>
        </span>
        <span class="block negative"
              :class="{'active':type===1}"
              @click="select(1,$event)">
          {{desc.negative}}<span class="count">{{negatives.length}}</span>
        </span>
      </div>
      <div class="rating-switch" :class="{'on':content}"
      @click="toggleContent">
        <span class="icon-check_circle"></span>
        <span class="text">只看有内容的评价</span>
      </div>
    </div>
</template>

<script>
  const ALL=2;
  const POSITIVE=0;
  const NEGATIVE=1;
    export default {
        data(){
          return{
              type:this.selectType,
              content:this.onlyContent
          }
        },
        props:{
          ratings:{
            type:Array,
            default(){
                  return []
            }
          },
          selectType:{
            type:Number,
            default:ALL
          },
          onlyContent:{
            type:Boolean,
            default:false
          },
          desc:{
            type:Object,
            default(){
              return{
                all:'全部',
                positive:'满意',
                negative:'不满意'
              }
            }
          }
        },
        computed:{
          positives(){
              return this.ratings.filter((rating)=>{
                  return rating.rateType===POSITIVE;
              })
          },
          negatives(){
            return this.ratings.filter((rating)=>{
              return rating.rateType===NEGATIVE;
            })
          }
        },
        methods:{
            select(type,event){
                if(!event._constructed){
                    return;
                }
                this.type=type;
                this.$emit('sendType',type);
            },
            toggleContent(){
              this.content=!this.content;
              this.$emit('sendContent',this.content);
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .ratingselect{
    .rating-type{
      padding:0 18px 18px 18px;
      margin:18px 0 0 0 ;
      .border-1px(rgba(7,17,27,0.1));
      font-size: 0;
      .block{
        display: inline-block;
        padding:8px 12px;
        border-radius:2px;
        margin-right:8px;
        font-size: 12px;
        color:rgb(77,85,93);
        &.active{
          color:#fff;
        }
        .count{
          font-size: 8px;
          margin-left:2px;
          line-height: 16px;
        }
        &.positive{
          background: rgba(0,160,220,0.2);
          &.active{
            background: rgb(0,160,220);
          }
        }
        &.negative{
          background: rgba(77,85,93,0.2);
          &.active{
            background: rgb(77,85,93);
          }
        }
      }
    }
    .rating-switch{
      line-height:24px;
      padding:12px 18px;
      border-bottom: 1px solid rgba(7,17,27,0.1);
      color:rgb(147,153,159);
      font-size:0;
      &.on{
        .icon-check_circle{
          color:#00c850;
        }
      }
      .icon-check_circle{
        font-size:24px;
        margin-right:4px;
        display: inline-block;
        vertical-align: top;
      }
      .text{
        font-size: 12px;
      }
    }
  }

</style>
