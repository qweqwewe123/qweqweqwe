const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const googleTTS = require('google-tts-api');
const { Client, Util } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);


client.on("guildMemberAdd", member => {
  let aylartoplam = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık"
  };
  let aylar = aylartoplam;
  let rol = "";
  let user = client.users.get(member.id);
  require("moment-duration-format");

  const kurulus = new Date().getTime() - user.createdAt.getTime();
  const gün = moment.duration(kurulus).format("D");
  var kontrol;
  if (gün < 7) kontrol = "Güvenilir Değil <a:guvensiz:723576360664170537>";
  if (gün > 7) kontrol = "Güvenilir <a:guvenli:723576330280632520>";

  let kanal = "734196717247004673"; //Mesajın yazacagı kanal
  if (!kanal) return;
  member.guild.channels
    .get(kanal)
    .send(
      `**<a:file47:723575794034540595> __WELCOME TO SAYGI__ <a:file47:723575794034540595>\n\n<a:file643:723575764670480444> Hoşgeldin ${member} seninle ${member
        .guild.memberCount ||
        "DiscordAPI"} kişiyiz! <a:file643:723575764670480444>\n\n<a:file134:723575986435784704> Kaydının yapılması için sesli odaya gelip ses vermen gerekli <a:file134:723575986435784704>\n\n<a:5_:723575738011222078> Hesap Kuruluş Zamanı: ${moment(
        user.createdAt
      ).format("DD")} ${aylar[moment(user.createdAt).format("MM")]} ${moment(
        user.createdAt
      ).format(
        "YYYY HH:mm:ss"
      )} <a:5_:723575738011222078>\n\n<a:file682:723575736073715772> Bu Kullanıcı: ${kontrol}\n\n<a:file776:723575871176179872> <@&734196640273006703> Rolündeki yetkililer seninle ilgilenecektir <a:file776:723575871176179872>**`
  );

});

client.on("guildMemberAdd", member => {
  member.send(
    `<a:file49:723575767753162834> Saygı'ya Hoşgeldin!! <a:file49:723575767753162834>\n\n<a:file649:723575741849010186> Tag Alıp Bize Katılmanı Çok İsteriz <a:file649:723575741849010186>\n\n<a:file47:723575794034540595> https://discord.gg/8rGmx9z <a:file47:723575794034540595>`
  );
});

/////////////
client.on("ready", () => {
  console.log(`Bot Aktif`);
  setInterval(function() {
    let kanal = client.channels.get("734196717247004673");
    if (kanal) {
      kanal.send("Kayıt Olmak için Solda Bulunan Ses Kanallarına Giriniz. <@&734196650305913032> ");
    }
  }, 5000000);
});


client.on("guildMemberAdd", member => {
  var rol = member.guild.roles.get("734196649601007727");
  var rol = member.guild.roles.get("734196649601007727");
  var rol = member.guild.roles.get("734196650305913032");
  var rol = member.guild.roles.get("734196650305913032");
  member.addRole(rol.id);
});


client.on("guildMemberAdd", member => {
  var rol = member.guild.roles.get("734196649601007727");
  var rol = member.guild.roles.get("734196650305913032");
   member.addRole(rol.id)
   member.setNickname("୪ İsminizi Düzeltiniz")    
   });

client.on("guildMemberAdd", member => {

if(member.user.username.includes("୪")){
member.addRole("734196640511950900")
  member.addRole("734196640511950900")
}
})

