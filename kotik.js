(function () {
    // Table with keys being the keywords and values being the sound files
    var sounds = {
        dryad: "audio/dryad.ogg",
        farm: "audio/farm.ogg",
        gold: "audio/gold.ogg",
        idisuda: "audio/idisuda.ogg",
        meow: "audio/meow.ogg",
        nedarom: "audio/nedarom.ogg",
        netak: "audio/netak.ogg",
        perfectplan: "audio/perfectplan.ogg",
        podcast: "audio/podcast.ogg",
        purr: "audio/purr.ogg",
        rest: "audio/rest.ogg",
        sergey: "audio/sergey.ogg",
        leeroy: "audio/leeroy.ogg",
        murloc: "audio/murloc.ogg"
    };

    piepan.On('connect', function() {
        console.log("Kotik loaded!");
    });
    
    piepan.On('message', function(e) {
        if (e.Sender == null) {
            return;
        }

        // #[sound]: play sound
        var search = e.Message.match(/#(\w+)/);
        if (search && sounds[search[1]]) {
            var soundFile = sounds[search[1]];

            if (!e.Sender.IsRegistered()) {
                e.Sender.Send("You must be registered on the server to trigger sounds.");
                return;
            }

            if (piepan.Audio.IsPlaying()) {
                return;
            }

            piepan.Audio.Play({
                filename: soundFile
            });
        }

        // !moveto [channel id]: move to channel
		var search = e.Message.match(/^!moveto[ ]?(\d+)/);
		if (search) {
		    piepan.Self.Move(piepan.Channels[search[1]]);
        }

        var printChildChannels = new function(out,channel,level){
        	for(var key in channel){
       			for (var i = 0; i <level; i++) {
        			out+='-'; 		
        		}
        		out+=channel[key].ID + ": " + channel[key].Name+"<br/>";
        		if(channel[key].Children.length > 0){
					printChildChannels(out,channel[key].Children,level+1);
				}
        	}
        };
		
		// !list: list channels
		var search = e.Message.match(/^!list/);
		var channels="";
		if (search) {
			Channel root = piepan.Channels.Find("Root");
			if(root != null){
				channels+=root.ID + ": " + root.Name+"<br/>";
				if(root.Children.length > 0){
					printChildChannels(channels,root.Children,1);
				}
			}
		    /*for (var key in piepan.Channels) {
				channels+=piepan.Channels[key].ID + ": " + piepan.Channels[key].Name+"<br/>";
				if(piepan.Channels[key].Children.length > 0){
					printChildChannels(channels,piepan.Channels[key].Children,1);
				}
		    }*/
            e.Sender.Send(channels);
    	}
		
		// !stop: stop audio
		var search = e.Message.match(/^!stop/);
		if (search) {
		    piepan.Audio.Stop();
        }
		
		// !help: display help message
		var search = e.Message.match(/^!help/);
		if (search) {
			e.Sender.Send("#[sound]     : воспроизводит звук. Доступные звуки: meow|gold|farm|dryad|purr|sergey|idisuda|podcast|perfectplan|nedarom|netak|rest|leeroy|murloc");
			e.Sender.Send("!stop        : останавливает текущий звук");
			e.Sender.Send("!list        : список каналов");
			e.Sender.Send("!moveto [id] : перейти на канал");
			e.Sender.Send("!help        : выводит справку");
            e.Sender.Send("!volume [fl] : устанавливает громкость. Дефолт: 1.0");
		}
		
        // !volume: change volume, default is 1.0
        var search = e.Message.match(/^!volume[ ]?(\d+[.]?[\d]?)/);
        if (search) {
            piepan.Audio.SetVolume(search[1]);
        }
    });
})();