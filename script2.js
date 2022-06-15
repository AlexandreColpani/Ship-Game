var diryJ, dirxJ; //variavel de movimentação da Nave
var jog; // variavel de movimentação do jogador
var velJ; // Variavel de velocidade do jogador
var velT; // Variavel Velocidade do Tiro
var pjx, pjy; // Variavel de posição do jogador
var jogo; //variavel para iniciar o jogo
var frames; //Controle do Loop Principal
var tamTelaW, tamTelaH; //Tamanho da Tela do Jogo
var contBombas, painelContBombas; //Contador das Bombas
var bombasTotal; //Controle de todas as Bombas
var velB; //Velocidade da Bomba
var vidaPlaneta,barraPlaneta; //Vida do Planeta
var tmpCriaBomba; //Intervalo de criação das bombas
var ie,isom; //Variavel Indice de Explosão / isom = Som
var telaMsg; //Tela de Inicio/Vitória/Derrota

function teclaDw(){
    var tecla=event.keyCode;
    if(tecla==38){ //Cima
        diryJ=-1;
    } else if(tecla==40) { //Baixo
        diryJ=1;
    }
    if(tecla==37){ //Esquerda
        dirxJ=-1;
    } else if(tecla==39) { //Direita
        dirxJ=1;
    }
    if(tecla==32) { // Espaço - Tiro
        //Tiro
        atira(pjx+17, pjy); // O +17 é para centralizar o tiro da nave
    }   
}

function teclaUp(){
    var tecla=event.keyCode;
    if((tecla==38) || (tecla==40)) {
        diryJ=0;
    }
    if((tecla==37) || (tecla==39)) {
        dirxJ=0;
    }
}
function criaBomba(){
    if(jogo){
        var y=0;
        var x=Math.random()*tamTelaW;
        var bomba=document.createElement("div");
        var att1=document.createAttribute("class");
        var att2=document.createAttribute("style");
        att1.value="bomba";
        att2.value="top:"+y+"px;left:"+x+"px;";
        bomba.setAttributeNode(att1);
        bomba.setAttributeNode(att2);
        document.body.appendChild(bomba);
        contBombas--;
    }
}
function controlaBomba(){
    bombasTotal=document.getElementsByClassName("bomba");
    var tam=bombasTotal.length;
    for(var i=0;i<tam;i++){
        if(bombasTotal[i]){
            var pi=bombasTotal[i].offsetTop;
            pi+=velB;
            bombasTotal[i].style.top=pi+"px";
            if(pi>tamTelaH){
                vidaPlaneta-=10;
                criaExplosao(2,bombasTotal[i].offsetLeft-25,null);
                bombasTotal[i].remove();
            }
        }
    }
}
function atira(x,y){
    var t=document.createElement("div");
    var att1=document.createAttribute("class");
    var att2=document.createAttribute("style");
    att1.value="tiroJog";
    att2.value="top:"+y+"px;left:"+x+"px;";
    t.setAttributeNode(att1);
    t.setAttributeNode(att2);
    document.body.appendChild(t);

}
function controleTiros() {
    var tiros=document.getElementsByClassName("tiroJog");
    var tam=tiros.length;
    for(var i=0;i<tam;i++){
        if (tiros[i]){
            var pt=tiros[i].offsetTop; //pt=Posição Tiros
            pt-=velT;
            tiros[i].style.top=pt+"px";
            colisaoTiroBomba(tiros[i]);
            if(pt<0){
                // Outra forma de remover as Divs que são criadas pelos tiros
                //document.body.removeChild(tiros[i]);
                tiros[i].remove();
            }
        }

    }
}

