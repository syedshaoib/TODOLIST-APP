const body=require('body-parser')
const express=require('express')
const ejs=require('ejs')
const https=require('https')
 const time=require(__dirname + "/time.js");
 var date=time.geth();

app=express();

app.set('view engine','ejs');


 const mongoose=require('mongoose');
 mongoose.connect("mongodb+srv://syedshoaib:wazeera12,,@cluster0.svopk.mongodb.net/WORKDB",{useNewUrlParser:true});

const WORKs= new mongoose.Schema({

  item:String
});

const LISTS= new mongoose.Schema({
  name:String,
  li_items:[WORKs]


}

);

const LIST=mongoose.model("LIST",LISTS);




  const WORK=mongoose.model("WORK",WORKs);

  const work1=new WORK({
    item:"shopping"

  });
  const work2=new WORK({
    item:"Recharge"

  });

 resps=[]
var WORK_ARRAY_DATABASE=[work1,work2];

// WORK.insertMany(WORK_ARRAY_DATABASE,function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("succusfully added");
//
//   }
// })





app.use(body.urlencoded({extended:true}));
app.use(express.static("public"));
// app.get("/" ,function(req,res)
// {
// var time=date.getDay();
// //
// // var ar=["sunday","Monday", "tuesday","wensday","thursday","Friday","saturday"];
// //
// // switch (time) {
// //   case 0:
// //   day=ar[0]
// //     break;
// //     case 1:
// //   day=ar[1]
// //       break;
// //       case 2:
// //   day=ar[2]
// //         break;
// //         case 3:
// //   day=ar[3]
// //           break;
// //           case 4:
// //   day=ar[4]
// //             break;
// //             case 5:
// //   day=ar[5]
// //               break;
// //
// //   default:
// //    day=ar[6]
// //
// // }
//
//
//
// res.render("list",{title:date,thig: resps});
//
// });

app.get("/",function(req,res)
{

WORK.find({},function(err,works){

if(works.length===0){
  WORK.insertMany(WORK_ARRAY_DATABASE,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("succusfully added");

    }
  });

res.redirect("/");




}

else{
  res.render("list",{title: "Today" ,thig: works});
}
});

  });
app.get('/:id',function(req,res){

  const dyurl=req.params.id;


LIST.findOne({name:dyurl},function(err,FOUND)
{
if(!FOUND){
  const listi=new LIST({
    name:dyurl,
    li_items:WORK_ARRAY_DATABASE

  });

  listi.save();
res.redirect("/"+dyurl);

}


else{
  res.render("list",{title:FOUND.name,thig: FOUND.li_items});



}

});



});

app.post("/", function(req,res)
{
  const tit_=req.body.list;




console.log(typeof(tit_))
const item_=req.body.item;


const items=new WORK({


item:item_

});


      if(tit_==="Today"){



        items.save();
        res.redirect("/");



      }

    else{
    LIST.findOne({name:tit_},function(err,Lists){
   Lists.li_items.push(items);
      Lists.save();
      res.redirect("/"+tit_)


    });

    }
});
app.get("/about",function(req,res)
{
  res.render("about");
});



app.post("/del",function(req,res)
{

  const d_id=req.body.checkbox;
  const ListName=req.body.ListName;



if(ListName==="Today"){
  WORK.findByIdAndRemove(d_id,function(err)
  {
    if(!err){
        console.log("DELETED");

    }
        res.redirect("/");
  });

}
else{

LIST.findOneAndUpdate({name:ListName},{$pull:{li_items:{_id:d_id}}},function(err,FoundList){

  res.redirect('/'+ListName );
console.log(FoundList)



})

}







});







let port= process.env.PORT || 000;


app.listen(port,function()
{
  console.log("server is working ")
})
