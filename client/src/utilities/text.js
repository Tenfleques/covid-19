import Locale from "../_locale"
import AgentUtils from "./agent"
import {diff_match_patch} from "../helpers/diffpatch";

const hashCode = function(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

function getLocalCaption(key){
    const user_lang = AgentUtils.getAgentLocale();
    if (Locale[user_lang][key]){
        return Locale[user_lang][key].title
    }

    if (Locale["en"][key]){
        return Locale["en"][key].title
    }

    return key;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = [];
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

const encode = s => {
    try {
        let dictionary = {},
            out = [],
            currentChar,
            phrase = s[0],
            code = 57344;
        s = (s + "").split("");
        for (let i = 1; i < s.length; i++) {
            currentChar = s[i];
            if (dictionary[phrase + currentChar] != null) {
                phrase += currentChar;
            } else {
                out.push(phrase.length > 1 ? dictionary[phrase] : phrase.codePointAt(0));
                dictionary[phrase + currentChar] = code;
                code++;
                phrase = currentChar;
            }
        }
        out.push(phrase.length > 1 ? dictionary[phrase] : phrase.codePointAt(0));
        return out.map(e => String.fromCodePoint(e)).join('');
    } catch (error) {
        throw new Error(error);
    }
}
const decode = dataAsText => {
    try {
        let data = [...dataAsText].map(e => e.codePointAt(0)),
            dictionary = {},
            currentChar = String.fromCodePoint(data[0]),
            oldPhrase = currentChar,
            out = [currentChar],
            code = 57344,
            phrase;
        for (let i = 1; i < data.length; i++) {
            let currentCode = data[i];
            if (currentCode < 57344) {
                phrase = String.fromCodePoint(data[i]);
            } else {
                phrase = dictionary[currentCode] ? dictionary[currentCode] : (oldPhrase + currentChar);
            }
            out += phrase;
            currentChar = phrase[0];
            dictionary[code] = oldPhrase + currentChar;
            code++;
            oldPhrase = phrase;
        }
        return out;
    } catch (error) {
        throw new Error(error);
    }
}

const processUpdate = (txt_patch, old_txt) => {
    const dmp = new diff_match_patch();
    if (txt_patch.includes("@")){
      console.log(txt_patch, old_txt)
      const patch_from_text = dmp.patch_fromText(txt_patch);
      const patch_apply = dmp.patch_apply(patch_from_text, old_txt)
    
      if (patch_apply[1][0]){
        console.log("arrived to patch ", patch_apply[0])
        return patch_apply[0]
      }
      return old_txt;
    }        
    return txt_patch    
  }

const TextUtilities = {
    encode,
    processUpdate,
    decode,
    similarity,
    hashCode,
    getLocalCaption
}
export default TextUtilities;