///////////////////////////////
client.on("message", async message => {
const dcsk = client.channels.get("734196753351442453")
let dcst = "୪"

  const voiceChannels = message.guild.channels.filter(c => c.type === "voice");
  let count = 0;
  for (const [id, voiceChannel] of voiceChannels)
    count += voiceChannel.members.size;

  var sessayı = count.toString().replace(/ /g, "    ");
  var üs2 = sessayı.match(/([0-9])/g);
  sessayı = sessayı.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs2) {
    sessayı = sessayı.replace(/([0-9])/g, d => {
      return {
        "0": "<a:0_:729451693665681438>",
        "1": "<a:1_:729451685663080594>",
        "2": "<a:2_:729451692378161162>",
        "3": "<a:3_:729451692399132732>",
        "4": "️<a:4_:729451690700570656>",
        "5": "<a:5_:729451693154238545>",
        "6": "️<a:6_:729451694517125200>",
        "7": "️<a:7_:729451692965232660>",
        "8": "<a:8_:729451695372763177>",
        "9": "️<a:9_:729451694903263323>"
      }[d];
    });
  }

  var tags = message.guild.members
    .filter(member => member.user.username.includes(dcst))
    .size.toString();
  if (tags) {
    tags = tags.replace(/([0-9])/g, d => {
      return {
        "0": "<a:0_:729451693665681438>",
        "1": "<a:1_:729451685663080594>",
        "2": "<a:2_:729451692378161162>",
        "3": "<a:3_:729451692399132732>",
        "4": "️<a:4_:729451690700570656>",
        "5": "<a:5_:729451693154238545>",
        "6": "️<a:6_:729451694517125200>",
        "7": "️<a:7_:729451692965232660>",
        "8": "<a:8_:729451695372763177>",
        "9": "️<a:9_:729451694903263323>"
      }[d];
    });
  }

  var onlayn = message.guild.members
    .filter(m => m.presence.status !== "offline")
    .size.toString()
    .replace(/ /g, "    ");
  var üs4 = onlayn.match(/([0-9])/g);
  onlayn = onlayn.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs4) {
    onlayn = onlayn.replace(/([0-9])/g, d => {
      return {
        "0": "<a:0_:729451693665681438>",
        "1": "<a:1_:729451685663080594>",
        "2": "<a:2_:729451692378161162>",
        "3": "<a:3_:729451692399132732>",
        "4": "️<a:4_:729451690700570656>",
        "5": "<a:5_:729451693154238545>",
        "6": "️<a:6_:729451694517125200>",
        "7": "️<a:7_:729451692965232660>",
        "8": "<a:8_:729451695372763177>",
        "9": "️<a:9_:729451694903263323>"
      }[d];
    });
  }

  var üyesayısı = message.guild.memberCount.toString().replace(/ /g, "");
  var üs = üyesayısı.match(/([0-9])/g);
  üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs) {
    üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
      return {
        "0": "<a:0_:729451693665681438>",
        "1": "<a:1_:729451685663080594>",
        "2": "<a:2_:729451692378161162>",
        "3": "<a:3_:729451692399132732>",
        "4": "️<a:4_:729451690700570656>",
        "5": "<a:5_:729451693154238545>",
        "6": "️<a:6_:729451694517125200>",
        "7": "️<a:7_:729451692965232660>",
        "8": "<a:8_:729451695372763177>",
        "9": "️<a:9_:729451694903263323>"
      }[d];
    });
  }

dcsk.setTopic(`**Toplam Üye: __${üyesayısı}__**\n **Toplam Online: __${onlayn}__**\n **Sesteki Üye: __${sessayı}__**\n **Taglı Üye: __${tags}__**`)

})

////////////////////////////////////////////////
client.on("voiceStateUpdate", async (oldMember, newMember) => {
  let kanalID = "734196722275975188";   
  if (newMember.id !== client.user.id && newMember.voiceChannel && newMember.voiceChannel.id === kanalID) {
    googleTTS("Sunucuya Hoşgeldiniz,Az Sonra Teyit Yetkililerimiz Sizinle İlgilenicektir,İyi Eğlenceler!", "tr", 1).then(soylenecek => {
      newMember.voiceChannel.join().then(kanal => {
        kanal.playStream(soylenecek).on("end", () => {
          setTimeout(() => {
            newMember.voiceChannel.leave();
          }, 15000)
        });
      });
    });
  };
});

client.on("voiceStateUpdate", async (oldMember, newMember) => {
  let kanalID = "734196725295874058";   
  if (newMember.id !== client.user.id && newMember.voiceChannel && newMember.voiceChannel.id === kanalID) {
    googleTTS("Sunucuya Hoşgeldiniz,Az Sonra Teyit Yetkililerimiz Sizinle İlgilenicektir,İyi Eğlenceler!", "tr", 1).then(soylenecek => {
      newMember.voiceChannel.join().then(kanal => {
        kanal.playStream(soylenecek).on("end", () => {
          setTimeout(() => {
            newMember.voiceChannel.leave();
          }, 15000)
        });
      });
    });
  };
});

client.on("voiceStateUpdate", async (oldMember, newMember) => {
  let kanalID = "734196727002824825";   
  if (newMember.id !== client.user.id && newMember.voiceChannel && newMember.voiceChannel.id === kanalID) {
    googleTTS("Sunucuya Hoşgeldiniz,Az Sonra Teyit Yetkililerimiz Sizinle İlgilenicektir,İyi Eğlenceler!", "tr", 1).then(soylenecek => {
      newMember.voiceChannel.join().then(kanal => {
        kanal.playStream(soylenecek).on("end", () => {
          setTimeout(() => {
            newMember.voiceChannel.leave();
          }, 15000)
        });
      });
    });
  };
});