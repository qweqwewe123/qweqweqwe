const Discord = require("discord.js");
const db = require("quick.db")
exports.run = async (client, message, args) => {
const db = require("quick.db")
 if (!message.member.roles.has("734196640273006703")) return message.reply('Bu komutu kullanabilmek için <@&734196640273006703> rolüne sahip olmalısın.');
let member = message.mentions.members.first();
let isim = args.slice(1).join("  ");
let tag = "୪"
if (!member) return message.channel.send("Bir Üye Etiketle!");
if (!isim) return message.channel.send("Bir Isim Yaz!");
member.setNickname(`${tag} ${isim}`);
member.setNickname(`${tag} ${isim}`);
member.removeRole('734196650305913032')
member.removeRole('734196650305913032')
member.removeRole('734196649601007727')
member.removeRole('734196649601007727')
member.addRole('734196626188664862')
member.addRole('734196627316670536')
member.addRole('734196628193411122')
member.addRole('734196645524144128')
member.addRole('734196626188664862')
member.addRole('734196627316670536')
member.addRole('734196628193411122')
member.addRole('734196645524144128')
const embed = new Discord.RichEmbed()



.addField(`SAYGI`,
`\n<a:637319403410685971:723575732223082595> Kayıt Edilen Kullanıcı: ${member.user} <a:637319403410685971:723575732223082595>\n\n<a:637319403410685971:723575732223082595> Kayıt Eden: \`${message.author.username}\` <a:637319403410685971:723575732223082595>\n\n<a:690171745499611251:723575702951165973> Verilen Roller <@&734196645524144128> , <@&734196626188664862> , <@&734196627316670536> ve <@&734196628193411122> <a:690171745499611251:723575702951165973>`)
client.channels.get('734196718295318559').send(embed)
}

exports.conf = {
enabled: true,
guildOnly: true,
aliases: ['k','kadın'],
permLevel: 0
};
exports.help = {
name: "kız",
description: "Iperia Kız Kayıt",
usage: "Iperia Kayıt"
};