// Bits are always bottom-to-top. Matrix rows: lower trigram; columns: upper.
export const trigrams=[['111','乾','天'],['110','兑','泽'],['101','离','火'],['100','震','雷'],['011','巽','风'],['010','坎','水'],['001','艮','山'],['000','坤','地']];
export const matrix=[[1,43,14,34,9,5,26,11],[10,58,38,54,61,60,41,19],[13,49,30,55,37,63,22,36],[25,17,21,51,42,3,27,24],[44,28,50,32,57,48,18,46],[6,47,64,40,59,29,4,7],[33,31,56,62,53,39,52,15],[12,45,35,16,20,8,23,2]];
export function identify(bits){if(!/^[01]{6}$/.test(bits))throw new Error('Invalid six lines');return matrix[trigrams.findIndex(t=>t[0]===bits.slice(0,3))][trigrams.findIndex(t=>t[0]===bits.slice(3))];}
export function bitsFor(id){for(let a=0;a<8;a++)for(let b=0;b<8;b++)if(matrix[a][b]===id)return trigrams[a][0]+trigrams[b][0];throw new Error('Unknown hexagram');}
export function coinTotal(coins){if(coins.length!==3||coins.some(n=>n!==2&&n!==3))throw new Error('Invalid coins');return coins.reduce((a,b)=>a+b,0);}
export function castCoins(){return [...crypto.getRandomValues(new Uint8Array(3))].map(n=>2+(n&1));}
export function reading(lines){if(lines.length!==6||lines.some(n=>![6,7,8,9].includes(n)))throw new Error('Invalid cast');const primary=lines.map(n=>n%2).join('');const changed=lines.map(n=>n===6?1:n===9?0:n%2).join('');return {primary:identify(primary),changed:identify(changed),bits:primary,changedBits:changed,moving:lines.flatMap((n,i)=>n===6||n===9?[i+1]:[])};}
export const topics={general:['此刻的自己','写下一件你能在今天完成的小事，不必等到所有条件都成熟。'],work:['学业与工作','把担心拆成“已知事实”和“待确认的信息”，先核实其中一项。'],relations:['关系与相处','把猜测换成一个开放的问题，找合适的时机听听对方的想法。'],creation:['创作与选择','做一个可以撤回的小实验，用真实反馈代替反复猜想。']};
export function parseShare(hash){const match=/^#cast=([6789]{6})&topic=(general|work|relations|creation)$/.exec(hash);return match?{lines:[...match[1]].map(Number),topic:match[2]}:null;}
