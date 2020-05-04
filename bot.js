const Discord = require("discord.js");
const wol = require("node-wol");
const config = require("./config.json");
const client = new Discord.Client();
const request = require("request");
const prefix = config.prefix;

// variable setup
let precommand;
let sentence;

let valid = "(Valid)";

let uptimeM = 0;
let uptimeH = 0;
let uptimeD = 0;

let date;
let dateWhole;
timeInfo();
// Do every minute
setInterval(function doneEveryHour(){
	// Update date
	timeInfo();
	// Uptime
	uptimeM = (uptimeM + 1);
	if (uptimeM >= 60) {
		uptimeH ++;
		uptimeM -= 60;
	}
	if (uptimeH >= 24) {
		uptimeD ++;
		uptimeH -= 24;
	}
	
	// Special dates - I don't remember if these ever worked
	if (date == "24.12 8:0") {
		client.channels.get("325982695874363393").send("Merry Christmas!!! :santa: :gift:");
	}

	if (date == "1.1 0:0") {
		client.channels.get("325982695874363393").send("Happy New Year!!! :fireworks: :wine_glass:");
	}
}, 60000);

function timeInfo(){
	dateWhole = new Date();
	date = dateWhole.getDate() + "." + (dateWhole.getMonth() + 1) + " " + dateWhole.getHours() + ":" + dateWhole.getMinutes();
	dateWithoutMinutes = dateWhole.getDate() + "." + (dateWhole.getMonth() + 1) + " " + dateWhole.getHours();
}

function sleep(milliseconds) {
  let start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
	if ((new Date().getTime() - start) > milliseconds){
	  break;
	}
  }
}

function randomizer(answers){
	answer = answers[Math.floor(Math.random() * answers.length)];
	return answer;
}

console.log(date + ": Setup Done!");

client.on("ready", function() {
	client.user.setActivity(prefix + "help", { type: "LISTENING" });
	console.log(date + ": Connected!\n");
	console.log("Version: " + config.version + " - Last Updated: " + config.updateDate);
});


