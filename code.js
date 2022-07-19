console.log("v1");

fetch("https://fnbr.co/api/shop", {
  headers: {
    "x-api-key": "0332575c-faea-4ebd-886e-bc83c74de080"
  }
})
  .then(res => res.json())
  .then(obj => {
    console.log(obj);

    let item_list = obj.data.daily.concat(obj.data.featured);
    item_list.forEach((item, i) => {
      let dates = item.history.dates;
      dates = dates?.sort((a, b) => new Date(b) - new Date(a));
      var d = 0;
      let t = "";
      if (!dates) {
        item["score"] = 0;
        item["score_text"] = "??";
      } else {
        if (dates[1]) {
          d = new Date() - new Date(item.history.dates[1]).getTime();
          t = DateToTextPls(new Date(item.history.dates[1]));
        } else {
          d = new Date() - new Date(item.history.dates[0]).getTime();
          t = DateToTextPls(new Date(item.history.dates[0]));
        }
        var dd = d / (1000 * 3600 * 24);
        item["score"] = dd;
        if (dd < 1) {
          item["score_text"] = "NOUVEAU !";
        } else {
          item["score_text"] = t;
        }
      }
    });
    let slist = item_list.map(i => i.type).sort();
    console.log(slist);

    obj.data.sections.forEach((section, i) => {
      section.items.forEach((item, i) => {
        let cosmetic = item_list.find(i => i.id == item);
        section.items[i] = cosmetic;
      });
    });

    obj.data.sections.forEach((item, i) => {
      let section = document.createElement("section");
      let section_title = document.createElement("h2");
      section_title.innerHTML = item.displayName;
      let div = document.createElement("div");
      let items = item.items.sort((a, b) => b.score - a.score);

      ["bundle", "outfit", "pickaxe", "glider", "backpack", "skydive", "emote", "wrap", "music", "loading", "misc"].forEach((item_type, i) => {
        items.filter(c => c.type == item_type).forEach((cosmetic, i) => {
          let img = "icon";
          if (item_type == "outfit") img = "featured"
          let f = makeFiguregPls(cosmetic, img);
          div.appendChild(f);
        });
      });

      section.appendChild(section_title);
      section.appendChild(div);
      document.querySelector("body").appendChild(section);
    });
  });

function makeFiguregPls(cosmetic, image_name) {
  let f = document.createElement("figure");
  f.properties = cosmetic;
  f.onclick = function (e) {
    let data = e.target.properties;
    console.log(data);
    document.getElementById("price").innerHTML = data.price + "<img src='" +  data.priceIconLink + "' />";
    document.getElementById("rarity_type").innerHTML = data.rarity.split("_").join(" ") + " | " + data.type;
    document.getElementById("description").innerHTML = "Pas vu dans la boutique depuis " + data.score_text + "</br></br>Sortie le " + new Date(data.history.firstSeen).toLocaleDateString() + ", il y a " + DateToTextPls(new Date(data.history.firstSeen)) + "</br></br>Apparu " + data.history.occurrences + " fois dans la boutique</br></br>" + data.description;
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("icon").src = data.images.icon;
    if (data.images.featured) {
      document.getElementById("img").src = data.images.featured;
    } else {
      document.getElementById("img").src = data.images.icon;
    }
    document.getElementById("window").className = "";
    document.getElementById("window").classList.add(data.rarity);
  }
  let img_div = document.createElement("div");
  let img = document.createElement("img");
  img.src = cosmetic.images[image_name];
  f.classList.add(cosmetic.type);
  if (cosmetic.score > 300) f.classList.add("gold");
  let p = document.createElement("span");
  p.innerHTML = cosmetic.score_text + " (x" + cosmetic.history.occurrences + ")";
  img_div.appendChild(img)
  f.appendChild(img_div);
  f.appendChild(p);
  f.classList.add(cosmetic.rarity);
  return f;
}

function closeWindowPls(e) {
document.getElementById("window").classList.add("none");
}


function DateToTextPls(x) {
  let new_time = [];
  let text_time = [];
  let date = new Date();
  //Calcule de la différance
  new_time = [
    date.getUTCFullYear() - x.getUTCFullYear(),
    date.getUTCMonth() - x.getUTCMonth(),
    date.getUTCDate() - x.getUTCDate(),
    date.getHours() - x.getHours(),
    date.getMinutes() - x.getMinutes(),
    date.getSeconds() - x.getSeconds()
  ];
  new_time[5] = new_time[5] + 2;
  //Mettre en positif
  if (new_time[5] < 0) {
    //secondes
    new_time[5] = new_time[5] + 60;
    new_time[4] = new_time[4] - 1;
  }
  if (new_time[4] < 0) {
    //minutes
    new_time[4] = new_time[4] + 60;
    new_time[3] = new_time[3] - 1;
  }
  if (new_time[3] < 0) {
    //heures
    new_time[3] = new_time[3] + 23;
    new_time[2] = new_time[2] - 1;
  }
  if (new_time[2] < 0) {
    //jours
    new_time[2] = new_time[2] + 30;
    new_time[1] = new_time[1] - 1;
  }
  if (new_time[1] < 0) {
    //mois
    new_time[1] = new_time[1] + 12;
    new_time[0] = new_time[0] - 1;
  }
  //Mettre en texte
  if (new_time[5] == 0) {
    //secondes
    new_time[5] = "";
  } else if (new_time[5] == 1) {
    new_time[5] = "1 seconde";
  } else {
    new_time[5] = new_time[5] + " seconds";
  }
  if (new_time[4] == 0) {
    //minutes
    new_time[4] = "";
  } else if (new_time[4] == 1) {
    new_time[4] = "1 minute";
  } else {
    new_time[4] = new_time[4] + " minutes";
  }
  if (new_time[3] == 0) {
    //heures
    new_time[3] = "";
  } else if (new_time[3] == 1) {
    new_time[3] = "1 heure";
  } else {
    new_time[3] = new_time[3] + " heures";
  }
  if (new_time[2] == 0) {
    //jours
    new_time[2] = "";
  } else if (new_time[2] == 1) {
    new_time[2] = "1 jour";
  } else {
    new_time[2] = new_time[2] + " jours";
  }
  if (new_time[1] == 0) {
    //mois
    new_time[1] = "";
  } else {
    new_time[1] = new_time[1] + " mois";
  }
  if (new_time[0] == 0) {
    //années
    new_time[0] = "";
  } else if (new_time[0] == 1) {
    new_time[0] = "1 an";
  } else {
    new_time[0] = new_time[0] + " ans";
  }
  //Suppression du vide
  new_time = new_time.filter(item => item !== "");
  //Si 1 seul
  if (new_time.length < 2) {
    new_time = new_time[0];
  } else {
    //Si plusieur, on en garde 2
    new_time = new_time[0] + " et " + new_time[1];
  }
  //On l'ajoute avec les autres dates
  return new_time;
}
