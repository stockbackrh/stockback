/* Stockback shelf: brands that pay in their own tokenized stock on Robinhood Chain */
(function(root){
var SHELF = [
  {name:"Costco",ticker:"COST",domain:"costco.com",rate:2,cat:"Groceries",proof:["paper"],settle:212,price:914.2,note:"Warehouse till receipt"},
  {name:"Apple",ticker:"AAPL",domain:"apple.com",rate:3,cat:"Electronics",proof:["paper","email"],settle:184,price:232.1,note:"Store receipt or order email"},
  {name:"Amazon",ticker:"AMZN",domain:"amazon.com",rate:2,cat:"Retail",proof:["email"],settle:236,price:214.7,note:"Order confirmation email"},
  {name:"Whole Foods",ticker:"AMZN",domain:"wholefoodsmarket.com",rate:2,cat:"Groceries",proof:["paper"],settle:251,price:214.7,note:"Pays in Amazon"},
  {name:"Netflix",ticker:"NFLX",domain:"netflix.com",rate:3,cat:"Subscription",proof:["email"],settle:171,price:1187.4,note:"Monthly renewal email"},
  {name:"Lululemon",ticker:"LULU",domain:"lululemon.com",rate:4,cat:"Clothing",proof:["paper","email"],settle:298,price:201.5},
  {name:"Hims & Hers",ticker:"HIMS",domain:"hims.com",rate:4,cat:"Health",proof:["email"],settle:207,price:52.3},
  {name:"Roblox",ticker:"RBLX",domain:"roblox.com",rate:4,cat:"Games",proof:["email"],settle:163,price:128.9,note:"Robux and Premium"},
