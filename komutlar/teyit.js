const Discord = require("discord.js"); //dcs ekibi
const client = new Discord.Client();
const db = require("quick.db");
const moment = require("moment");

exports.run = async (client, message, args, presence) => {
  
  let user = message.mentions.users.first();

  if (!user) user = message.author;
//dcs ekibi
  const member = message.guild.member(user);
  let kız = await db.fetch(`kizteyit_${member.id}`);
  let erkek = await db.fetch(`erkekteyit.${member.id}`);
  

  let k_uses = ""
  let e_uses = ""
  
  if (!kız) {
    if (kız  === null || kız === undefined || kız === NaN)
    k_uses = 0
  } else {
  k_uses = kız
  }
  if (!erkek) {
    if (erkek === null || erkek === undefined || erkek === NaN)
    e_uses = 0
  } else {
    e_uses = erkek
  }

let teyit = e_uses + k_uses
  
  const embed = new Discord.RichEmbed()
  .setThumbnail(user.avatarURL)
  .setFooter(client.user.username, client.user.avatarURL)
  .setTitle(`KULLANICI BİLGİLERİ`)
  .setDescription(`
Teyit sayısı : (Erkek : **${e_uses}**) (Kız : **${k_uses}**)
Toplam Teyit Sayısı : **${teyit}**

`);
 
  
  message.channel.send(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["tb","rank","info","information"],
  permLevel: 0
};
//dcs ekibi
exports.help = {
  name: "teyit-bilgi",
  category: "kullanıcı",
  description: "İstediğiniz kullanıcı hakkında bilgi verir.",
  usage: "teyit-bilgi <@kişi-etiket>"
};