client.on("message", function(message) {
	if (message.author.equals(client.user)) return;
	
	const args = message.content.split(' ').slice(1).join(" ");
	
	if  (message.content.startsWith(prefix)){
		const command = message.content.substring(1).toLowerCase().split(" ");
		precommand = command.shift();
		switch(precommand){
			case "help":
				embed = {
						"title": "TeflonBot version " + config.version + " - Commands:",
						"description": "'Help\n\n'Uptime - How long has the bot been up?\n\n'Jaa - Link the Nuuskamuikkunen jaa\n\n'8Ball [Question] - Ask from the 8ball.\n\n'Coinflip [choise] [choise] (Can be infinite amount or if left empty is defaultet to y/n) - Chooses randomily one of the choisesa\n\n'PSA [Message] - Announce flashy\n\n'FreeGame [Keycode/link] - Announce on freegames channel\n\n'Bday [Name] - Good LvlUp day!\n\n'Booty - ( ͡° ͜ʖ ͡° )\n\n'NO - Office Michael NO GOD PLEASE NO! video\n\n'osu! [Username / ID] - Can he hit or not? :thinking:\n\n'F - Press F to pay respect\n\n'sale - Steam sale announcement",
						"color": config.embedColor
					};
					message.channel.send({ embed });
			break;
				
			case "start": // This is the start of silly easter egg hunt
				message.author.send("Memes are cool. Actually we even have a meme channel ;)");
				message.author.send("http://trapigtrogen.dy.fi/MyWeb/site/colors.html");
			break;
				
			case "wol": // I wanted to be able to start my PC from anywhere so I set up this.
			// You can use this but the ID on the line needs to be changed to your Discord ID and the mac addresses obviously to be put on the config 
				if (message.author.id == "ID"){
					console.log("Wol started...");
				wol.wake(config.MACEthernet, {
					address: '192.168.0.255',
					port: 9, 
				},function(error){
					if(error){
						client.channels.get(config.debugchannelid).send("Wol error");
						return;
					}
				});
				console.log("Wol done (ethernet)");
				client.channels.get(config.debugchannelid).send("Wol done");
					
				//wifi-kortti
				wol.wake(config.MACWifi, {
					address: '192.168.0.255',
					port: 9
				}, 
				function(error){
					if(error){
						client.channels.get(config.debugchannelid).send("Wol error");
						return;
					}
				});
				console.log("Wol done (wifi)");
				client.channels.get(config.debugchannelid).send("Wol done");
				}
				else message.channel.send("`Invalid command: " + message.content + "`");
			break;
				
			case "uptime":
				let tellUptime = (uptimeD + " Days " + uptimeH + " Hours " + uptimeM + " Minutes");
				message.channel.send("`Bot has been running " + tellUptime + "`");
			break;
				
			case "f":
				let answers = [
					'', 'blue_', 'yellow_', 'green_', 'purple_', 'black_'];
				randomizer(answers);
				message.channel.send("**" + message.author.username + "** has paid their respects :" + answer + "heart:");
			break;
				
			case "jaa": // Is a finnish meme
				message.channel.send("https://soundcloud.com/samuli-trapigtrogen-piipponen/jaa/s-95oUr");
				sleep(200);
				message.channel.send("<:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569><:jaa:328150735781101569>");
			break;
				
			case "no":
				message.channel.send("https://youtu.be/H07zYvkNYL8?t=3s");
			break;

			case "sale":
				message.channel.send("@everyone :raised_hands: STEAM SALE HAS STARTED!!! ALL HAIL LORD GABEN!!! :raised_hands:");
				sleep(200);
				message.channel.send("https://www.youtube.com/watch?v=rP2MDtWu5t0");
			break;

			case "booty":
				message.channel.send("( ͡° ͜ʖ ͡° )( ͡° ͜ʖ ͡° )( ͡° ͜ʖ ͡° )( ͡° ͜ʖ ͡° )( ͡° ͜ʖ ͡° ( ͡° ͜ʖ ͡° )( ͡° ͜ʖ ͡° ( ͡° ͜ʖ ͡° )( ͡° ͜ʖ ͡° )");
				sleep(200);
				message.channel.send("https://www.youtube.com/watch?v=NS7z0Ph668E");
			break;
				
			case "bday":
				const person = message.content.substring(6);
				if (person == "" ){
					message.author.send("```Usage:\n'bday [the person who's birthday it is]```");
				}
				else {
					message.channel.send("Hello @everyone! It's" + person + "'s birthday today! https://www.youtube.com/watch?v=3kyn9Es4HoY");
					sleep(200);
					message.channel.send(":tada: :balloon: :birthday: :gift: :confetti_ball: :tada: :balloon: :birthday: :gift:");
				}
			break;
				
			case "8ball":
				sentence = message.content.substring(7);
				if (command[0] == undefined) {
					message.author.send("```\nYou forgot the question.\nKUsage:\n'8ball [the question]```");
				}
				else {
					let answers = [ // Didn't bother to translate these. Make your own or get them somewhere. They're the standard 8ball answers
						'Ehkä.', 'No ei tosiaankaan.', 'Toivottavasti.', 'Unissas.', 'Siihen on aika hyvät mahikset.', 'Melko varmasti.', 'Luulisin.', 'Toivottavasti ei.',
						'Toivottavasti.', 'Ei ikinä!', 'Ahaha! Oikeesti?!?', 'Pfft.', 'Sori.', 'Totta helvetissä.', 'Ei vitus.', 'Synkkä tulevaisuus.', 'Tyhmä kysymys lmao',
						'Tulevaisuus on epäselvä.', 'Olisin mielummin vastaamatta.', 'Ketä kiinnostaa?', 'Mahdollisesti.', 'Ei ikipäivänä.', 'Siihen on pieni mahdollisuus.', 'Kyllä!', 'Kysy myöhemmin uudelleen.'];
					randomizer(answers);
					embed = {
						"title": ":8ball: " + sentence,
						"description": "**" + answer + "**",
						"color": config.embedColor
					};
					message.channel.send({ embed });
				}
			break;

			case "coinflip":
				if (command[0] == undefined || command[1] == undefined) {
					command[0] = "Yes"
					command[1] = "No"
				}
				randomizer(command);
				embed = {
					"description": "**" + answer + "**",
					"color": config.embedColor,
					"author": {
						"name": "Coinflip result:",
						"icon_url": "https://cdn.discordapp.com/emojis/467302593870299146.png?v=1"
					},
				};
				message.channel.send({ embed });
			break;
				
			case "osu!":
			case "osu":
				if (command[0] == undefined) {
					message.author.send("```Usage:\n'osu [Username / ID]```");
				}
				else {
					let osuSearch = command.join(" ");
					request({
	  					url: 'https://osu.ppy.sh/api/get_user?u=' + osuSearch + '&k=' + config.osuKey,
	 					json: true
					}, function(error, response, osuStats) {
						let osuUserInfo = osuStats[0];
						if(osuUserInfo != undefined){
							let osuAcc = parseFloat(osuUserInfo.accuracy).toFixed(2);
							embed = {
								"title": "**" + osuUserInfo.username + "'s osu! Stats:**",
								"url": "https://osu.ppy.sh/u/" + osuUserInfo.user_id,
								"color": config.embedColor,
								"thumbnail": {
									"url": "https://a.ppy.sh/" + osuUserInfo.user_id
								},
								"fields": [
								  {
									"name": "Player ID:",
									"value": osuUserInfo.user_id,
									"inline": true
								  },
								  {
									"name": "Country:",
									"value": osuUserInfo.country,
									"inline": true
								  },
								  {
									"name": "Rank:",
									"value": osuUserInfo.pp_rank,
									"inline": true
								  },
								  {
									"name": "Country Rank:",
									"value": osuUserInfo.pp_country_rank,
									"inline": true
								  },
								  {
									"name": "Accuracy:",
									"value": osuAcc,
									"inline": true
								  },
								  {
									"name": "Playcount:",
									"value": osuUserInfo.playcount,
									"inline": true
								  }
								]
							};
							message.channel.send({ embed });
						}
						else{
							message.channel.send("User " + osuSearch + " not found!");
						}
					});
				}
			break;
				
			case "psa":
				sentence = message.content.substring(5);
				if (sentence == "" ){
					message.author.send("```Usage:\n'PSA [the message]```");
				}
				else {
					embed = {
						"title": "Huomio!",
						"description": sentence,
						"color": config.embedColor,
						"thumbnail": {
							"url": "https://puu.sh/AZxe5.png"
						}
					};
					message.channel.send("@everyone");
					message.channel.send({ embed });
				}
			break;
				
			case "freegame":
				sentence = message.content.substring(10);
				if (sentence == "" ){
					message.author.send("```Usage:\n'FreeGame [possible message + key / link to free game]```");
				}
				else {
					embed = {
						"title": "Free shit!",
						"description": sentence,
						"color": config.embedColor,
						"image": {
							"url": "https://puu.sh/B8rUY.jpg"
						},
						"thumbnail": {
							"url": "https://puu.sh/AZxe5.png"
						}
					};
					client.channels.get("464362026454745089").send({ embed });
				}
			break;	
			
			default:
				message.author.send("`Invalid command: " + message.content + "`\n`Try using 'help`");
				valid = "(invalid)";
			break;
		};
			

		//Log commands
		console.log(date + ": " + message.author.username + " used command " + precommand + valid + " with parameters [" + command + "]\n");
		client.channels.get(config.debugchannelid).send(date + ": " + message.author.username + " used command **" + precommand + "** " + valid + " with parameters [" + command + "]");
		valid = "(valid)"; 	//reset validity
	}	
	
	// EASTER EGGS:
	switch(message.content){
		case "🥚":
			message.channel.send("https://cdn.bulbagarden.net/upload/6/6b/175Togepi.png");
			message.channel.send("SURPRISEE! You found interesting egg surprise! <:pogchamp:537264429406879744>");
			client.channels.get(config.debugchannelid).send(date + ": " + message.author.username + " found the egg surprise! <:pogchamp:537264429406879744>");
			message.delete();
			break;
		case "We are number one!":
			if(message.channel.id == "401004704458473492"){
				message.author.send("Excelent! This is it for now but will continue some day.. Maybe :thinking:");
				message.delete();
			}
			break;
	}
});

client.on('uncaughtException', (e) => console.error(date + ": " + e));
client.on('error', (e) => console.error(date + ": " + e));
client.on('warn', (e) => console.error(date + ": " + e));
client.login(config.token);