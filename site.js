/* Stockback landing runtime: no framework, three behaviours */
(function(){
  // 1. chart reveal
  var chart=document.querySelector('.lchart');
  if(chart&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ if(es.some(function(e){return e.isIntersecting;})){ chart.classList.add('is-seen'); io.disconnect(); } },{threshold:.35});
    io.observe(chart);
  } else if(chart){ chart.classList.add('is-seen'); }
  // 2. receipt calculator
  var range=document.getElementById('calc-range'); if(!range) return;
  var picks=document.querySelectorAll('.lwork-pick button'), tabs=document.querySelectorAll('.lwork-tab');
  var brand=SHELF.find(function(b){return b.ticker==='COST';}), holder=false;
  function fmt(n){return SB.money(n);}
  function render(){
    var total=Number(range.value), r=SB.reward(total,brand,holder), raw=total*brand.rate/100, capped=r<raw-1e-9;
    range.style.setProperty('--pct',(total/Number(range.max)*100)+'%');
    document.getElementById('calc-total').textContent=fmt(total);
    document.getElementById('calc-brand').textContent=brand.name;
    document.getElementById('calc-rate').textContent=brand.rate+'%';
    document.getElementById('calc-ticker').textContent=brand.ticker;
    document.getElementById('calc-total2').textContent=fmt(total);
    document.getElementById('calc-reward').textContent=fmt(r);
    document.getElementById('calc-shares').textContent=SB.shares(r,brand).toFixed(4)+' '+brand.ticker;
    document.getElementById('calc-cap').textContent='$'+(holder?SB.capHolder:SB.capBase);
    var bar=document.getElementById('calc-bar'); bar.style.width=Math.max(4,Math.min(100,raw/(holder?SB.capHolder:SB.capBase)*100))+'%';
    document.getElementById('calc-note').textContent= total===0 ? 'Move the slider to see what a receipt pays.' : capped
      ? 'This receipt would earn '+fmt(raw)+' at '+brand.rate+'%, but the cap is $'+(holder?SB.capHolder:SB.capBase)+' a receipt. '+(holder?'That is the holder cap.':'Hold $STOCKBACK and the cap moves to $'+SB.capHolder+'.')
      : fmt(r)+' is '+brand.rate+'% of the receipt, converted to '+brand.ticker+' at market when the claim settles. Under the cap, so nothing is left on the table.';
