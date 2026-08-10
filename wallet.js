/* Stockback wallet: injected EVM wallet (MetaMask, Rabby, Robinhood Wallet) on Robinhood Chain, no SDK */
(function(root){
  var CHAIN={chainId:'0x1237',chainName:'Robinhood Chain',nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},rpcUrls:['https://rpc.mainnet.chain.robinhood.com'],blockExplorerUrls:['https://robinhoodchain.blockscout.com']};
  var W={address:null,chainOk:false,_subs:[],onChange:function(f){this._subs.push(f);},_emit:function(){var s=this;this._subs.forEach(function(f){try{f(s);}catch(e){}});},
    short:function(){return this.address?this.address.slice(0,6)+'…'+this.address.slice(-4):'';},
    eth:function(){return root.ethereum;},
    connect:async function(){ var e=this.eth(); if(!e) throw new Error('no wallet found in this browser'); var acc=await e.request({method:'eth_requestAccounts'}); this.address=(acc[0]||'').toLowerCase()||null; await this.check(); if(!this.chainOk){ try{ await this.switchChain(); }catch(err){} } this._emit(); return this.address; },
    check:async function(){ var e=this.eth(); if(!e) return; try{ var c=await e.request({method:'eth_chainId'}); this.chainOk=parseInt(c,16)===4663; }catch(err){ this.chainOk=false; } },
    switchChain:async function(){ var e=this.eth(); try{ await e.request({method:'wallet_switchEthereumChain',params:[{chainId:CHAIN.chainId}]}); }catch(err){ if(err&&(err.code===4902||/unrecognized|not added/i.test(err.message||''))){ await e.request({method:'wallet_addEthereumChain',params:[CHAIN]}); } else throw err; } await this.check(); this._emit(); },
    sign:async function(message){ var e=this.eth(); return e.request({method:'personal_sign',params:[message,this.address]}); }
  };
  var e=root.ethereum;
  if(e&&e.on){ e.on('accountsChanged',function(a){ W.address=(a[0]||'').toLowerCase()||null; W._emit(); }); e.on('chainChanged',function(){ W.check().then(function(){W._emit();}); }); }
  if(e){ e.request({method:'eth_accounts'}).then(function(a){ if(a&&a[0]){ W.address=a[0].toLowerCase(); W.check().then(function(){W._emit();}); } }).catch(function(){}); }
  root.SBW=W;
})(window);