function colisaoTiroBomba(tiro){
    var tam=bombasTotal.length;
    for(var i=0;i<tam;i++){
        if(bombasTotal[i]){
            if(
                (
                    (tiro.offsetTop<=(bombasTotal[i].offsetTop+40))&& //Cima tiro com Baixo bomba
                    ((tiro.offsetTop+6)>=(bombasTotal[i].offsetTop)) //Baixo tiro com cima bomba
                )
                &&
                (
                    (tiro.offsetLeft<=(bombasTotal[i].offsetLeft+24))&& //Esquerda tiro com direita boma
                    ((tiro.offsetLeft+6)>=(bombasTotal[i].offsetLeft)) //Direita tiro com esquerda bomba
                )
            ){
                criaExplosao(1,bombasTotal[i].offsetLeft-25,bombasTotal[i].offsetTop);
                bombasTotal[i].remove();
                tiro.remove();
            }
        }
    }
}
function criaExplosao(tipo,x,y){ //Tipo 1=AR, 2=TERRA
    if (document.getElementById("explosao"+(ie+5))){
        document.getElementById("explosao"+(ie+5)).remove();
    }
    // Criação da Div
    var exploosao=document.createElement("div");
    var img=document.createElement("img");
    var som=document.createElement("audio");
    // Atributos para div
    var att1=document.createAttribute("class");
    var att2=document.createAttribute("style");
    var att3=document.createAttribute("id");
     // Atributos para imagem
     var att4=document.createAttribute("src");
      // Atributos para Audio
    var att5=document.createAttribute("src");
    var att6=document.createAttribute("id");

    att3.value="explosao"+ie;
    if(tipo==1){
        att1.value="explosaoAr";
        att2.value="top:"+y+"px;left:"+x+"px;";
        att4.value="../../image/explosao_ar.gif?"+new Date();
    }else{
        att1.value="explosaoChao";
        att2.value="top:"+(tamTelaH-57)+"px;left:"+(x-17)+"px;";
        att4.value="../../image/explosao_chao.gif?"+new Date();
    }
    att5.value="exp1.mp3?"+new Date();
    att6.value="som"+isom;
    exploosao.setAttributeNode(att1);
    exploosao.setAttributeNode(att2);
    exploosao.setAttributeNode(att3);
    img.setAttributeNode(att4);
    som.setAttributeNode(att5);
    som.setAttributeNode(att6);
    exploosao.appendChild(img);
    exploosao.appendChild(som);
    document.body.appendChild(exploosao);
    document.getElementById("som"+isom).play();
    ie++;
    isom++;

}
function controlaJogador(){ // Função para controle do Jogador
    pjy+=diryJ*velJ;
    pjx+=dirxJ*velJ;
    jog.style.top=pjy+"px";
    jog.style.left=pjx+"px";
}
function gerenciaGame(){ // Gerencia o Game em caso de vitória ou Derrota
    barraPlaneta.style.width=vidaPlaneta+"px";
    if(contBombas<=0){ // Em caso de Vitória
        jogo=false;
        clearInterval(tmpCriaBomba);
        telaMsg.style.background="url('../../image/vitoria.jpg')";
        telaMsg.style.display="block";
    }
    if(vidaPlaneta<=0){ // Em caso de Derrota
        jogo=false;
        clearInterval(tmpCriaBomba);
        telaMsg.style.background="url('../../image/derrota.jpg')";
        telaMsg.style.display="block";
    }   
}
function gameloop() { // Loop principal do Game
    if(jogo){
        //Funções de Controle
        controlaJogador();
        controleTiros();
        controlaBomba();
    }
    gerenciaGame();
    frames=requestAnimationFrame(gameloop);
}
function reinicia(){
    bombasTotal=document.getElementsByClassName("bomba");
    var tam=bombasTotal.length;
    for(var i=0;i<tam;i++){
        if(bombasTotal[i]){
            bombasTotal[i].remove();
        }
    }
    var tam=bombasTotal.length;
	for(var i=0;i<tam;i++){
		if(bombasTotal[i]){
			bombasTotal[i].remove();
		}
	}
    telaMsg.style.display="none";
    clearInterval(tmpCriaBomba);
    cancelAnimationFrame(frames);
    vidaPlaneta=300;
    pjx=tamTelaW/2;
    pjy=tamTelaH/2;
    jog.style.top=pjy+"px";
    jog.style.left=pjx+"px";
    contBombas=150;
    jogo=true;
    tmpCriaBomba=setInterval(criaBomba,1700);
    gameloop();
}

function inicia() { // Funcão de inicialização do Game
    jogo=true;

    //Inicialização da Tela
    tamTelaH = window.innerHeight;
    tamTelaW = window.innerWidth;

    //Inicialização do Jogador
    dirxJ=diryJ=0;
    pjx=tamTelaW/2; //Centraliza o jogador no meio da Tela
    pjy=tamTelaH/2; //Centraliza o jogador no meio da Tela
    velJ=velT=5; //Velocidade do Jogador e Tiros
    jog=document.getElementById("naveJog");
    jog.style.top=pjy+"px";
    jog.style.left=pjx+"px";

    //Controle das Bombas
    
    contBombas=150;
    velB=3;
    

    // Controle do Planeta
    vidaPlaneta=300;
    barraPlaneta=document.getElementById("barraPlaneta");
    barraPlaneta.style.width=vidaPlaneta+"px";

    //Controle de Explosão e Som
    ie=0;
    isom=0;

    //Controle de Telas
    telaMsg=document.getElementById("telaMsg");
    telaMsg.style.background="url('../../image/intro.jpg')";
    telaMsg.style="block";
    document.getElementById("btnJogar").addEventListener("click",reinicia);

    
}

window.addEventListener("load",inicia);
document.addEventListener("keydown",teclaDw);
document.addEventListener("keyup", teclaUp);

