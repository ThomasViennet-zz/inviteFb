//npm install puppeteer
const puppeteer = require('puppeteer');

//Settings
const facebookUser = '';
const facebookPwd = '';
const facebookPage = '';
const nbPublications = 3;//À partir de la plus récente
const vitesse = 5;//De 1 à 10, où 1 étant le plus rapide

//Processus invitations
(async () => {
  const browser = await puppeteer.launch({headless:true})
  const page = await browser.newPage()
  await page.goto("https://business.facebook.com/login/?next=https://business.facebook.com/"+ facebookPage +"/publishing_tools/?refSource=pages_manager_bar")
  page.waitForNavigation()

  console.log('[START] Connexion à Facebook');
  await page.type('#email', facebookUser, {delay: 10})
  await page.type('#pass', facebookPwd, {delay: 10})
  await page.click('#loginbutton')
  await page.waitFor(vitesse*3000);

  for(let i = 1; nbPublications >= i; i++){
    console.log('[info] Publication : [' + i + '/' + nbPublications +']');
    await page.click("#u_0_q > span > div > div._2mpu._3bq2._4bl7 > div:nth-child(2) > div > div._4sol._4-u2._4-u8 > div._3or5 > div > div._3h1i._1mie > div > div._219p > div:nth-child("+ i +") > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > a > div > div > div")
    await page.waitFor(vitesse*600);

    //Calcul du nombre de scroll à executer à partir du nombre d'intéractions*/
    const nbScroll = await page.evaluate(() => {
      let nbLike = document.querySelector('body > div._10.uiLayer._4-hy._3qw > div._59s7 > div > div > div > div > div._4-i2._pig._50f4 > div > div > div._ohf.rfloat > div > div > div._3uh- > div:nth-child(1) > div > div:nth-child(2) > span > div._55j-._50f7').innerText;
      let nbLove = document.querySelector('body > div._10.uiLayer._4-hy._3qw > div._59s7 > div > div > div > div > div._4-i2._pig._50f4 > div > div > div._ohf.rfloat > div > div > div._3uh- > div:nth-child(2) > div > div:nth-child(2) > span > div._55j-._50f7').innerText;
      let nbHaha = document.querySelector('body > div._10.uiLayer._4-hy._3qw > div._59s7 > div > div > div > div > div._4-i2._pig._50f4 > div > div > div._ohf.rfloat > div > div > div._3uh- > div:nth-child(3) > div > div:nth-child(2) > span > div._55j-._50f7').innerText;
      let nbAngry = document.querySelector('body > div._10.uiLayer._4-hy._3qw > div._59s7 > div > div > div > div > div._4-i2._pig._50f4 > div > div > div._ohf.rfloat > div > div > div._3uh- > div:nth-child(4) > div > div:nth-child(2) > span > div._55j-._50f7').innerText;
      let nbLikeClean = nbLike.replace(',','')
      let nbLoveClean = nbLove.replace(',','')
      let nbHahaClean = nbHaha.replace(',','')
      let nbAngryClean = nbAngry.replace(',','')
      let nbScroll = (Number(nbLikeClean) + Number(nbLoveClean) + Number(nbHahaClean) + Number(nbAngryClean)) / 50;
        return Math.trunc(nbScroll);
    });

    console.log('[info] Chargement des interactions');
    await page.click('._1g5v')
    await page.waitFor(vitesse*500);

    //Scroll des intéractions
    for(let i = 1; nbScroll >= i; i++) {
      await page.click('#reaction_profile_pager > div > a')
      await page.waitFor(vitesse*250);
      //console.log(i + " sur " + nbScroll);
    }
    console.log('[info] Envoie des invitations');
    //Récupère toutes les invitations possible
    const invite = await page.evaluate(() => {
      let arwayInvite = [];
      let invites = document.getElementsByClassName('_42ft');
      for (var invite of invites){
        if(invite.textContent == 'Invite'){
          arwayInvite.push(invite.textContent);
          //await page.waitFor(vitesse*150);
          //invite.click();
        }
      }
    return arwayInvite;
    });

    console.log("[info] " + invite.length + " invitation(s) envoyée(s)");
    //Fermeture de la publication
    await page.click('div > div > .\_4-i2 > .\_2pi9 > .\_42ft')
    await page.waitFor(vitesse*150);
    await page.click('.\_2gb3 > .clearfix > .\_ohf > .\_51-u > .\_5upp')
    await page.waitFor(vitesse*150);
  }
  console.log("[END] Fermeture navigateur");
  browser.close();
})()
