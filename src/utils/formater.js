
const n = 243452323;


const espace = " ";
const virgule = ".";


const nombre = n.toString();
const float = parseFloat(nombre).toString();
let [nombreString, nombreVirgule] = ['', ''];
if (float.split('.').length === 2) {
  [nombreString, nombreVirgule] = float.split('.');
} else {
  nombreString = float;
}
const longueur = nombreString.length;

if (longueur <= 3) {
    console.log(nombreString)
}
else{
    let resultat = '';
    let i = 0;
    
    for (i = longueur - 3; i >= 0; i -= 3) {
      resultat = espace + nombreString.substring(i, i + 3) + resultat;
    }
    
    if (i < 0) {
      resultat = nombreString.substring(0, i + 3) + resultat;
    }
    
    if (nombreVirgule !== '') {
      let nombreFormat = resultat.trim() + virgule + nombreVirgule;
      console.log(nombreFormat);
    }else{
        let nombreFormat = resultat.trim()
        console.log(nombreFormat)
    }

}

