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
  {name:"Reddit",ticker:"RDDT",domain:"reddit.com",rate:3,cat:"Subscription",proof:["email"],settle:190,price:224.6,note:"Reddit Premium"},
  {name:"Rivian",ticker:"RIVN",domain:"rivian.com",rate:1,cat:"Motoring",proof:["email"],settle:344,price:13.1,note:"Service and charging"},
  {name:"Take-Two",ticker:"TTWO",domain:"take2games.com",rate:4,cat:"Games",proof:["email"],settle:201,price:238.4,note:"GTA, NBA 2K, Zynga"},
  {name:"GameStop",ticker:"GME",domain:"gamestop.com",rate:3,cat:"Games",proof:["paper"],settle:224,price:23.8},
  {name:"Xbox",ticker:"MSFT",domain:"xbox.com",rate:2,cat:"Games",proof:["email"],settle:158,price:512.6,note:"Game Pass, pays in Microsoft"},
  {name:"Microsoft 365",ticker:"MSFT",domain:"microsoft.com",rate:2,cat:"Subscription",proof:["email"],settle:166,price:512.6},
  {name:"YouTube Premium",ticker:"GOOGL",domain:"youtube.com",rate:2,cat:"Subscription",proof:["email"],settle:181,price:242.7,note:"Pays in Alphabet"},
  {name:"Google One",ticker:"GOOGL",domain:"google.com",rate:2,cat:"Subscription",proof:["email"],settle:179,price:242.7},
  {name:"Ray-Ban Meta",ticker:"META",domain:"meta.com",rate:3,cat:"Eyewear",proof:["paper","email"],settle:266,price:748.2,note:"Sold by opticians"},
  {name:"Tesla",ticker:"TSLA",domain:"tesla.com",rate:1,cat:"Motoring",proof:["email"],settle:302,price:388.5,note:"Supercharging and service"},
  {name:"Dell",ticker:"DELL",domain:"dell.com",rate:2,cat:"Electronics",proof:["email"],settle:241,price:132.4},
  {name:"AliExpress",ticker:"BABA",domain:"aliexpress.com",rate:3,cat:"Retail",proof:["email"],settle:288,price:161.9,note:"Pays in Alibaba"},
  {name:"Coinbase",ticker:"COIN",domain:"coinbase.com",rate:2,cat:"Fees",proof:["email"],settle:149,price:318.7,note:"Trading fees on a filled order"},
  {name:"Starbucks",ticker:"SBUX",domain:"starbucks.com",rate:3,cat:"Food",proof:["paper"],soon:true},
  {name:"Nike",ticker:"NKE",domain:"nike.com",rate:4,cat:"Clothing",proof:["paper","email"],soon:true},
  {name:"McDonald's",ticker:"MCD",domain:"mcdonalds.com",rate:3,cat:"Food",proof:["paper"],soon:true},
  {name:"Uber",ticker:"UBER",domain:"uber.com",rate:2,cat:"Travel",proof:["email"],soon:true},
  {name:"Spotify",ticker:"SPOT",domain:"spotify.com",rate:3,cat:"Subscription",proof:["email"],soon:true},
  {name:"Disney+",ticker:"DIS",domain:"disneyplus.com",rate:3,cat:"Subscription",proof:["email"],soon:true},
  {name:"Walmart",ticker:"WMT",domain:"walmart.com",rate:2,cat:"Groceries",proof:["paper","email"],soon:true},
  {name:"Target",ticker:"TGT",domain:"target.com",rate:2,cat:"Retail",proof:["paper"],soon:true},
  {name:"Shell",ticker:"SHEL",domain:"shell.com",rate:1,cat:"Fuel",proof:["paper"],soon:true},
  {name:"Chipotle",ticker:"CMG",domain:"chipotle.com",rate:3,cat:"Food",proof:["paper","email"],soon:true},
  {name:"Home Depot",ticker:"HD",domain:"homedepot.com",rate:2,cat:"Retail",proof:["paper"],soon:true},
  {name:"Best Buy",ticker:"BBY",domain:"bestbuy.com",rate:2,cat:"Electronics",proof:["paper","email"],soon:true},
  {name:"CVS",ticker:"CVS",domain:"cvs.com",rate:2,cat:"Health",proof:["paper"],soon:true},
  {name:"Adobe",ticker:"ADBE",domain:"adobe.com",rate:3,cat:"Subscription",proof:["email"],soon:true},
  {name:"Celsius",ticker:"CELH",domain:"celsius.com",rate:5,cat:"Drinks",proof:["paper"],soon:true,note:"A line on any supermarket receipt"},
  {name:"e.l.f. Beauty",ticker:"ELF",domain:"elfcosmetics.com",rate:5,cat:"Beauty",proof:["paper","email"],soon:true}
];
var TOKENS = {"COST": "0x4EA005168D7F09a7A0Ba9D1DEf21a479950E44C2", "AAPL": "0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9", "AMZN": "0x12f190a9F9d7D37a250758b26824B97CE941bF54", "NFLX": "0xE0444EF8BF4eD74f74FD73686e2ddF4C1c5591E8", "LULU": "0x4e62068525Ab11FE768e29dfD00ef909B9803016", "HIMS": "0xCceE82fE024c36fA15E1005edE3E9e4787e23D09", "RBLX": "0xF0C4BF4C582cb3836e98394b1d4e7B7281101bE8", "RDDT": "0x05b37Fb53A299a1b874A619e1c4C404D52C36F4C", "RIVN": "0xB1BF26c1D20ff267A4f93550d1E0d06ac40a114B", "TTWO": "0x5e81213613b6B86EaB4c6c50d718d34359459786", "AMC": "0x05a3d1Cd21d0C88145E82600E62e7E496e0F222B", "GME": "0x1b0E319c6A659F002271B69dB8A7df2F911c153E", "MSFT": "0xe93237C50D904957Cf27E7B1133b510C669c2e74", "GOOGL": "0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3", "META": "0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35", "TSLA": "0x322F0929c4625eD5bAd873c95208D54E1c003b2d", "DELL": "0x941AE714EC6D8130c7B75d67160Ca08f1e7d11Dd", "BABA": "0xad25Ac6C84D497db898fa1E8387bf6Af3532a1c4", "COIN": "0x6330D8C3178a418788dF01a47479c0ce7CCF450b"};
var SB = {
  tokens: TOKENS, chainId: 4663, explorer: "https://robinhoodchain.blockscout.com",
  capBase: 20, capHolder: 100, welcome: 5,
  live(){ return SHELF.filter(b=>!b.soon); },
  fmtSec(s){ if(s==null) return "—"; const m=Math.floor(s/60), r=s%60; return m>0? m+"m "+String(r).padStart(2,"0")+"s" : r+"s"; },
  money(n){ return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); },
  shares(usd, brand){ return brand.price? usd/brand.price : 0; },
  median(){ const a=this.live().map(b=>b.settle).sort((x,y)=>x-y); return a[Math.floor(a.length/2)]; },
  logo(b){ return "https://www.google.com/s2/favicons?domain="+b.domain+"&sz=64"; },
  address(t){ return TOKENS[t]||null; },
  find(text){ const t=text.toLowerCase(); return SHELF.find(b=>t.includes(b.name.toLowerCase().replace("&","and"))||t.includes(b.name.toLowerCase())||t.includes(b.domain.split(".")[0])); }
};
root.SHELF=SHELF; root.SB=SB;
})(typeof window!=="undefined"?window:module.exports);
