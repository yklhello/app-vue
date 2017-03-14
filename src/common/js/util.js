/**
 * Created by Jon_Jungler on 2017/3/13.
 */
/* 解析url */
export function urlParse(){
  let url=window.location.search;
  let obj={};
  let reg=/[?&][^?&]+=[^?&]+/g;
  let arr=url.match(reg);
  if(arr){
    arr.forEach((item)=>{
      let tempArr=item.substring(1).split('=');
      let key=decodeURIComponent(tempArr[0]);
      let val=decodeURIComponent(tempArr[1])
      obj[key]=val;
    })
  }
  return obj;
}
